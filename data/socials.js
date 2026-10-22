// Official profiles. The CMS (Site Settings → Active Social Profiles) can override any of these.
export const DEFAULT_SOCIALS = {
  instagram: "https://www.instagram.com/humsafar.community/",
  linkedin: "https://in.linkedin.com/company/humsafarcommunity",
  tripadvisor: "https://www.tripadvisor.in/Attraction_Review-g297618-d33399306-Reviews-HUMSAFAR_COMMUNITY-Manali_Kullu_District_Himachal_Pradesh.html",
  linktree: "https://linktr.ee/humsafarcommunity",
};

export function mergeSocials(cms = {}) {
  const out = { ...DEFAULT_SOCIALS };
  Object.entries(cms || {}).forEach(([k, v]) => { if (v) out[k] = v; });
  return out;
}
