import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Menu from './components/Menu';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoutes from './components/ProtectedRoutes';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoutes from './components/AdminRoutes';
import SizeCreatePage from './components/Size/SizeCreatePage';
import SizeListPage from './components/Size/SizeListPage';
import SizeUpdatePage from './components/Size/SizeUpdatePage';
import CategoryCreatePage from './components/Category/CategoryCreatePage';
import CategoryListPage from './components/Category/CategoryListPage';
import CategoryUpdatePage from './components/Category/CategoryUpdatePage';
import ProductListPage from './components/Product/ProductListPage';
import ProductCreateAndUpdatePage from './components/Product/ProductCreateAndUpdatePage';

import ProductSinglePage from './components/Product/ProductSinglePage';
import OrderListPage from './components/Order/OrderListPage';
import UsersListPage from './components/Users/UsersListPage';
import ProductAddAndUpdateBook from './components/Product/ProductAddAndUpdateBook';
import AuthorCreatePage from './components/Author/AuthorCreatePage';
import AuthorListPage from './components/Author/AuthorListPage';
import AuthorUpdatePage from './components/Author/AuthorUpdatePage';
import ProductByCategory from './components/ProductByCategory';
import ProductSearchInCategory from './components/ProductSearchInCategory';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

//Fonction Layout
const Layout = () => {
  return (
    <>
      <Menu />
      <Outlet />
      <Footer />
    </>
  );
};
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        // ici on affiche tous les produits de la même catégory, mais on y fait pas de recherche
        path: '/productsByCategory/:category',
        element: <ProductByCategory />,
      },
      {
        // Ici, on est deja dans la catégorie et on recherche en fonction de l'auteur, de la taille ou du prix
        path: '/searchProductinCategory/:category',
        element: <ProductSearchInCategory />,
      },

      {
        path: '/',
        element: <HomeScreen />,
      },

      {
        path: '/forgotPassword',
        element: <ForgotPasswordScreen />,
      },
      {
        path: '/product/:id',
        element: <ProductScreen />,
      },
      {
        path: '/cart',
        element: <CartScreen />,
      },
      {
        path: '/signin',
        element: <SigninScreen />,
      },
      {
        path: '/shipping',
        element: <ShippingAddressScreen />,
      },
      {
        path: '/signup',
        element: <SignupScreen />,
      },
      {
        path: '/payment',
        element: <PaymentMethodScreen />,
      },
      {
        path: '/placeorder',
        element: <PlaceOrderScreen />,
      },
      {
        path: '/order/:id',
        element: (
          <ProtectedRoutes>
            <OrderScreen />
          </ProtectedRoutes>
        ),
      },
      {
        path: '/orderHistory',
        element: (
          <ProtectedRoutes>
            <OrderHistoryScreen />
          </ProtectedRoutes>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoutes>
            <ProfileScreen />
          </ProtectedRoutes>
        ),
      },
      {
        path: '/search',
        element: <SearchScreen />,
      },
      //

      //Fin Post

      //Start Admin Routes

      {
        path: '/admin/dashboard',
        element: (
          <AdminRoutes>
            <DashboardScreen />
          </AdminRoutes>
        ),
      },

      // Debut Size
      {
        path: '/admin/addSize',
        element: <SizeCreatePage />,
      },
      {
        path: '/admin/sizeList',
        element: <SizeListPage />,
      },
      {
        path: '/admin/updateSize/:id',
        element: <SizeUpdatePage />,
      },
      // Fin Size

      // Debut Author
      {
        path: '/admin/addAuthor',
        element: <AuthorCreatePage />,
      },
      {
        path: '/admin/authorList',
        element: <AuthorListPage />,
      },
      {
        path: '/admin/updateAuthor/:id',
        element: <AuthorUpdatePage />,
      },
      // Fin Author

      // Debut Category
      {
        path: '/admin/addCategory',
        element: <CategoryCreatePage />,
      },
      {
        path: '/admin/categoryList',
        element: <CategoryListPage />,
      },
      {
        path: '/admin/updateCategory/:id',
        element: <CategoryUpdatePage />,
      },
      // Fin Category

      // Debut Product
      {
        path: '/admin/addCategory',
        element: <CategoryCreatePage />,
      },
      {
        path: '/admin/productList',
        element: <ProductListPage />,
      },
      {
        path: '/admin/updateCategory/:id',
        element: <CategoryUpdatePage />,
      },
      // Fin Product

      //Debut Product
      {
        path: '/admin/write',
        element: <ProductCreateAndUpdatePage />,
      },

      {
        path: '/admin/addBook',
        element: <ProductAddAndUpdateBook />,
      },

      {
        path: '/admin/product/:id',
        element: <ProductSinglePage />,
      },

      // Fin Product

      //Debut All Order
      {
        path: '/admin/orderList',
        element: <OrderListPage />,
      },
      {
        path: '/admin/product/:id',
        element: <ProductSinglePage />,
      },
      // Fin All Order

      //Debut User
      {
        path: '/admin/userList',
        element: <UsersListPage />,
      },

      // Fin User
      //End Admin Routes
    ],
  },
]);
function App() {
  return (
    <div className="app">
      {/* Le toast sera en bas et centré; puis nous montrerons qu'un seul toast à la fois "limit={1}" */}
      <ToastContainer position="bottom-center" limit={1} />

      <div className="">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
