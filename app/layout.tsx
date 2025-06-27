import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })
export const metadata: Metadata = {
  title: 'All India NEET Cutoff Ranks (MBBS) – State, Category & College Wise',
  description: 'NEET UG MBBS cutoff ranks across India by state, category (General, SC, ST, OBC, EWS), and college—AIIMS, government, and private. Compare and plan your admission strategy!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZZKRN2Z2TS"
          strategy="afterInteractive"
          async
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZZKRN2Z2TS');
          `}
        </Script>
        <Script id="gtm-head" strategy="afterInteractive">
          {
            `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NQ75T3D7');`
          }
        </Script>

        <link rel="icon" type="image/x-icon" href="/icon.png"></link>
        <meta property="og:title" content="Edmit – All India NEET Cutoff Ranks (MBBS) – State, Category & College Wise" />
        <meta property="og:description" content="NEET UG MBBS cutoff ranks across India by state, category (General, SC, ST, OBC, EWS), and college—AIIMS, government, and private. Compare and plan your admission strategy!" />
        <meta property="og:image" content="https://www.edmit.in/banner.png" />
        <meta property="og:url" content="https://www.edmit.in/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Edmit – All India NEET Cutoff Ranks (MBBS) – State, Category & College Wise" />
        <meta name="twitter:description" content="NEET UG MBBS cutoff ranks across India by state, category (General, SC, ST, OBC, EWS), and college—AIIMS, government, and private. Compare and plan your admission strategy!" />
        <meta name="twitter:image" content="https://www.edmit.in/banner.png" />
      </head>
      <body className={inter.className}>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NQ75T3D7"
          height="0" width="0" style={{
            "display": "none", "visibility": "hidden"
          }}></iframe></noscript>
        <Navbar />
        {children}
        < Footer />
      </body>
    </html>
  )
}
