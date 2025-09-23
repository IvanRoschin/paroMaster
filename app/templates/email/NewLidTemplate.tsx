export interface NewLidTemplateProps {
  name: string;
  email: string;
  phone: string;
}

export function generateLidEmailContent({
  name,
  email,
  phone,
}: NewLidTemplateProps): string {
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
  `;
}
