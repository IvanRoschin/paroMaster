export const routes = {
  home: '/',
  customerProfile: {
    verifyEmail: '/customer/auth/verify-email',
    signIn: '/customer/auth/signin',
    changePassword: '/customer/auth/change-password',
  },
  userProfile: {
    info: '/profile/info',
    orders: '/profile/orders',
    wishes: '/profile/wishes',
    settings: '/profile/settings',
    edit: '/profile/info/edit',
  },
};

export const baseUrl =
  process.env.PUBLIC_URL?.replace(/\/$/, '') || 'http://localhost:3000';
