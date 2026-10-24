import DestinationLanding from "../../components/DestinationLanding";
import { getDestinationProps } from "../../lib/destinationData";
import { DESTINATIONS } from "../../data/destinations";

export default function Page(props) {
  return <DestinationLanding dest="kasol" {...props} />;
}

export async function getStaticProps() {
  return { props: await getDestinationProps(DESTINATIONS.kasol), revalidate: 60 };
}
