import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

// Google Analytics helper
const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // Add to .env.local

function pageview(url) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_ID, { page_path: url });
  }
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  // SXO: Track page views for analytics
  useEffect(() => {
    const handleRouteChange = (url) => pageview(url);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  // Loading bar on route change for premium UX and responsive search feedback
  useEffect(() => {
    let timer;
    const handleStart = () => {
      window.scrollTo(0, 0);
      setActive(true);
      setProgress(15);
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + (90 - prev) * 0.15; // Slow down as it approaches 90%
        });
      }, 150);
    };

    const handleStop = () => {
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
        setActive(false);
        setProgress(0);
      }, 300);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      clearInterval(timer);
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router.events]);

  return (
    <>
      {active && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "3px",
          width: `${progress}%`,
          background: "linear-gradient(to right, #10b981, #059669)",
          boxShadow: "0 0 10px rgba(16, 185, 129, 0.5), 0 0 5px rgba(16, 185, 129, 0.3)",
          zIndex: 99999,
          transition: progress === 100 ? "width 0.2s ease-out, opacity 0.3s ease-in-out" : "width 0.3s ease-out",
          opacity: progress === 100 ? 0 : 1,
          pointerEvents: "none"
        }} />
      )}
      <Component {...pageProps} />
    </>
  );
}
