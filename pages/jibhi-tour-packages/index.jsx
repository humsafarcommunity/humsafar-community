import DestinationLanding from "../../components/DestinationLanding";
import { getDestinationProps } from "../../lib/destinationData";
import { DESTINATIONS } from "../../data/destinations";

export default function Page(props) {
  return <DestinationLanding dest="jibhi" {...props} />;
}

export async function getStaticProps() {
  return { props: await getDestinationProps(DESTINATIONS.jibhi), revalidate: 60 };
}
