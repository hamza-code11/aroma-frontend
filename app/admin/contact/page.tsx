import ContactList from "@/components/admin/contact/page";
import { contactEnquiries } from "@/data/contact";

export const metadata = { title: "Contact Messages" };

export default function ContactAdminPage() {
  return <ContactList enquiries={contactEnquiries} />;
}
