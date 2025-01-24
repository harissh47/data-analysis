import type { Metadata, Viewport } from "next";
import "./styles/globals.css";
import "./styles/markdown.scss"

export const metadata: Metadata = {
  title: "Copilot",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className="h-full select-auto"
        data-api-prefix={process.env.NEXT_PUBLIC_API_PREFIX}
        data-pubic-api-prefix={process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX}
        data-public-edition={process.env.NEXT_PUBLIC_EDITION}
        data-public-support-mail-login={process.env.NEXT_PUBLIC_SUPPORT_MAIL_LOGIN}
        data-public-sentry-dsn={process.env.NEXT_PUBLIC_SENTRY_DSN}
        data-public-maintenance-notice={process.env.NEXT_PUBLIC_MAINTENANCE_NOTICE}
        data-public-site-about={process.env.NEXT_PUBLIC_SITE_ABOUT}
      >
        {children}
      </body>
    </html>
  );
}
