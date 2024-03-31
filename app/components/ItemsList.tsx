import React from "react";
import { IItem } from "types/item/IItem";
import { ItemListCard } from ".";
import { getAllGoods } from "@/actions/getTest";

const ItemsList = async () => {
  const goods = await getAllGoods();

  return (
    <ul className="grid grid-cols-4 gap-4">
      {goods?.map((item: IItem) => (
        <ItemListCard key={item._id} item={item} />
      ))}
    </ul>
  );
};

export default ItemsList;
