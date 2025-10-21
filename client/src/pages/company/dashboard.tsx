import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, MousePointerClick, TrendingUp, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Offer {
  id: number;
  title: string;
  status: string;
  activeCreatorCount: number;
  applicationCount: number;
  viewCount: number;
}

interface Analytics {
  totalCreators: number;
  activeCreators: number;
  totalClicks: number;
  pendingApplications: number;
}

export default function CompanyDashboard() {
  const { data: offers, isLoading: offersLoading } = useQuery<Offer[]>({
    queryKey: ["/api/companies/me/offers"],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: ["/api/companies/me/analytics"],
  });

  const offersArray = offers || [];
  const liveOffers = offersArray.filter((o) => o.status === "live").length;
  const reviewOffers = offersArray.filter((o) => o.status === "under_review").length;

  const stats = [
    {
      title: "Active Offers",
      value: liveOffers,
      icon: FileText,
      change: `${reviewOffers} pending review`,
      color: "text-primary",
    },
    {
      title: "Total Creators",
      value: analytics?.totalCreators || 0,
      icon: Users,
      change: `${analytics?.activeCreators || 0} currently active`,
      color: "text-chart-4",
    },
    {
      title: "Total Clicks",
      value: analytics?.totalClicks?.toLocaleString() || "0",
      icon: MousePointerClick,
      change: "Last 30 days",
      color: "text-chart-1",
    },
    {
      title: "Applications",
      value: analytics?.pendingApplications || 0,
      icon: TrendingUp,
      change: "Awaiting response",
      color: "text-chart-3",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
      draft: { variant: "secondary", className: "bg-muted text-muted-foreground" },
      under_review: { variant: "secondary", className: "bg-chart-3/20 text-chart-3" },
      live: { variant: "secondary", className: "bg-chart-2/20 text-chart-2" },
      paused: { variant: "secondary", className: "bg-chart-3/20 text-chart-3" },
      archived: { variant: "secondary", className: "bg-muted text-muted-foreground" },
    };

    const config = variants[status] || variants.draft;
    const displayStatus = status.replace(/_/g, " ");

    return (
      <Badge variant={config.variant} className={config.className}>
        {displayStatus}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Company Dashboard</h1>
            <p className="text-muted-foreground">Manage your offers and track creator performance</p>
          </div>
          <Link href="/company/create-offer">
            <Button data-testid="button-create-offer">
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
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

        {/* Offers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Offers</CardTitle>
                <CardDescription>Manage and track performance of your affiliate offers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {offersLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : offersArray.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Offer Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Active Creators</TableHead>
                      <TableHead className="text-center">Applications</TableHead>
                      <TableHead className="text-center">Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offersArray.map((offer) => (
                      <TableRow key={offer.id} data-testid={`row-offer-${offer.id}`}>
                        <TableCell className="font-medium">
                          <Link href={`/offers/${offer.id}`}>
                            <span className="hover:underline cursor-pointer">{offer.title}</span>
                          </Link>
                        </TableCell>
                        <TableCell>{getStatusBadge(offer.status)}</TableCell>
                        <TableCell className="text-center">{offer.activeCreatorCount || 0}</TableCell>
                        <TableCell className="text-center">{offer.applicationCount || 0}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{offer.viewCount || 0}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/company/offers/${offer.id}/edit`}>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-edit-${offer.id}`}
                            >
                              Edit
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">You haven't created any offers yet.</p>
                <Link href="/company/create-offer">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Offer
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