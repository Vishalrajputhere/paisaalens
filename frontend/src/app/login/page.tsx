import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login to PaisaaLens',
  description: 'Sign in to your PaisaaLens account',
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <LoginForm />
    </div>
  );
}
