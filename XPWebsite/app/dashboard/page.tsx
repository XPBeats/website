import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserDashboard } from '@/components/dashboard/user-dashboard'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Redirect admins to admin panel
  if (session.user.role === 'ADMIN') {
    redirect('/admin')
  }

  return <UserDashboard />
}