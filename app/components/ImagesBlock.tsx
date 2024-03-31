"use client";

import { IItem } from "@/types/item/IItem";
import Image from "next/image";
import React, { useState } from "react";

interface ImagesBlockProps {
  item: IItem;
}

const ImagesBlock = ({ item }: ImagesBlockProps) => {
  const [index, setIndex] = useState<number>(0);

  return (
    <div className="mr-[50px] pb-[40px]">
      <div className="w-[400px] h-[400px]">
        <Image
          src={item.imgUrl[index]}
          alt="item_photo"
          width={400}
          height={400}
          className="self-center mb-[30px]"
        />
      </div>
      <ul className="grid grid-cols-3 gap-3">
        {item.imgUrl.map((img: string, index) => (
          <li key={index}>
            <Image
              src={img}
              alt="item another look"
              width={120}
              height={120}
              className="border border-gray-400 block cursor-pointer hover:shadow-[10px_10px_15px_-3px_rgba(0,0,0,0.3)] hover:scale-105 transition-all"
              onClick={() => setIndex(index)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImagesBlock;
