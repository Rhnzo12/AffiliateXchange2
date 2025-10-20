import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Shield, BarChart3, Video, DollarSign } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Video,
      title: "Rich Video Gallery",
      description: "Browse 6-12 example videos per offer for inspiration and guidance on creating successful content.",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track clicks, conversions, and earnings with detailed analytics dashboards for data-driven decisions.",
    },
    {
      icon: DollarSign,
      title: "Flexible Commissions",
      description: "Choose between per-action payments or monthly retainers to match your content creation style.",
    },
    {
      icon: Zap,
      title: "Instant Approval",
      description: "Get approved within 7 minutes and receive your unique tracking link to start earning immediately.",
    },
    {
      icon: Shield,
      title: "Verified Companies",
      description: "All companies are manually verified to ensure you're working with legitimate, trustworthy brands.",
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Centralized tracking system - no complex setup needed. We handle all the technical details.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Creators" },
    { value: "$2M+", label: "Paid to Creators" },
    { value: "500+", label: "Live Offers" },
    { value: "98%", label: "On-Time Payments" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">AffiliateXchange</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login">Log In</Button>
              </Link>
              <Link href="/register">
                <Button data-testid="button-register">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container relative mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6" data-testid="badge-beta">
              <Zap className="w-3 h-3 mr-1" />
              Now Live - Join 10,000+ Active Creators
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Connect Creators with Brands Seamlessly
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The premier marketplace for video content creators to discover affiliate opportunities, earn commissions, and grow their income with trusted brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?type=creator">
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-join-creator">
                  Join as Creator
                </Button>
              </Link>
              <Link href="/register?type=company">
                <Button size="lg" variant="outline" className="w-full sm:w-auto backdrop-blur-sm" data-testid="button-join-company">
                  Post an Offer
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Auto-approval in 7 minutes
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold text-primary">{stat.value}</CardTitle>
                  <CardDescription className="text-xs">{stat.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help creators and brands connect, collaborate, and grow together.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover-elevate">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Browse & Discover",
                description: "Explore hundreds of affiliate offers across your favorite niches with detailed requirements and example videos.",
              },
              {
                step: "2",
                title: "Apply & Get Approved",
                description: "Submit your application and get auto-approved in just 7 minutes with your unique tracking link.",
              },
              {
                step: "3",
                title: "Create & Earn",
                description: "Promote offers with your tracking link, create amazing content, and earn commissions on every conversion.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-6">
          <Card className="max-w-3xl mx-auto border-primary/20">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Earning?
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of creators already earning with AffiliateXchange. No setup fees, no hidden costs.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?type=creator">
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-cta-creator">
                  Start as Creator
                </Button>
              </Link>
              <Link href="/register?type=company">
                <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-cta-company">
                  List Your Offer
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">AffiliateXchange</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 AffiliateXchange. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
