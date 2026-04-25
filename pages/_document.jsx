// pages/_document.jsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en-IN" dir="ltr">
      <Head>
        {/* SXO: Character encoding */}
        <meta charSet="utf-8" />

        {/* SXO: Theme color for mobile browsers */}
        <meta name="theme-color" content="#064e3b" />
        <meta name="msapplication-TileColor" content="#064e3b" />

        {/* GEO: Site verification for search engines */}
        {/* Add your actual verification codes */}
        {/* <meta name="google-site-verification" content="YOUR_CODE" /> */}
        {/* <meta name="msvalidate.01" content="YOUR_CODE" /> */}

        {/* SEO: Alternate language versions if adding Hindi */}
        {/* <link rel="alternate" hrefLang="hi" href="https://humsafarcommunity.com/hi/" /> */}

        {/* SXO: Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,600;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:ital,opsz,wght,soft@0,9..144,100..900,0..100;1,9..144,100..900,0..100&family=Syne:wght@400;500;600;700;800&family=Urbanist:ital,wght@0,100..900;1,100..900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&display=swap"
          rel="stylesheet"
        />
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />

        {/* AIO: Speakable meta for Google Assistant */}
        <meta
          name="speakable"
          content="true"
          data-speakable-css-selector=".speakable"
        />

        {/* Google Analytics 4 — Replace G-XXXXXXXXXX */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                    send_page_view: true
                  });
                  // Track WhatsApp clicks as conversions
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    custom_map: { dimension1: 'whatsapp_click' }
                  });
                `,
              }}
            />
          </>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
