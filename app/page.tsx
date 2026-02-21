import { redirect } from 'next/navigation';

// Root page redirects to the default locale.
// This file is required for Next.js build validation.
// In practice, the next-intl middleware handles locale routing
// before this page is ever reached.
export default function RootPage() {
  redirect('/en/');
}
