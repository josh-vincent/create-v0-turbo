import { redirect } from "next/navigation";

export default function SettingsBillingPage() {
  // Redirect to the existing billing page
  redirect("/dashboard/billing");
}
