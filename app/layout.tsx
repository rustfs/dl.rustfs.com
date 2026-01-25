import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RustFS - High-Performance Distributed Storage System",
  description:
    "RustFS is a high-performance distributed storage system built with Rust, S3 protocol compatible",
  keywords:
    "RustFS, distributed storage, cloud storage, S3 compatible, high performance, open source, MinIO alternative",
  authors: [{ name: "RustFS Team" }],
  metadataBase: new URL("https://rustfs.com"),
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta name="author" content="RustFS" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="yandexbot" content="index, follow" />
        <meta key="twitter:site" name="twitter:site" content="@rustfs" />
        <meta key="twitter:creator" name="twitter:creator" content="@rustfs" />
        <meta key="og:type" property="og:type" content="article" />
        <meta name="baidu-site-verification" content="codeva-TTcVEynElc" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="alternate" hrefLang="zh-CN" href="https://rustfs.com.cn" />
        <link rel="alternate" hrefLang="en-US" href="https://rustfs.com" />
        <link rel="alternate" hrefLang="x-default" href="https://rustfs.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <header className="sticky top-0 z-40 border-b border-border/60 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <img src="/rustfs.logo.svg" alt="RustFS" className="h-5 w-auto" />
              <span className="h-5 w-px bg-border/70" aria-hidden="true" />
              <span className="text-sm font-semibold text-foreground">
                Download Center
              </span>
            </Link>
            <nav className="hidden items-center gap-4 text-sm font-medium text-muted-foreground md:flex">
              <Link href="https://docs.rustfs.com/features/distributed/">Features</Link>
              <Link href="https://docs.rustfs.com/concepts/architecture.html">Architecture</Link>
              <Link href="https://docs.rustfs.com/features/data-lake/">Solutions</Link>
              <Link href="https://docs.rustfs.com/features/ai">AI</Link>
              <Link href="https://dl.rustfs.com" className="text-foreground">
                Download
              </Link>
              <Link href="https://play.rustfs.com">Demo</Link>
              <Link href="https://docs.rustfs.com/installation/">Docs</Link>
              <Link href="https://rustfs.dev/">Blog</Link>
            </nav>
            <div className="flex items-center gap-3 text-sm font-medium">
              <Link
                href="https://github.com/rustfs/rustfs"
                className="inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </Link>
              <Link
                href="https://x.com/rustfsofficial"
                className="inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label="X"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <title>X</title>
                  <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
                </svg>
              </Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
