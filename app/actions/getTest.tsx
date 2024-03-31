"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "@/utils/dbConnect";
import Good from "model/Good";
import { IItem } from "@/types/item/IItem";

type Props = {};

export const getTest = (props: Props) => {
  const db = connectToDB();
  console.log(db);
  return <div>getTest</div>;
};

export async function getAllGoods() {
  try {
    connectToDB();

    const goods: IItem[] = await Good.find();
    return goods;
  } catch (error: unknown) {
    console.log(error);
  }
  revalidatePath("/");
}

export async function getGoodById(id: string) {
  try {
    await connectToDB();

    const good = await Good.findById({ _id: id });
    return good;
  } catch (error) {
    console.log(error);
  }
}

export async function addGood(values: IItem) {
  try {
    await connectToDB();

    await Good.create({
      title: values.title,
      brand: values.brand,
      model: values.model,
      price: values.price,
      description: values.description,
      imgUrl: values.imgUrl,
      vendor: values.vendor,
      isAvailable: values.isAvailable,
      isCompatible: values.isCompatible,
      compatibility: values.compatibility,
    });
  } catch (error) {
    console.log(error);
  }
  revalidatePath("/");
}
