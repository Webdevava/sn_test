import { redirect } from 'next/navigation';

export default function InsuranceDetails() {
  // Redirect to default tab
  redirect('/personal-details/insurance-details/life');
}