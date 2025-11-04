export type SignUpFormCreds = {
  name: string;
  email: string;
  password: string;
};

export type SignUpFormRes = {
  message: string;
};

export type SignInFormCreds = {
  email: string;
  password: string;
};

export type SignInFormRes = {
  ok: boolean;
  status: number;
  url: string | null;
};

export type ForgotPasswordFormCreds = {
  email: string;
};

export type ForgotPasswordFormRes = {
  data: string;
  isError: boolean;
  errorMessage: string;
};

export type ResetPasswordFormCreds = {
  newPassword: string;
  confirmNewPassword: string;
  email: string;
};

export type ResetPasswordFormRes = {
  data: string;
  isError: boolean;
  errorMessage: string;
};
