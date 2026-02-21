// Minimal root layout required by Next.js build validation.
// The actual layout with fonts, providers, etc. lives in app/[locale]/layout.tsx.
// The middleware redirects all requests to a locale route before this is used.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
