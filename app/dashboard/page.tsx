import { getUser, getBusinessByUserId, getAllBusinesses, getAllIndustries, countReferrals, getTotalEarnings } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Wallet, 
  Settings,
  LogOut,
  TrendingUp,
  Handshake
} from 'lucide-react';

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const isBusiness = user.role === 'business';
  const isAdmin = user.role === 'admin';

  // Get stats based on role
  let stats: { label: string; value: string; icon: any }[] = [];

  if (isBusiness) {
    const business = await getBusinessByUserId(user.id);
    const businessId = business?.id;

    const referralsCount = businessId ? await countReferrals({ businessId }) : 0;
    const convertedCount = businessId ? await countReferrals({ businessId, status: 'converted' }) : 0;

    stats = [
      { label: 'Total Referrals', value: String(referralsCount || 0), icon: Users },
      { label: 'Converted', value: String(convertedCount || 0), icon: TrendingUp },
      { label: 'Conversion Rate', value: referralsCount ? `${Math.round((convertedCount || 0) / referralsCount * 100)}%` : '0%', icon: TrendingUp },
    ];
  } else {
    const referralsCount = await countReferrals({ referrerId: user.id });
    const convertedCount = await countReferrals({ referrerId: user.id, status: 'converted' });
    const totalEarnings = await getTotalEarnings(user.id);

    stats = [
      { label: 'Referrals Made', value: String(referralsCount || 0), icon: Users },
      { label: 'Converted', value: String(convertedCount || 0), icon: TrendingUp },
      { label: 'Earnings', value: `R${totalEarnings.toLocaleString()}`, icon: Wallet },
    ];
  }

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
          {isBusiness && (
            <Link href="/business">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Building2 className="h-4 w-4" /> My Business
              </Button>
            </Link>
          )}
          <Link href="/hub">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" /> Hub
            </Button>
          </Link>
          <Link href="/dashboard/referrals">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Handshake className="h-4 w-4" /> Referrals
            </Button>
          </Link>
          <Link href="/dashboard/earnings">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Wallet className="h-4 w-4" /> Earnings
            </Button>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings className="h-4 w-4" /> Admin
              </Button>
            </Link>
          )}
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
            <h1 className="text-3xl font-bold">Welcome back, {user.full_name?.split(' ')[0]}</h1>
            <p className="text-muted-foreground">
              Here&apos;s what&apos;s happening with your {isBusiness ? 'business' : 'referrals'} today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isBusiness ? (
                  <>
                    <Link href="/business/edit">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Building2 className="h-4 w-4" /> Edit Business Profile
                      </Button>
                    </Link>
                    <Link href="/dashboard/referrals">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Users className="h-4 w-4" /> View Incoming Referrals
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/hub">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Building2 className="h-4 w-4" /> Browse Businesses
                      </Button>
                    </Link>
                    <Link href="/dashboard/referrals">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Handshake className="h-4 w-4" /> My Referrals
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Complete your profile
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    {isBusiness ? 'Set up your business listing' : 'Browse available businesses'}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-muted" />
                    {isBusiness ? 'Start receiving referrals' : 'Make your first referral'}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
