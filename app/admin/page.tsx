import { getUser, countUsers, countBusinesses, countReferrals, getAllUsers } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  LogOut,
  Building2,
  Handshake,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export default async function AdminPage() {
  const user = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Check if user is admin
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  // Get admin stats
  const totalUsers = await countUsers();
  const totalBusinesses = await countBusinesses();
  const totalReferrals = await countReferrals();
  const pendingReferrals = await countReferrals({ status: 'pending' });
  const recentUsers = await getAllUsers(5);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/50 hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Handshake className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LinkingBiz</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start gap-2 bg-primary/10">
              <Settings className="h-4 w-4" /> Admin
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" /> Users
            </Button>
          </Link>
          <Link href="/admin/businesses">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Building2 className="h-4 w-4" /> Businesses
            </Button>
          </Link>
          <Link href="/admin/referrals">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Handshake className="h-4 w-4" /> Referrals
            </Button>
          </Link>
        </nav>
        <div className="p-4 border-t">
          <form action="/api/auth/signout" method="post">
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, businesses, and platform settings.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Users', value: totalUsers || 0, icon: Users },
              { label: 'Businesses', value: totalBusinesses || 0, icon: Building2 },
              { label: 'Referrals', value: totalReferrals || 0, icon: Handshake },
              { label: 'Pending', value: pendingReferrals || 0, icon: TrendingUp },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers?.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'business' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
