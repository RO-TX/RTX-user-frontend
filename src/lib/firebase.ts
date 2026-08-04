/**
 * Google sign-in, browser side.
 *
 * Firebase is only ever used to prove *who the person is*. It is not this
 * app's session: the ID token it hands back is posted straight to
 * `POST /auth/google`, the backend verifies the signature and returns the
 * same access token + httpOnly refresh cookie every other sign-in returns.
 * Everything downstream — /auth/me, orders, addresses — is unchanged and
 * still talks only to RTX. Firebase never becomes a second source of truth.
 *
 * The SDK is imported dynamically inside `signInWithGoogle` rather than at
 * the top of the file: it is ~200kB, nothing renders from it, and most
 * visitors never touch the button. This also keeps it out of the server
 * bundle, where `getAuth()` would have no `window` to attach to.
 *
 * Note on the config below: none of it is secret. A Firebase web config is
 * meant to ship in the client — access is controlled by the authorised-domain
 * list and the Firebase security rules, not by hiding these strings.
 */

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Whether the button should be offered at all. A build with no Firebase keys
 * hides it rather than showing a control that can only fail — the password
 * form is still a complete way in.
 */
export const googleAuthReady = Boolean(config.apiKey && config.authDomain && config.projectId);

/** Firebase's own error codes, turned into something a customer can act on. */
function readable(code: string): string {
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in cancelled.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google window. Allow pop-ups for this site and try again.';
    case 'auth/unauthorized-domain':
      return 'This address is not on the Firebase authorised-domains list yet.';
    case 'auth/network-request-failed':
      return 'Could not reach Google — check your connection.';
    case 'auth/account-exists-with-different-credential':
      return 'That email already has an account. Sign in with your password instead.';
    default:
      return 'Google sign-in failed. Please try again.';
  }
}

export class GoogleAuthError extends Error {
  readonly code: string;
  /** True when the person simply backed out — not worth showing as an error. */
  readonly cancelled: boolean;

  constructor(code: string) {
    super(readable(code));
    this.code = code;
    this.cancelled =
      code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request';
  }
}

/**
 * Open the Google popup and return the resulting Firebase ID token.
 *
 * The Firebase session itself is signed straight back out: it has served its
 * one purpose by the time this returns, and leaving it live would mean two
 * sessions on the device that can expire independently of each other.
 */
export async function signInWithGoogle(): Promise<string> {
  if (!googleAuthReady) {
    throw new GoogleAuthError('auth/invalid-api-key');
  }

  const [{ initializeApp, getApps, getApp }, { getAuth, GoogleAuthProvider, signInWithPopup, signOut }] =
    await Promise.all([import('firebase/app'), import('firebase/auth')]);

  const app = getApps().length ? getApp() : initializeApp(config);
  const auth = getAuth(app);
  // Show the chooser every time. Without this, a browser with one Google
  // account signs in silently, which looks broken to anyone trying to switch.
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const cred = await signInWithPopup(auth, provider);
    const idToken = await cred.user.getIdToken();
    await signOut(auth).catch(() => {
      /* the token is already in hand — a stuck Firebase session is not fatal */
    });
    return idToken;
  } catch (err) {
    const code = (err as { code?: string })?.code ?? 'unknown';
    throw new GoogleAuthError(code);
  }
}
