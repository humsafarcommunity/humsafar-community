import ManaliLanding from "../../components/ManaliLanding";
import { getManaliProps } from "../../lib/manaliData";

export default function ManaliPackagesPage(props) {
  return <ManaliLanding {...props} />;
}

export async function getStaticProps() {
  return { props: await getManaliProps(), revalidate: 60 };
}
