import { Header } from "@/components/organisms/Header";
import { SeatingChartEditor } from "@/components/pages/SeatingChartEditor";

export const Home = () => {
  return (
    <>
      <Header />
      <section className="flex h-[calc(100vh-73px)]">
        <SeatingChartEditor />
      </section>
    </>
  );
};
