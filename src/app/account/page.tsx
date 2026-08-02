import AppShell from '@/components/AppShell';
import AccountView from '@/components/AccountView';

export const metadata = { title: 'Account' };

/**
 * A shell only. Everything inside is client-rendered — see AccountView for
 * why the bearer-token routes cannot be read on the server.
 */
export default function AccountPage() {
  return (
    <AppShell tabBar>
      <AccountView />
      <div className="foot-space" />
    </AppShell>
  );
}
