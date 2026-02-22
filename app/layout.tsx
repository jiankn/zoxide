// Minimal root layout required by Next.js build validation.
// The actual layout with <html>, <body>, fonts, providers, etc. lives in app/[locale]/layout.tsx.
// The middleware redirects all requests to a locale route before this is used.
// IMPORTANT: Do NOT add <html> or <body> here — [locale]/layout.tsx handles that.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
