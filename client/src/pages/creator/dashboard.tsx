import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, MousePointerClick, TrendingUp, CheckCircle2, Clock, ExternalLink, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Application {
  id: number;
  status: string;
  appliedAt: string;
  trackingLink?: string;
  offer: {
    id: number;
    title: string;
  };
  offerId?: number;
}

interface Analytics {
  totalEarnings: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
}

export default function CreatorDashboard() {
  const { toast } = useToast();
  
  const { data: applications, isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: ["/api/creators/me/applications"],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: ["/api/creators/me/analytics"],
  });

  const applicationsArray = applications || [];
  const activeCount = applicationsArray.filter((a) => a.status === "active" || a.status === "approved").length;
  const pendingCount = applicationsArray.filter((a) => a.status === "pending").length;

  const stats = [
    {
      title: "Total Earnings",
      value: analytics?.totalEarnings ? `$${analytics.totalEarnings.toLocaleString()}` : "$0",
      icon: DollarSign,
      change: "+12.5% from last month",
      color: "text-chart-2",
    },
    {
      title: "Active Offers",
      value: activeCount,
      icon: TrendingUp,
      change: `${pendingCount} pending`,
      color: "text-primary",
    },
    {
      title: "Total Clicks",
      value: analytics?.totalClicks?.toLocaleString() || "0",
      icon: MousePointerClick,
      change: "Last 30 days",
      color: "text-chart-4",
    },
    {
      title: "Conversions",
      value: analytics?.totalConversions || 0,
      icon: CheckCircle2,
      change: `${analytics?.conversionRate?.toFixed(1) || 0}% conversion rate`,
      color: "text-chart-2",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
      pending: { variant: "secondary", className: "bg-chart-3/20 text-chart-3" },
      approved: { variant: "secondary", className: "bg-chart-2/20 text-chart-2" },
      rejected: { variant: "destructive", className: "bg-destructive/20 text-destructive" },
      active: { variant: "secondary", className: "bg-primary/20 text-primary" },
      completed: { variant: "secondary", className: "bg-muted text-muted-foreground" },
    };

    const config = variants[status] || variants.pending;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const handleCopyLink = (trackingLink: string | undefined) => {
    if (trackingLink) {
      navigator.clipboard.writeText(trackingLink).then(() => {
        toast({
          title: "Link copied!",
          description: "Your tracking link has been copied to clipboard.",
        });
      }).catch(() => {
        toast({
          title: "Failed to copy",
          description: "Please try again.",
          variant: "destructive",
        });
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
            <p className="text-muted-foreground">Track your performance and manage your applications</p>
          </div>
          <Link href="/browse">
            <Button data-testid="button-browse-offers">
              <Search className="w-4 h-4 mr-2" />
              Browse Offers
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsLoading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </CardHeader>
              </Card>
            ))
          ) : (
            stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                      {stat.title}
                    </CardDescription>
                    <CardTitle className="text-3xl" data-testid={`stat-${stat.title.toLowerCase().replace(/ /g, "-")}`}>
                      {stat.value}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </CardHeader>
                </Card>
              );
            })
          )}
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track the status of your affiliate applications</CardDescription>
              </div>
              <Link href="/applications">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {applicationsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : applicationsArray.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Offer</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applicationsArray.slice(0, 5).map((app) => (
                      <TableRow key={app.id} data-testid={`row-application-${app.id}`}>
                        <TableCell className="font-medium">
                          <Link href={`/offers/${app.offer?.id || app.offerId}`}>
                            <span className="hover:underline cursor-pointer">
                              {app.offer?.title || "Untitled Offer"}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell className="font-medium">
                          {app.status === "approved" || app.status === "active" ? (
                            <span className="text-chart-2">Active</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {app.status === "approved" || app.status === "active" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyLink(app.trackingLink)}
                              data-testid={`button-copy-link-${app.id}`}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Copy Link
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" disabled>
                              <Clock className="w-4 h-4 mr-1" />
                              Pending
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">You haven't applied to any offers yet.</p>
                <Link href="/browse">
                  <Button>
                    <Search className="w-4 h-4 mr-2" />
                    Browse Offers
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}