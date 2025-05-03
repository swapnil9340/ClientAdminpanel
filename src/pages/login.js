import LoginForm from '@/components/Login/login';
import AuthLayout from '@/components/layout/AuthLayout';

function LoginPage() {
  return <LoginForm />;
}

// 👇 Use AuthLayout for this page only
LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default LoginPage;
