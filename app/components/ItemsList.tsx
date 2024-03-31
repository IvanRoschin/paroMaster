import React from "react";
import { items } from "./items";
import { IItem } from "types/item/IItem";
import { ItemListCard } from ".";

const ItemsList = () => {
  return (
    <ul className="grid grid-cols-4 gap-4">
      {items.map((item: IItem) => (
        <ItemListCard key={item._id} item={item} />
      ))}
    </ul>
  );
};

export default ItemsList;
