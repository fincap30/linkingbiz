import { getUser, getAllBusinesses, getAllIndustries } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Building2, 
  Star,
  ArrowRight,
  Filter
} from 'lucide-react';

interface HubPageProps {
  searchParams: Promise<{ 
    q?: string;
    industry?: string;
    city?: string;
  }>;
}

export default async function HubPage({ searchParams }: HubPageProps) {
  const user = await getUser();
  const params = await searchParams;
  
  // Get industries for filter
  const industries = await getAllIndustries();

  // Get businesses with filters
  const businesses = await getAllBusinesses({
    active: true,
    search: params.q,
    industry: params.industry,
    city: params.city,
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LinkingBiz</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/hub" className="text-sm font-medium text-primary">
              Hub
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Search */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-4">Find B2B Services</h1>
          <p className="text-primary-foreground/80 mb-6">
            Discover verified businesses and refer leads to earn commissions
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                name="q"
                placeholder="Search businesses, services..."
                className="pl-10 bg-white text-foreground"
                defaultValue={params.q}
              />
            </div>
            <div className="relative w-full md:w-48">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                name="city"
                placeholder="City"
                className="pl-10 bg-white text-foreground"
                defaultValue={params.city}
              />
            </div>
            <Button type="submit" variant="secondary">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </form>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Industry</h4>
                    <div className="space-y-2">
                      <Link 
                        href="/hub"
                        className={`block text-sm ${!params.industry ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
                      >
                        All Industries
                      </Link>
                      {industries?.map((industry: any) => (
                        <Link 
                          key={industry.id}
                          href={`/hub?industry=${industry.name}${params.q ? `&q=${params.q}` : ''}${params.city ? `&city=${params.city}` : ''}`}
                          className={`block text-sm ${params.industry === industry.name ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
                        >
                          {industry.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted-foreground">
                {businesses?.length || 0} businesses found
              </p>
            </div>

            <div className="grid gap-4">
              {businesses?.map((business: any) => (
                <Card key={business.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Logo */}
                      <div className="shrink-0">
                        <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
                          {business.logo_url ? (
                            <img 
                              src={business.logo_url} 
                              alt={business.name}
                              className="h-full w-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              {business.name}
                              {business.is_verified && (
                                <Badge variant="secondary" className="text-xs">Verified</Badge>
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">{business.industry}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{business.rating.toFixed(1)}</span>
                            <span className="text-sm text-muted-foreground">({business.review_count})</span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {business.short_description || business.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {business.city}, {business.province}
                          </span>
                          <span className="flex items-center gap-1">
                            Commission: {business.commission_rate}%
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {business.services?.slice(0, 3).map((service: string) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="shrink-0 flex flex-col gap-2">
                        <Link href={`/business/${business.slug}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Profile <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                        {user && user.id !== business.user_id && (
                          <Link href={`/business/${business.slug}/refer`}>
                            <Button size="sm" className="w-full">
                              Refer Lead
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {businesses?.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters to find what you&apos;re looking for.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
