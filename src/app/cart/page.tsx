import AppShell from '@/components/AppShell';
import NavBar from '@/components/NavBar';
import CartView from '@/components/CartView';
import CartFooter from '@/components/CartFooter';

export const metadata = { title: 'Cart' };

export default function CartPage() {
  return (
    <AppShell header={<NavBar title="Your Cart" back="/shop" />} footer={<CartFooter />}>
      <CartView />
    </AppShell>
  );
}
