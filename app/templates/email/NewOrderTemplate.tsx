interface NewOrderTemplateProps {
  name: string
  email: string
  message: string
}
const NewOrderTemplate: React.FC<NewOrderTemplateProps> = ({ name, email, message }) => {
  return (
    <div>
      <h1>Order form submission</h1>
      <p>
        From {name} at {email}
      </p>
      <h2>Message:</h2>
      <p>{message}</p>
    </div>
  )
}

export default NewOrderTemplate
