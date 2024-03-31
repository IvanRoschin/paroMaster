import Image from "next/image";
import React from "react";
import { IItem } from "types/item/IItem";
import Link from "next/link";

interface ItemListCardProps {
  item: IItem;
}

const ItemListCard = ({ item }: ItemListCardProps) => {
  return (
    <li className="border border-gray-300 rounded-md p-4 hover:shadow-[10px_10px_15px_-3px_rgba(0,0,0,0.3)] hover:scale-105 transition-all">
      <Link href={`/item/${item._id}`} className="flex flex-col">
        <Image
          src={item.imgUrl[0]}
          alt="item_photo"
          width={150}
          height={150}
          className="block self-center mb-[30px]"
        />
        <h2 className="font-semibold mb-[20px]">{item.title}</h2>
        {item.isAvailable ? (
          <p className="text-green-600 mb-[20px]">В наявності</p>
        ) : (
          <p className="text-red-600 mb-[20px]">Немає в наявності</p>
        )}
        <p className="mb-[20px]">Артикул: {item.vendor}</p>
        <p className="text-2xl font-bold mb-[20px]">{item.price} грн</p>
      </Link>

      <button
        type="button"
        className="p-4 w-full mb-[20px] bg-orange-600 hover:bg-orange-700 focus:bg-orange-700 text-white transition-all font-semibold text-lg"
      >
        Купити
      </button>
      <p className="font-light text-gray-500">
        Сумісність з брендами: {item.isCompatible ? "так" : "ні"}
      </p>
    </li>
  );
};

export default ItemListCard;
