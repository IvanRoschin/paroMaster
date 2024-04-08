"use server";

import { IItem } from "@/types/item/IItem";
import { connectToDB } from "@/utils/dbConnect";
import Good from "model/Good";
import { revalidatePath } from "next/cache";

type Search = {
  search: string;
  sort: string;
  low: string;
  high: string;
};

//** Category search: { "category": {$eq:"cateroryName" } } * /
//** Vendor search: { "vendor": {$eq:"vendorName" } } * /

export async function getAllGoods(props?: Search) {
  console.log("PROPS", props);
  try {
    connectToDB();

    let filter: any = {};

    // if (props?.low && props.high) {
    //   filter = { price: { $gte: Number(props.low), $lte: Number(props.high) } };
    // }

    if (props?.search) {
      filter = {
        $and: [
          {
            $or: [
              { title: { $regex: props?.search, $options: "i" } },
              { vendor: props?.search },
              { brand: { $regex: props?.search, $options: "i" } },
              { compatibility: { $regex: props?.search, $options: "i" } },
            ],
          },
          { price: { $gte: Number(props.low), $lte: Number(props.high) } },
        ],
      };
    } else if (props?.low && props.high) {
      const low = Number(props?.low);
      const high = Number(props?.high);

      filter = { price: { $gte: low, $lte: high } };
    }

    let sortOption: any = {};
    if (props?.sort === "desc") {
      sortOption = { price: -1 };
    } else {
      sortOption = { price: 1 };
    }

    let goods: IItem[] = [];

    goods = await Good.find(filter)
      .sort(sortOption)
      .find({ $gte: Number(props?.low), $lte: Number(props?.high) });

    return goods;
  } catch (error) {
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
