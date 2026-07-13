import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ký Gửi Pinball – Tra Cứu",
  description:
    "Tra cứu thông tin ký gửi thẻ và bi Pinball của bạn tại Baby Ress Games.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0e1525" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Anti-flash: apply saved theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pinball-user-theme')||'dark';document.body&&(document.body.dataset.pinballUserTheme=t)}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        // Will be set by ThemeInit and theme toggle at runtime
      >
        {/* Apply theme attribute as early as possible via inline script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pinball-user-theme')||'dark';document.body.dataset.pinballUserTheme=t}catch(e){document.body.dataset.pinballUserTheme='dark'}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
