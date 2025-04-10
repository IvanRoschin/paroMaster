"use client"

import { userLoginSchema } from "@/helpers/index"
import { Form, Formik, FormikHelpers } from "formik"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { toast } from "sonner"
import FormField from "./input/FormField"
import Button from "./ui/Button"

interface InitialStateType {
  email: string
  password: string
}

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const initialValues: InitialStateType = {
    email: "",
    password: ""
  }

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    setIsLoading(true)
    signIn("credentials", {
      email: values.email.toLowerCase(),
      password: values.password,
      redirect: false
    }).then(callback => {
      setIsLoading(false)
      if (callback?.ok) {
        toast.success("Успішний вхід")
        resetForm()
        router.push("/admin")
        window.location.replace("/admin")
      }
      if (callback?.error) {
        toast.error(callback.error || "Помилка")
      }
    })
  }

  const inputs = [
    {
      label: "Email",
      type: "text",
      id: "email",
      required: true
    },
    {
      label: "Password",
      type: "password",
      id: "password",
      required: true
    }
  ]

  return (
    <div className="flex flex-col justify-center items-center ">
      <h2 className="text-4xl mb-4">Сторінка авторизації</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={userLoginSchema}
        enableReinitialize
      >
        {({ errors }) => (
          <Form className="flex flex-col w-[600px]">
            {inputs.map((item, i) => (
              <FormField item={item} key={i} errors={errors} />
            ))}
            <Button type={"submit"} label="Увійти" />
          </Form>
        )}
      </Formik>
      <span className="text-xl py-6">або авторизуйтесь з Google</span>
      <div className="w-[600px]">
        <Button
          outline
          label="Continue with Google"
          icon={FcGoogle}
          onClick={() => {
            setIsLoading(true)
            signIn("google").then(callback => {
              setIsLoading(false)
              if (callback?.ok) {
                toast.success("Успішний вхід")
                router.push("/admin")
                window.location.replace("/admin")
              }
              if (callback?.error) {
                toast.error(callback.error || "Помилка")
              }
            })
          }}
          type={"button"}
        />
      </div>
    </div>
  )
}

export default LoginForm
