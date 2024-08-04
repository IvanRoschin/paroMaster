export interface NewLidProps {
	name: string
	email: string
	phone: string
}

export function generateEmailContent({ name, email, phone }: NewLidProps): string {
	return `
    <div>
      <h1>З форми Зворотнього зв'язку сайту ParoMaster надійшов запит 
			</h1>
      <br />
      <br />
      <h3>
        <p>Від користувача: ${name}</p>
        <p>Телефон:${phone}</p>
        <p>Вказаний e-mail: ${email}</p>
      </h3>
      <br />
      <br />
    </div>
  `
}
