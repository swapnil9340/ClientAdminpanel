import Layout from "@/components/layout/layout";
import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  return (
    <ProtectedRoute>
   { getLayout(<Component {...pageProps} />)}
    </ProtectedRoute>
    );
}

export default MyApp;
