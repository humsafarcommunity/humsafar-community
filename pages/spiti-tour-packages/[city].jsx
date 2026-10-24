import DestinationLanding from "../../components/DestinationLanding";
import { getDestinationProps } from "../../lib/destinationData";
import { DESTINATIONS } from "../../data/destinations";
import { CITY_SLUGS } from "../../data/cities";

export default function Page(props) {
  return <DestinationLanding dest="spiti" {...props} />;
}

export async function getStaticPaths() {
  return { paths: CITY_SLUGS.map((city) => ({ params: { city } })), fallback: false };
}

export async function getStaticProps({ params }) {
  if (!CITY_SLUGS.includes(params.city)) return { notFound: true };
  return { props: { ...(await getDestinationProps(DESTINATIONS.spiti)), city: params.city }, revalidate: 60 };
}
