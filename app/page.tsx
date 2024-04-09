import { ItemsList, Slider } from "./components";
import PriceFilter from "./components/PriceFilter/PriceFilter";
import Sort from "./components/Sort";

export default function Home({
  searchParams,
}: {
  searchParams: { sort: string; search: string; low: string; high: string };
}) {
  console.log("searchParams", searchParams);
  return (
    <div className="">
      <Slider />
      <Sort />
      <PriceFilter />
      <ItemsList searchParams={searchParams} />
    </div>
  );
}
