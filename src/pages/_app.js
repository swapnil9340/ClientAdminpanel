import MainLayout from "@/components/layout/Main";
// import AuthLayout from "@/component/layout/AuthLayout"
import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import AuthLayout from "@/components/layout/AuthLayout";

function MyApp({ Component, pageProps }) {
  // if page defines getLayout, use it; otherwise choose layout by path
  const isAuthPage = ['/login', '/signup'].includes(pageProps.__NEXT_INIT_URL || '');
  // you can also set Component.authPage = true inside those pages instead
  const Layout = Component.getLayout
    ? Component.getLayout
    : isAuthPage
    ? (page) => <AuthLayout>{page}</AuthLayout>
    : (page) => <MainLayout>{page}</MainLayout>;

  return Layout(<Component {...pageProps} />);
}

export default MyApp;



