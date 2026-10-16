import CustomersList from "@/components/admin/customers/page";
import { customers } from "@/data/customer";

export const metadata = { title: "Customers" };

export default function CustomersPage() {
  return <CustomersList customers={customers} />;
}
