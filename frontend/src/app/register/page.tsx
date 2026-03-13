import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Create Account - PaisaaLens',
  description: 'Register for a new PaisaaLens account',
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-gray-50 dark:bg-gray-900 px-4">
      <RegisterForm />
    </div>
  );
}
