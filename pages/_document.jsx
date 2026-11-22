// pages/_document.jsx
import { Html, Head, Main, NextScript } from "next/document";

// Google Tag Manager container. Set NEXT_PUBLIC_GTM_ID to use a different one.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-TN4HZ78N";

export default function Document() {
  return (
    <Html lang="en-IN" dir="ltr">
      <Head>
        {/* Google Tag Manager. gtag() is defined straight away so click tracking keeps working, but the heavy GTM
            script itself loads on the first touch/scroll/click, or 4 seconds after the page has loaded, whichever
            comes first. This keeps it out of the way of the first paint (better LCP and Total Blocking Time). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}(function(w,d,i){var done=false;function go(){if(done)return;done=true;['scroll','touchstart','pointerdown','keydown','mousemove'].forEach(function(e){w.removeEventListener(e,go)});w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var j=d.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;d.head.appendChild(j);}['scroll','touchstart','pointerdown','keydown','mousemove'].forEach(function(e){w.addEventListener(e,go,{passive:true,once:true})});if(d.readyState==='complete'){setTimeout(go,4000)}else{w.addEventListener('load',function(){setTimeout(go,4000)})}})(window,document,'${GTM_ID}');`,
          }}
        />
        {/* SXO: Character encoding */}
        <meta charSet="utf-8" />

        {/* SXO: Theme color for mobile browsers */}
        <meta name="theme-color" content="#064e3b" />
        <meta name="msapplication-TileColor" content="#064e3b" />

        {/* GEO: Site verification (Add codes in CMS > SEO Settings for dynamic updates) */}
        {/* <meta name="google-site-verification" content="ADD_IN_CMS" /> */}

        {/* SEO: Alternate language versions if adding Hindi */}
        {/* <link rel="alternate" hrefLang="hi" href="https://humsafarcommunity.com/hi/" /> */}

        {/* SXO: Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fonts load without blocking the first paint (swap shows text straight away) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Caveat:wght@600;700&family=Londrina+Solid:wght@900&family=Anton&display=swap';l.media='print';l.onload=function(){l.media='all'};document.head.appendChild(l);})();`,
          }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Caveat:wght@600;700&family=Londrina+Solid:wght@900&family=Anton&display=swap"
            rel="stylesheet"
          />
        </noscript>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

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
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
