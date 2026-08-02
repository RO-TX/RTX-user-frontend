'use client';

import { useState, type FormEvent } from 'react';
import { Check, ShieldCheck } from './Icons';
import PasswordField, { isStrongPassword, passwordProblems } from './PasswordField';
import { useAuth } from '@/lib/auth-context';
import { api, apiMessage } from '@/lib/api';

type Mode = 'signin' | 'signup' | 'forgot';

/**
 * Sign in / create account / reset password, inline — never a modal, so the
 * page keeps its place (checkout in particular must not lose the cart).
 *
 * Signup is two steps because the API is: `POST /auth/request-otp` emails a
 * six-digit code, `POST /auth/signup` will not take the account without it.
 */
export default function AuthPanel({
  heading = 'Sign in',
  intro = 'Your orders, addresses and service history live in your account.',
  onDone,
}: {
  heading?: string;
  intro?: string;
  onDone?: () => void;
}) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  /** Signup step 2 holds what step 1 collected while the code is in transit. */
  const [pending, setPending] = useState<Omit<Parameters<typeof signUp>[0], 'code'> | null>(null);
  /** Reset step 2 — the token arrives by email. */
  const [resetFor, setResetFor] = useState<string | null>(null);
  /** Controlled so the rule checklist can score it on every keystroke. */
  const [pw, setPw] = useState('');

  function switchMode(next: Mode) {
    setMode(next);
    setMsg(null);
    setPending(null);
    setResetFor(null);
    setPw('');
  }

  async function run(fn: () => Promise<void>, offline: string) {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
    } catch (err) {
      setMsg({ text: apiMessage(err, offline), ok: false });
    } finally {
      setBusy(false);
    }
  }

  const onSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    return run(async () => {
      // Signing in never checks the password against the rules — an account
      // made before they existed still has to be able to get in.
      await signIn(String(d.get('email') ?? ''), pw);
      onDone?.();
    }, 'Could not reach the store — try again in a moment.');
  };

  const onRequestOtp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const email = String(d.get('email') ?? '');
    const mobile = String(d.get('mobile') ?? '');
    const password = pw;

    if (!isStrongPassword(password)) {
      setMsg({ text: `Password still needs: ${passwordProblems(password).join(', ')}.`, ok: false });
      return;
    }
    if (mobile && !/^\d{10}$/.test(mobile)) {
      setMsg({ text: 'Mobile must be 10 digits.', ok: false });
      return;
    }

    return run(async () => {
      await api.auth.requestOtp(email);
      setPending({
        firstName: String(d.get('firstName') ?? ''),
        lastName: String(d.get('lastName') ?? ''),
        email,
        mobile: mobile || undefined,
        password,
      });
      setMsg({ text: `We sent a 6-digit code to ${email}.`, ok: true });
    }, 'Could not send the code — the store is unreachable.');
  };

  const onSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pending) return;
    const code = String(new FormData(e.currentTarget).get('code') ?? '');
    return run(async () => {
      await signUp({ ...pending, code });
      onDone?.();
    }, 'Could not create the account — the store is unreachable.');
  };

  const onForgot = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email') ?? '');
    return run(async () => {
      await api.auth.forgotPassword(email);
      setResetFor(email);
      setMsg({ text: `If that email has an account, a reset link is on its way.`, ok: true });
    }, 'Could not send the reset email.');
  };

  const onReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetFor) return;
    const d = new FormData(e.currentTarget);
    if (!isStrongPassword(pw)) {
      setMsg({ text: `Password still needs: ${passwordProblems(pw).join(', ')}.`, ok: false });
      return;
    }
    return run(async () => {
      await api.auth.resetPassword({
        email: resetFor,
        token: String(d.get('token') ?? ''),
        password: pw,
      });
      setMsg({ text: 'Password changed — sign in with the new one.', ok: true });
      setMode('signin');
      setResetFor(null);
      setPw('');
    }, 'Could not reset the password.');
  };

  return (
    <section className="auth" aria-labelledby="auth-h">
      <span className="auth__bubble" aria-hidden="true">
        <ShieldCheck />
      </span>
      <h1 id="auth-h">{heading}</h1>
      <p className="auth__intro">{intro}</p>

      <div className="auth__switch" role="tablist" aria-label="Account">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signin'}
          onClick={() => switchMode('signin')}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signup'}
          onClick={() => switchMode('signup')}
        >
          Create account
        </button>
      </div>

      {mode === 'signin' && (
        <form className="auth__form" onSubmit={onSignIn}>
          <div className="field">
            <label htmlFor="au-em">Email</label>
            <input id="au-em" name="email" type="email" required autoComplete="email" />
          </div>
          <PasswordField
            name="password"
            label="Password"
            value={pw}
            onChange={setPw}
            autoComplete="current-password"
          />
          <button className="btn btn--block" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          <button className="auth__link" type="button" onClick={() => switchMode('forgot')}>
            Forgotten your password?
          </button>
        </form>
      )}

      {mode === 'signup' && !pending && (
        <form className="auth__form" onSubmit={onRequestOtp}>
          <div className="field-2">
            <div className="field">
              <label htmlFor="au-fn">First name</label>
              <input id="au-fn" name="firstName" required autoComplete="given-name" />
            </div>
            <div className="field">
              <label htmlFor="au-ln">Last name</label>
              <input id="au-ln" name="lastName" required autoComplete="family-name" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="au-em2">Email</label>
            <input id="au-em2" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="au-mob">Mobile</label>
            <input
              id="au-mob"
              name="mobile"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel-national"
              placeholder="10 digits"
            />
          </div>
          <PasswordField
            name="password"
            label="Password"
            value={pw}
            onChange={setPw}
            autoComplete="new-password"
            showRules
            hint="At least 8 characters, with upper and lower case and a number."
          />
          <button className="btn btn--block" type="submit" disabled={busy}>
            {busy ? 'Sending code…' : 'Send verification code'}
          </button>
        </form>
      )}

      {mode === 'signup' && pending && (
        <form className="auth__form" onSubmit={onSignUp}>
          <div className="field">
            <label htmlFor="au-code">Verification code</label>
            <input
              id="au-code"
              name="code"
              required
              inputMode="numeric"
              maxLength={6}
              pattern="\d{6}"
              title="Six digit code"
              autoComplete="one-time-code"
              className="auth__code"
            />
            <span className="field__hint">Sent to {pending.email}. It expires in 10 minutes.</span>
          </div>
          <button className="btn btn--block" type="submit" disabled={busy}>
            {busy ? 'Creating account…' : 'Create account'}
          </button>
          <button className="auth__link" type="button" onClick={() => setPending(null)}>
            Use a different email
          </button>
        </form>
      )}

      {mode === 'forgot' && !resetFor && (
        <form className="auth__form" onSubmit={onForgot}>
          <div className="field">
            <label htmlFor="au-fem">Email</label>
            <input id="au-fem" name="email" type="email" required autoComplete="email" />
            <span className="field__hint">We will email you a reset token.</span>
          </div>
          <button className="btn btn--block" type="submit" disabled={busy}>
            {busy ? 'Sending…' : 'Email me a reset link'}
          </button>
          <button className="auth__link" type="button" onClick={() => switchMode('signin')}>
            Back to sign in
          </button>
        </form>
      )}

      {mode === 'forgot' && resetFor && (
        <form className="auth__form" onSubmit={onReset}>
          <div className="field">
            <label htmlFor="au-tok">Reset token</label>
            <input id="au-tok" name="token" required />
            <span className="field__hint">From the email we sent to {resetFor}.</span>
          </div>
          <PasswordField
            name="password"
            label="New password"
            value={pw}
            onChange={setPw}
            autoComplete="new-password"
            showRules
          />
          <button className="btn btn--block" type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Set new password'}
          </button>
          <button className="auth__link" type="button" onClick={() => switchMode('signin')}>
            Back to sign in
          </button>
        </form>
      )}

      {msg && (
        <p className={`sect__msg${msg.ok ? ' sect__msg--ok' : ' sect__msg--err'}`} role="status">
          {msg.ok && <Check />}
          {msg.text}
        </p>
      )}
    </section>
  );
}
