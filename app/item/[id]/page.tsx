import { items } from "@/components/items";
import Image from "next/image";
import { IItem } from "types/item/IItem";
import itemImg from "../../images/itemImg.webp";

export default function Item({ params }: { params: { id: string } }) {
  const item = items.find((item: IItem) => item._id === params.id);

  return (
    item && (
      <div className="flex">
        <div className="mr-[30px]">
          <Image
            src={itemImg}
            alt="item_photo"
            width={500}
            height={500}
            className="block self-center mb-[30px]"
          />
        </div>
        <div className="pt-20 w-[400px]">
          <h2 className="font-semibold mb-[20px]">{item.title}</h2>
          <p className="mb-[20px]">{item.description}</p>
          {item.isAvailable ? (
            <p className="text-green-600 mb-[20px]">В наявності</p>
          ) : (
            <p className="text-red-600 mb-[20px]">Немає в наявності</p>
          )}
          <p className="mb-[20px]">Артикул: {item.vendor}</p>
          <p className="text-2xl font-bold mb-[20px]">{item.price} грн</p>
          <button
            type="button"
            className="p-4 w-[200px] mb-[20px] bg-orange-600 hover:bg-orange-700 focus:bg-orange-700 text-white transition-all font-semibold text-lg"
          >
            Купити
          </button>
          <p className="font-light text-gray-500">
            Сумісність з брендами: {item.isCompatible ? "так" : "ні"}
          </p>
        </div>
      </div>
    )
  );
}
