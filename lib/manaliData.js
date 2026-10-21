import { getFreshData } from "../data";

const isManali = (v) => String(v || "").toLowerCase().includes("manali");

// Shared by /manali-tour-packages and /manali-tour-packages/[city]
export async function getManaliProps() {
  const data = await getFreshData();
  const tours = (data.TOURS || [])
    .filter((t) => isManali(t.title) || isManali(t.location) || isManali(t.slug))
    .map((t) => ({
      _id: t._id || t.slug,
      title: t.title || "",
      slug: t.slug || "",
      location: t.location || "",
      region: t.region || "",
      type: t.type || "group",
      duration: t.duration || "",
      price: t.price || 0,
      oldPrice: t.oldPrice || "",
      img: t.img || "",
      bestseller: !!t.bestseller,
      departureDay: t.departureDay || "",
      seoDesc: t.seoDesc || "",
    }));
  const prices = tours.map((t) => Number(t.price)).filter((n) => n > 0);
  const guides = (data.BLOGS || [])
    .filter((b) => isManali(b.title) || isManali(b.slug))
    .slice(0, 6)
    .map((b) => ({
      _id: b._id || b.slug,
      title: b.title || "",
      slug: b.slug || "",
      category: b.category || "Travel Guide",
      author: b.author || "Humsafar Team",
      date: b.date || b.publishedAt || "",
      coverImage: b.coverImage || "",
      excerpt: b.excerpt || "",
    }));
  const reviews = JSON.parse(JSON.stringify(data.REVIEWS || []));
  return {
    tours,
    guides,
    reviews,
    minPrice: prices.length ? Math.min(...prices) : 0,
    site: data.SITE,
    seo: data.SEODATA,
  };
}
