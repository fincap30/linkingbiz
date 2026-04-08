import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Building2, 
  Users, 
  TrendingUp, 
  Handshake,
  Search,
  BadgeCheck,
  Wallet
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Handshake className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LinkingBiz</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/hub" className="text-sm font-medium hover:text-primary">
              Hub
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-16 pb-24">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Now serving businesses across South Africa
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              Connect. Refer.{" "}
              <span className="text-primary">Grow.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              South Africa's premier B2B marketplace. Connect with verified businesses, 
              refer leads, and earn commissions. Build your network, boost your revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2">
                  Join as Business <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/hub">
                <Button size="lg" variant="outline" className="gap-2">
                  <Search className="h-4 w-4" /> Explore Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Businesses", value: "500+" },
              { label: "Referrals Made", value: "2,000+" },
              { label: "Commission Earned", value: "R5M+" },
              { label: "Industries", value: "25+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How LinkingBiz Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're a business looking for leads or a referrer seeking commission opportunities, 
              our platform makes connections simple and profitable.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "List Your Business",
                description: "Create a verified business profile. Showcase your services, set your commission rates, and start receiving qualified referrals.",
              },
              {
                icon: Users,
                title: "Make Referrals",
                description: "Browse businesses in the Hub. Submit referrals for services you recommend. Track status in real-time.",
              },
              {
                icon: Wallet,
                title: "Earn Commissions",
                description: "Get paid when your referrals convert. Transparent tracking, reliable payments, and unlimited earning potential.",
              },
            ].map((step, index) => (
              <Card key={step.title} className="relative">
                <CardContent className="pt-6">
                  <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <step.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                Everything you need to grow your B2B network
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: BadgeCheck,
                    title: "Verified Businesses",
                    description: "All businesses are vetted and verified to ensure quality connections.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Real-time Analytics",
                    description: "Track your referrals, conversion rates, and earnings with detailed dashboards.",
                  },
                  {
                    icon: Search,
                    title: "Smart Matching",
                    description: "Our platform helps match referrers with businesses in their network.",
                  },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card border rounded-2xl p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20" />
                      <div>
                        <div className="font-medium">ABC Consulting</div>
                        <div className="text-sm text-muted-foreground">New referral received</div>
                      </div>
                    </div>
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/20" />
                      <div>
                        <div className="font-medium">Commission Earned</div>
                        <div className="text-sm text-muted-foreground">R2,500.00 - Tech Solutions Ltd</div>
                      </div>
                    </div>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-500/20" />
                      <div>
                        <div className="font-medium">Deal Converted</div>
                        <div className="text-sm text-muted-foreground">Marketing Pro Pty Ltd</div>
                      </div>
                    </div>
                    <Handshake className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 sm:px-16 sm:py-24">
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-6">
                Ready to grow your business network?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Join thousands of South African businesses already connecting and earning on LinkingBiz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/hub">
                  <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                    Browse Hub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-auto">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Handshake className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">LinkingBiz</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Connecting South African businesses through trusted referrals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/hub" className="hover:text-primary">Hub</Link></li>
                <li><Link href="/auth/register" className="hover:text-primary">List Business</Link></li>
                <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">About</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Twitter</Link></li>
                <li><Link href="#" className="hover:text-primary">LinkedIn</Link></li>
                <li><Link href="#" className="hover:text-primary">Facebook</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} LinkingBiz. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
