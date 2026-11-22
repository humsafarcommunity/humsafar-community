import { useEffect, useState } from "react";

// Shows an email address as a normal mailto link for visitors, but keeps it out of the page's HTML source
// so spam bots and SEO scanners don't find it as clear text. The address is stored encoded and decoded in the browser.
export default function ObfuscatedEmail({ email, encoded: given, style, className }) {
  const encoded = given || (typeof btoa === "function" ? btoa(email || "") : Buffer.from(email || "").toString("base64"));
  const [addr, setAddr] = useState("");
  useEffect(() => { try { setAddr(atob(encoded)); } catch (e) { /* ignore */ } }, [encoded]);
  if (!addr) return <span style={style} className={className}>Email us</span>;
  return <a href={`mailto:${addr}`} style={style} className={className}>{addr}</a>;
}
