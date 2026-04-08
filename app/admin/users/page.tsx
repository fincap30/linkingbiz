import { getUser, getAllUsers } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
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
  ArrowLeft,
  Mail
} from 'lucide-react';

export default async function AdminUsersPage() {
  const user = await getUser();

  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  const users = await getAllUsers(100);

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
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" /> Admin
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="ghost" className="w-full justify-start gap-2 bg-primary/10">
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
            <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Admin
            </Link>
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="text-muted-foreground">
              View and manage all platform users.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users?.map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between py-4 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{u.full_name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="h-3 w-3" /> {u.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant={u.role === 'admin' ? 'destructive' : u.role === 'business' ? 'default' : 'secondary'}>
                      {u.role}
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
