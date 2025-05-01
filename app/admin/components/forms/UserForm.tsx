"use client"

import { Form, Formik, FormikState } from "formik"
import { toast } from "sonner"

import { CustomButton, FormField } from "@/components/index"
import { userFormSchema } from "@/helpers/index"
import { IUser } from "@/types/IUser"

interface InitialStateType extends Omit<IUser, "_id"> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface UserFormProps {
  user?: Partial<IUser>
  title?: string
  action: (data: FormData) => Promise<{ success: boolean; message: string }>
}

const UserForm: React.FC<UserFormProps> = ({ user, title, action }) => {
  const inputs = [
    {
      id: "name",
      label: "Ім`я",
      type: "text",
      required: true
    },
    {
      id: "phone",
      label: "Телефон",
      type: "tel",
      required: true
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      required: true
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      required: !user // Password is required only for new users
    },
    {
      id: "isAdmin",
      label: "Адмін?",
      type: "select",
      options: [
        {
          value: "true",
          label: "Так"
        },
        {
          value: "false",
          label: "Ні"
        }
      ]
    },
    {
      id: "isActive",
      label: "Активний?",
      type: "select",
      options: [
        {
          value: "true",
          label: "Так"
        },
        {
          value: "false",
          label: "Ні"
        }
      ]
    }
  ]

  const initialValues: InitialStateType = {
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    password: "",
    createdAt: user?.createdAt || "",
    isAdmin: user?.isAdmin || false,
    isActive: user?.isActive || false
  }

  const handleSubmit = async (values: InitialStateType, { resetForm }: ResetFormProps) => {
    try {
      const formData = new FormData()
      Object.keys(values).forEach(key => {
        formData.append(key, (values as any)[key])
      })

      await action(formData)
      resetForm()
      toast.success(user?._id ? "Користувача оновлено!" : "Нового користувача додано!")
    } catch (error) {
      toast.error("Помилка!")
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl mb-4">{title}</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={userFormSchema}
        enableReinitialize
      >
        {({ errors, setFieldValue }) => (
          <Form className="flex flex-col w-[600px]">
            <div>
              {inputs.map((item, i) => (
                <div key={i}>
                  {item.type === "select" && (
                    <label htmlFor={item.id} className="block mb-2">
                      {item.label}
                    </label>
                  )}
                  <FormField item={item} errors={errors} setFieldValue={setFieldValue} />
                </div>
              ))}
            </div>
            <CustomButton label={"Зберегти"} />
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default UserForm
