"use client";

import React, { useState } from "react";
import { Formik, Form, Field, FormikState } from "formik";
import { ImagesUpload } from ".";
import { addGood } from "@/actions/getTest";
// import { useGlobalContext } from "@/context/store";
// import { useRouter } from "next/navigation";

interface initialStateType {
  imgUrl: string[];
  brand: string;
  model: string;
  vendor: string;
  title: string;
  description: string;
  price: number;
  isAvailable: boolean;
  isCompatible: boolean;
  compatibility: string[];
}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<initialStateType>>) => void;
}

const AdminForm = () => {
  //   const { isLoggedIn } = useGlobalContext();
  //   const router = useRouter();
  const [description, setDescription] = useState<string>("");

  const initialValues: initialStateType = {
    imgUrl: [],
    brand: "",
    model: "",
    vendor: "",
    title: "",
    description: "",
    price: 0,
    isAvailable: true,
    isCompatible: true,
    compatibility: ["Philips", "Bosh", "Kenwood"],
  };

  //   useEffect(() => {
  //     isLoggedIn ? router.replace("/admin") : router.replace("/login");
  //   }, [isLoggedIn, router]);

  const handleSubmit = (
    values: initialStateType,
    { resetForm }: ResetFormProps
  ) => {
    addGood(values);
    setDescription("");
    resetForm();
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col w-[600px]">
          <div>
            <ImagesUpload setFieldValue={setFieldValue} />
          </div>
          <div className="flex flex-col">
            <Field
              type="text"
              name="title"
              placeholder="Назва товару"
              className="mb-5 p-2 rounded-md"
            />
            <Field
              type="text"
              name="brand"
              placeholder="Бренд"
              className="mb-5 p-2 rounded-md"
            />
            <Field
              type="text"
              name="model"
              placeholder="Модель"
              className="mb-5 p-2 rounded-md"
            />
            <Field
              type="number"
              name="price"
              placeholder="Ціна"
              className="mb-5 p-2 rounded-md"
            />
            <Field
              type="text"
              as="textarea"
              value={description}
              name="description"
              placeholder="Опис"
              className="resize-none mb-5 p-2 rounded-md"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setFieldValue("description", e.currentTarget.value);
                setDescription(e.currentTarget.value);
              }}
            />
            <Field
              type="text"
              name="vendor"
              placeholder="Артикул"
              className="mb-5 p-2 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="p-2 w-[100px] border border-gray-400 rounded-md self-center hover:bg-gray-300 transition ease-in-out"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AdminForm;
