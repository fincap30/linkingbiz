import { getUser, getReferralsByBusinessId, getReferralsByReferrerId } from '@/lib/db';
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
  Mail,
  Phone
} from 'lucide-react';

export default async function AdminReferralsPage() {
  const user = await getUser();

  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  // Get all referrals (for admin, we'll show a placeholder)
  // In a real app, you'd have a getAllReferrals function
  const referrals: any[] = [];

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
            <Button variant="ghost" className="w-full justify-start gap-2 bg-primary/10">
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
            <h1 className="text-3xl font-bold">Manage Referrals</h1>
            <p className="text-muted-foreground">
              View and manage all referrals on the platform.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Referral management coming soon. This page will show all referrals across all businesses.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
