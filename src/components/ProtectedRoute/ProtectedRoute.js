import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const publicRoutes = ['/login', '/register'];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token && !publicRoutes.includes(router.pathname)) {
      router.replace('/login');
    } else {
      setLoading(false); // allow rendering only when token is valid or page is public
    }
  }, [router]);

  // Don’t render anything until the auth check is done
  if (loading && !publicRoutes.includes(router.pathname)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
