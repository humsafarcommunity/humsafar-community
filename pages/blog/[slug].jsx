// pages/blog/[slug].jsx — Travel guide (blog post) page with full SEO/AEO/GEO/AIO
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import SEOHead from "../../components/SEOHead";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import TourCard from "../../components/TourCard";
import { GIcon, Swoosh, Testimonials, Faq, iconFor } from "../../components/GuideBits";
import { toursForBlog, slimTour } from "../../lib/related";
import { RichBlocks, inline } from "../../lib/richText";
import { guidePlace, guideHeadings, guideTiles, isThingsToDo, packagesHref, tourPerks, slugify } from "../../lib/guide";
import { figure } from "../../lib/figure";
import {
  SITE,
  getFreshData,
  generateArticleSchema,
  generateOrganizationSchema,
  generateFAQSchema,
} from "../../data";

export default function BlogDetailPage({ blog, relatedBlogs, relatedTours = [], perks = [], tiles = [], reviews = [], site: freshSite }) {
  const dynamicSite = freshSite?.whatsapp ? freshSite : (SITE || { name: "Humsafar Community", whatsapp: "916268496389" });
  const router = useRouter();

  if (router.isFallback) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  }
  if (!blog) return null;

  const schemas = [
    generateOrganizationSchema(dynamicSite),
    generateArticleSchema(blog, dynamicSite),
    ...(blog.faqs?.length > 0 ? [generateFAQSchema(blog.faqs, dynamicSite)] : []),
  ];

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Travel Blog", path: "/blog" },
    { name: blog.title, path: `/blog/${blog.slug}` },
  ];

  const place = guidePlace(blog);
  const headings = guideHeadings(blog.content, 4);
  const intro = blog.directAnswer || blog.excerpt;
  const wa = (text) => `https://wa.me/${(dynamicSite.whatsapp || "916268496389").toString().replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
  const waLink = wa(place ? `Hi Humsafar! I read your ${place} guide and want to plan a trip.` : `Hi Humsafar! I read your blog about ${blog.title} and want to book a trip.`);
  const trip = relatedTours[0];
  const moreTrips = relatedTours.slice(1);
  const pkgHref = packagesHref(place);
  const travellers = figure(dynamicSite.totalTravelers);
  const rating = figure(dynamicSite.ratingValue, true);
  const stats = [
    travellers && { icon: "people", text: `${travellers} Happy Travellers` },
    { icon: "shield", text: "Safe & Reliable Trips" },
    rating && { icon: "star", text: `${rating}/5 Customer Rating` },
    { icon: "plane", text: "Pan India Operations" },
  ].filter(Boolean);
  const hasReviews = reviews.some((r) => r && r.text);
  const hasFaqs = blog.faqs?.length > 0;
  const published = blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric", timeZone: "UTC" }) : "";

  return (
    <>
      <SEOHead
        title={blog.seoTitle || blog.title}
        description={blog.seoDesc || blog.excerpt}
        keywords={blog.keywords}
        image={blog.coverImage}
        url={`/blog/${blog.slug}`}
        type="article"
        publishedAt={blog.publishedAt}
        updatedAt={blog.updatedAt}
        author={blog.author}
        schemas={schemas}
        breadcrumbs={breadcrumbs}
        site={dynamicSite}
      />

      <Navbar site={dynamicSite} isSolid={true} />

      <main className="blog-guide">
        {/* ---------- Hero ---------- */}
        <header className={"bg-hero" + (blog.coverImage ? "" : " bg-hero--empty")}>
          {blog.coverImage && <Image src={blog.coverImage} alt={blog.title} fill priority sizes="100vw" className="bg-hero__img" />}
          <div className="bg-hero__shade" />
          <div className="bg-hero__in">
            <span className="bg-pill"><GIcon name="pin" size={15} stroke={2} />{blog.category || "Travel Guide"}</span>
            <h1 className="speakable">{blog.title}</h1>
            <div className="bg-meta">
              {blog.readTime && <span><GIcon name="clock" size={16} />{blog.readTime} min read</span>}
              {blog.author && <span><GIcon name="user" size={16} />{blog.author}</span>}
              {published && <span><GIcon name="calendar" size={16} /><time dateTime={blog.publishedAt}>{published}</time></span>}
            </div>
            <p className="bg-tag">Plan Better. Travel Happier.<Swoosh width={170} /></p>
          </div>
        </header>

        {/* ---------- Intro, photo tiles, things to do + "why Humsafar" card ---------- */}
        <div className="bg-wrap">
          <div className="bg-top">
            <div>
              {intro && (
                <section className="bg-intro">
                  <h2 className="bg-h2">{place ? `Discover the Magic of ${place}` : "Discover the Magic"}</h2>
                  <p className="speakable">{intro}</p>
                </section>
              )}

              {tiles.length >= 2 && (
                <ul className="bg-tiles" aria-label="Places in this guide">
                  {tiles.map((t, i) => (
                    <li key={i} className="bg-tile">
                      <Image src={t.src} alt={t.label || blog.title} fill sizes="(max-width: 700px) 50vw, 200px" />
                      {t.label && <span><GIcon name="pin" size={14} stroke={2} />{t.label}</span>}
                    </li>
                  ))}
                </ul>
              )}

              {headings.length >= 2 && (
                <section className="bg-todo" aria-label="What's in this guide">
                  <h2 className="bg-h2">{isThingsToDo(blog) && place ? `Top Things to Do in ${place}` : "Inside This Guide"}</h2>
                  <div className="bg-todo__grid">
                    <ul>
                      {headings.map((h) => (
                        <li key={h.id}>
                          <a href={`#${h.id}`}><GIcon name={iconFor(h.text)} size={22} stroke={1.5} />{h.text}</a>
                        </li>
                      ))}
                    </ul>
                    <span className="bg-vline" aria-hidden="true" />
                    <div className="bg-todo__side">
                      <p>Everything you need to plan it, from timings and costs to handy tips, is in the full guide below.</p>
                      <a href="#guide" className="bg-btn bg-btn--ghost">Read More Travel Tips <GIcon name="arrow" size={15} stroke={2.2} /></a>
                    </div>
                  </div>
                  <svg className="bg-plane" width="96" height="150" viewBox="0 0 96 150" fill="none" aria-hidden="true" focusable="false">
                    <path d="M14 148C-6 108 40 84 56 46" stroke="#1d2b44" strokeWidth="1.6" strokeDasharray="4 6" strokeLinecap="round" />
                    <path d="M92 8L56 24l14 6 6 14L92 8zM70 30L92 8" stroke="#1d2b44" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                </section>
              )}
            </div>

            <aside className="bg-why" aria-label="Why travel with Humsafar">
              <svg className="bg-why__peak" width="84" height="44" viewBox="0 0 84 44" fill="none" aria-hidden="true" focusable="false">
                <path d="M2 42L26 12l10 12 8-10 16 20 8-9 12 17H2z" stroke="#1d2b44" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M26 12l-6 8 6-2 5 5M44 14l-5 7 5-2 4 4" stroke="#1d2b44" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <h2 className="bg-why__title">Why Travel with Humsafar?</h2>
              <ul>
                {["Community Trips & Great Vibes", "Trusted & Safe Travel", "Explore More, Together"].map((t) => (
                  <li key={t}><span className="bg-check"><GIcon name="check" size={13} stroke={3} /></span>{t}</li>
                ))}
              </ul>
              <p className="bg-why__script">{place ? `Ready for ${place}?` : "Ready to go?"}</p>
              <p>Let&apos;s turn your travel dreams into memories!</p>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="bg-btn"><GIcon name="chat" size={17} stroke={2} />Chat on WhatsApp <GIcon name="arrow" size={15} stroke={2.2} /></a>
            </aside>
          </div>

          {/* ---------- The full guide ---------- */}
          <article id="guide" className="bg-article" itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="headline" content={blog.title} />
            <meta itemProp="datePublished" content={blog.publishedAt || ""} />
            <meta itemProp="dateModified" content={blog.updatedAt || blog.publishedAt || ""} />
            <span itemProp="author" itemScope itemType="https://schema.org/Organization" hidden><meta itemProp="name" content={blog.author || "Humsafar Community"} /></span>
            {(Array.isArray(blog.tags) ? blog.tags : []).length > 0 && (
              <div className="bg-tags">
                {blog.tags.map((tag) => <span key={tag} itemProp="keywords">#{tag}</span>)}
              </div>
            )}
            <div className="bg-body" itemProp="articleBody">
              {(blog.content || []).map((block, i) => {
                switch (block.type) {
                  case "h2":
                    return <h2 key={i} id={slugify(block.text) || undefined}>{block.text}</h2>;
                  case "h3":
                    return <h3 key={i}>{block.text}</h3>;
                  case "para":
                    return <RichBlocks key={i} text={block.text} />;
                  case "quote":
                    return <blockquote key={i}>{block.text}</blockquote>;
                  case "hr":
                    return <hr key={i} />;
                  case "list":
                    return (
                      <ul key={i}>
                        {(block.items || []).map((item, j) => <li key={j}>{inline(item, `l${i}${j}`)}</li>)}
                      </ul>
                    );
                  case "img":
                    return block.url ? (
                      <figure key={i}>
                        <div className="bg-fig"><Image src={block.url} alt={block.caption || blog.title} fill sizes="(max-width: 820px) 100vw, 820px" /></div>
                        {block.caption && <figcaption>{block.caption}</figcaption>}
                      </figure>
                    ) : null;
                  default:
                    return null;
                }
              })}
            </div>
          </article>

          {/* ---------- Featured trip ---------- */}
          {trip && (
            <section aria-label="Trip from this guide" className="bg-trip">
              <div className="bg-trip__img">
                {trip.img && <Image src={trip.img} alt={trip.title} fill sizes="(max-width: 900px) 100vw, 380px" />}
              </div>
              <div className="bg-trip__copy">
                <p className="bg-trip__script" aria-hidden="true">Travel Together.<br />Explore More.</p>
                <span className="bg-pill bg-pill--sm"><GIcon name="star" size={12} />Featured Trip</span>
                <h3>{trip.title}</h3>
                <p>{trip.seoDesc || `Explore ${trip.location || trip.title} with a Humsafar group trip.`}</p>
                {perks.length > 0 && (
                  <ul className="bg-perks">
                    {perks.map((p) => <li key={p.label}><GIcon name={p.icon} size={22} stroke={1.6} />{p.label}</li>)}
                  </ul>
                )}
                <div className="bg-trip__foot">
                  <span className="bg-trip__facts">
                    {trip.duration}
                    {trip.duration && trip.price > 0 ? " · " : ""}
                    {trip.price > 0 && <>From <strong>₹{Number(trip.price).toLocaleString("en-IN")}</strong> / person</>}
                  </span>
                  <Link href={`/packages/${trip.slug}`} className="bg-btn">{place ? `Explore ${place} Package` : "Explore Package"} <GIcon name="arrow" size={15} stroke={2.2} /></Link>
                </div>
              </div>
            </section>
          )}

          {moreTrips.length > 0 && (
            <section aria-label="More trips" className="bg-more">
              <h2 className="bg-sec-h">More trips you may like</h2>
              <div className="bg-more__grid">
                {moreTrips.map((t) => <TourCard key={t._id || t.slug} tour={t} />)}
              </div>
            </section>
          )}

          {/* ---------- Stats strip ---------- */}
          <ul className="bg-stats" aria-label="Humsafar Community in numbers">
            {stats.map((s) => <li key={s.text}><GIcon name={s.icon} size={22} stroke={1.6} />{s.text}</li>)}
          </ul>

          {/* ---------- Reviews + FAQ ---------- */}
          {(hasReviews || hasFaqs) && (
            <div className={"bg-two" + (hasReviews && hasFaqs ? "" : " bg-two--one")}>
              {hasReviews && (
                <section aria-label="Traveller reviews">
                  <h2 className="bg-sec-h">What Travellers Say</h2>
                  <Testimonials reviews={reviews} />
                </section>
              )}
              {hasFaqs && (
                <section aria-label="Frequently asked questions">
                  <h2 className="bg-sec-h">Frequently Asked Questions</h2>
                  <Faq faqs={blog.faqs} />
                </section>
              )}
            </div>
          )}
        </div>

        {/* ---------- Closing call to action ---------- */}
        <section className="bg-cta" aria-label="Book your trip">
          {blog.coverImage && <Image src={blog.coverImage} alt="" fill sizes="100vw" className="bg-cta__img" />}
          <div className="bg-cta__in">
            <h2>{place ? `Ready to Explore ${place}?` : "Ready for Your Adventure?"}</h2>
            <p>Book your trip today and be a part of the Humsafar Community!</p>
            <Link href={pkgHref} className="bg-btn">{place ? `View ${place} Packages` : "View Packages"} <GIcon name="arrow" size={15} stroke={2.2} /></Link>
            <p className="bg-cta__script" aria-hidden="true">Travel with Humsafar<br />Where journeys turn<br />into memories.</p>
          </div>
        </section>

        {/* ---------- Related articles ---------- */}
        {relatedBlogs?.length > 0 && (
          <section className="bg-related" aria-label="Related articles">
            <div className="bg-wrap">
              <h2 className="bg-sec-h">Related Articles</h2>
              <div className="bg-related__grid">
                {relatedBlogs.map((rb) => (
                  <Link key={rb.id} href={`/blog/${rb.slug}`} className="bg-related__card">
                    {rb.coverImage && <div className="bg-related__img"><Image src={rb.coverImage} alt={rb.title} fill sizes="(max-width: 768px) 100vw, 260px" /></div>}
                    <div className="bg-related__txt">
                      <span>{rb.category}</span>
                      <h3>{rb.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer dynamicSite={dynamicSite} />
    </>
  );
}

export async function getStaticPaths() {
  const data = await getFreshData();
  const paths = data.BLOGS
    .filter((blog) => blog && typeof blog.slug === 'string')
    .map((blog) => ({
      params: { slug: blog.slug },
    }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const data = await getFreshData();
  const blog = data.BLOGS.find((b) => b.slug === params.slug);
  if (!blog) return { notFound: true };

  const relatedBlogs = data.BLOGS.filter(
    (b) => b.id !== blog.id && b.category === blog.category
  ).slice(0, 3);

  const place = guidePlace(blog);
  const relatedFull = toursForBlog(blog, data.TOURS || [], 3);

  return {
    props: {
      blog,
      relatedBlogs,
      relatedTours: relatedFull.map(slimTour),
      perks: relatedFull[0] ? tourPerks(relatedFull[0]) : [],
      tiles: guideTiles(blog, data.TOURS || [], place),
      reviews: JSON.parse(JSON.stringify(data.REVIEWS || [])),
      site: data.SITE,
    },
    revalidate: 60,
  };
}
