import { getUser, getBusinessBySlug, getReviewsByBusinessId } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Star,
  Building2,
  ArrowLeft,
  Handshake,
  BadgeCheck
} from 'lucide-react';

interface BusinessPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BusinessProfilePage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const user = await getUser();

  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  // Get reviews
  const reviews = await getReviewsByBusinessId(business.id, 5);

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

      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 to-accent/20 relative">
        {business.cover_image_url && (
          <img 
            src={business.cover_image_url} 
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="container -mt-16 relative z-10">
        <Link href="/hub" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Hub
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo */}
                  <div className="shrink-0">
                    <div className="h-24 w-24 rounded-xl bg-muted flex items-center justify-center border-4 border-background shadow-lg">
                      {business.logo_url ? (
                        <img 
                          src={business.logo_url} 
                          alt={business.name}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building2 className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                          {business.name}
                          {business.is_verified && (
                            <BadgeCheck className="h-5 w-5 text-blue-500" />
                          )}
                        </h1>
                        <p className="text-muted-foreground">{business.industry}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-semibold">{business.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({business.review_count} reviews)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {business.services?.map((service: string) => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">About</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {business.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {review.user_name || 'Anonymous'}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Referral Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Refer a Lead</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Commission Rate</span>
                  <Badge variant="secondary" className="text-lg">{business.commission_rate}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Refer potential customers to {business.name} and earn {business.commission_rate}% commission when they convert.
                </p>
                {user && user.id !== business.user_id ? (
                  <Link href={`/business/${business.slug}/refer`}>
                    <Button className="w-full gap-2">
                      <Handshake className="h-4 w-4" /> Submit Referral
                    </Button>
                  </Link>
                ) : user?.id === business.user_id ? (
                  <Button className="w-full" disabled>
                    Your Business
                  </Button>
                ) : (
                  <Link href="/auth/login">
                    <Button className="w-full" variant="outline">
                      Sign in to Refer
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.website && (
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm hover:text-primary"
                  >
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    {business.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <a 
                  href={`mailto:${business.email}`}
                  className="flex items-center gap-3 text-sm hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {business.email}
                </a>
                <a 
                  href={`tel:${business.phone}`}
                  className="flex items-center gap-3 text-sm hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {business.phone}
                </a>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>
                    {business.address && <>{business.address}<br /></>}
                    {business.city}, {business.province}<br />
                    {business.postal_code && <>{business.postal_code}<br /></>}
                    {business.country}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
