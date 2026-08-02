import AppShell from '@/components/AppShell';
import NavBar from '@/components/NavBar';
import OrderDetail from '@/components/OrderDetail';

export const metadata = { title: 'Order details' };

/** A shell only — the order itself is fetched in the browser, where the
 *  bearer token lives. See OrderDetail. */
export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AppShell header={<NavBar title="Order" back="/account" />}>
      <OrderDetail id={id} />
      <div className="foot-space" />
    </AppShell>
  );
}
