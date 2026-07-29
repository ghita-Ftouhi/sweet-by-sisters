import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, isValidAdminSessionToken } from '@/lib/adminAuth';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isValidAdminSessionToken(token)) {
    return <AdminLoginForm />;
  }

  return <>{children}</>;
}
