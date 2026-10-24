import DestinationLanding from "../../components/DestinationLanding";
import { getDestinationProps } from "../../lib/destinationData";
import { DESTINATIONS } from "../../data/destinations";

export default function Page(props) {
  return <DestinationLanding dest="spiti" {...props} />;
}

export async function getStaticProps() {
  return { props: await getDestinationProps(DESTINATIONS.spiti), revalidate: 60 };
}
