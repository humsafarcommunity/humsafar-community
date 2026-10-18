import Accordion from "./Accordion";

// FAQ list in the site's accordion style. (Google reads the FAQ markup that each page adds as JSON-LD.)
export default function FAQAccordion({ faqs, title, defaultOpen = 0 }) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <Accordion
      title={title}
      defaultOpen={defaultOpen}
      items={faqs.map((f) => ({ title: f.q, body: <p>{f.a}</p> }))}
    />
  );
}
