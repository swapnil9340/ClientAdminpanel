import LoginForm from '@/components/Login/login';
import AuthLayout from '@/components/layout/AuthLayout';

export default function LoginPage() {
  return <LoginForm />;
}

// Use Auth Layout for login page
LoginPage.getLayout = function (page) {
  return <AuthLayout>{page}</AuthLayout>;
};
