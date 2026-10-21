import ManaliLanding from "../../components/ManaliLanding";
import { getManaliProps } from "../../lib/manaliData";
import { CITY_SLUGS } from "../../data/cities";

export default function ManaliCityPage(props) {
  return <ManaliLanding {...props} />;
}

export async function getStaticPaths() {
  return { paths: CITY_SLUGS.map((city) => ({ params: { city } })), fallback: false };
}

export async function getStaticProps({ params }) {
  if (!CITY_SLUGS.includes(params.city)) return { notFound: true };
  return { props: { ...(await getManaliProps()), city: params.city }, revalidate: 60 };
}
