import ImagesBlock from "@/components/ImagesBlock";
import { items } from "@/components/items";
import Image from "next/image";
import { IItem } from "types/item/IItem";

export default function Item({ params }: { params: { id: string } }) {
  const item = items.find((item: IItem) => item._id === params.id);

  return (
    item && (
      <div className="flex">
        <ImagesBlock item={item} />
        <div className="pt-10">
          <h2 className="font-semibold text-2xl mb-[40px]">{item.title}</h2>
          <p className="mb-[20px]">{item.description}</p>
          {item.isAvailable ? (
            <p className="text-green-600 mb-[30px]">В наявності</p>
          ) : (
            <p className="text-red-600 mb-[30px]">Немає в наявності</p>
          )}
          <p className="mb-[20px]">Артикул: {item.vendor}</p>
          <p className="text-2xl font-bold mb-[30px]">{item.price} грн</p>
          <button
            type="button"
            className="p-4 w-[200px] mb-[40px] bg-orange-600 hover:bg-orange-700 focus:bg-orange-700 text-white transition-all font-semibold text-lg"
          >
            Купити
          </button>
          <p className="font-light text-gray-500">
            Сумісність з брендами: {item.compatibility.join(", ")}
          </p>
        </div>
      </div>
    )
  );
}
