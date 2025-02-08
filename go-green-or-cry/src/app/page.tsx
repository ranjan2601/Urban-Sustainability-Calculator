import dynamic from "next/dynamic";
import Head from "next/head";


const DynamicMap = dynamic(() => import("./components/map"));

export default function Home() {
  return (
    <div>
      <Head>
        <title>Sustainability Map</title>
      </Head>
      <h1>Sustainability Impact Map</h1>
      <DynamicMap />
    </div>
  );
}
