// app/admin/page.tsx
// import StatCards from '@/components/admin/dashboard/StatCard/StatCards';

export const metadata = { title: 'Dashboard' };

export default function AdminDashboardPage() {
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h2>Overview</h2>
        <p>A quick snapshot of your store today.</p>
      </header>

      {/* <StatCards /> */}
    </div>
  );
}

