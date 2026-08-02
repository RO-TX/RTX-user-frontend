import AppShell from '@/components/AppShell';
import NavBar from '@/components/NavBar';
import CheckoutView from '@/components/CheckoutView';

export const metadata = { title: 'Checkout' };

export default function CheckoutPage() {
  return (
    <AppShell header={<NavBar title="Checkout" back="/cart" />}>
      <CheckoutView />
    </AppShell>
  );
}
