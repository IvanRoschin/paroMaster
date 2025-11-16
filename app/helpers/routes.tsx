export const routes = {
  publicRoutes: {
    home: '/',
    auth: {
      verifyEmail: '/auth/verify-email',
      signIn: '/auth/signin',
      forgotPassword: '/auth/forgot-password',
      restorePassword: '/auth/restore-password',
    },
    catalog: '/catalog',
    ourworks: '/works',
    services: '/services',
    delivery: '/delivery',
    guarantee: '/guarantee',
    contact: '/contact',
    page404: '/not-found',
  },
  customerRoutes: {
    dashboard: '/customer',
    changePassword: '/customer/auth/change-password',
    changeUserData: '/customer/change-user-data',
    changeDeliveryAddress: '/customer/change-delivery-address',
    ordersHistroy: 'customer/orders-history',
  },
  adminRoutes: {
    dashboard: '/admin',
    customers: '/admin/customers',
    orders: '/admin/orders',
    goods: '/admin/goods',
    brands: '/admin/brands',
    payments: '/admin/payments',
    users: '/admin/users',
    categories: '/admin/categories',
    testimonials: '/admin/testimonials',
    slides: '/admin/slides',
  },
};

export const baseUrl =
  process.env.PUBLIC_URL?.replace(/\/$/, '') || 'http://localhost:3000';
