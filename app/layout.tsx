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
        <meta
          name="theme-color"
          content="#f5f5f7"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000000"
          media="(prefers-color-scheme: dark)"
        />
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
            __html: `(function(){try{var t=localStorage.getItem('pinball-user-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.body&&(document.body.dataset.pinballUserTheme=t);var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++){m[i].setAttribute('content',t==='dark'?'#000000':'#f5f5f7')}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
      >
        {/* Apply theme attribute as early as possible via inline script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pinball-user-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.body.dataset.pinballUserTheme=t;var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++){m[i].setAttribute('content',t==='dark'?'#000000':'#f5f5f7')}}catch(e){document.body.dataset.pinballUserTheme='dark'}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
