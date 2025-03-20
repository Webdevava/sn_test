import { redirect } from 'next/navigation';

export default function FinancialDetails() {
  // Redirect to default tab
  redirect('/personal-details/financial-details/bank');
}