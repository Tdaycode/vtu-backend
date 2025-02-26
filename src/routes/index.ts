import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import productRoute from './product.route';
import orderRoute from './order.route';
import paymentRoute from './payment.route';
import cowryRoute from './cowry.route';
import walletRoute from './wallet.route';
import webhookRoute from './webhook.route';
import categoryRoute from './category.route';
import settingsRoute from './settings.route';

const router = express.Router();

const allRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/payments',
    route: paymentRoute,
  },
  {
    path: '/cowry',
    route: cowryRoute,
  },
  {
    path: '/wallet',
    route: walletRoute
  },
  {
    path: '/settings',
    route: settingsRoute
  },
  {
    path: '/webhook',
    route: webhookRoute,
  },
];

allRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
