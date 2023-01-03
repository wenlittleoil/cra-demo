import NotFound from 'components/NotFound';
import SettingManageUser from './setting-manage-user';
import BusinessPage from './business-page';
import ProductCategory from './product-category';
import ProductSelf from './product-self';
import Dealer from './dealer';
import User from './user';

export const ROUTES = [
  {
    path: 'setting-manage-user',
    element: <SettingManageUser />,
  },
  {
    path: 'business-page',
    element: <BusinessPage />,
  },
  {
    path: 'product-category',
    element: <ProductCategory />,
  },
  {
    path: 'product-self',
    element: <ProductSelf />,
  },
  {
    path: 'dealer',
    element: <Dealer />,
  },
  {
    path: 'user',
    element: <User />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

