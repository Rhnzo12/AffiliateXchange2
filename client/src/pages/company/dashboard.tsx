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

export default function CompanyDashboard() {
  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ["/api/companies/me/offers"],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/companies/me/analytics"],
  });

  const stats = [
    {
      title: "Active Offers",
      value: offers?.filter((o: any) => o.status === "live").length || 0,
      icon: FileText,
      change: `${offers?.filter((o: any) => o.status === "under_review").length || 0} pending review`,
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
    const variants: Record<string, { variant: any; className: string }> = {
      draft: { variant: "secondary", className: "bg-muted text-muted-foreground" },
      under_review: { variant: "secondary", className: "bg-chart-3/20 text-chart-3" },
      live: { variant: "secondary", className: "bg-chart-2/20 text-chart-2" },
      paused: { variant: "secondary", className: "bg-chart-3/20 text-chart-3" },
      archived: { variant: "secondary", className: "bg-muted text-muted-foreground" },
    };

    const config = variants[status] || variants.draft;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
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
                <Card key={index} className="hover-elevate">
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
            ) : offers && offers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Offer Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Active Creators</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.map((offer: any) => (
                    <TableRow key={offer.id} data-testid={`row-offer-${offer.id}`}>
                      <TableCell className="font-medium">
                        <Link href={`/offers/${offer.id}`}>
                          <span className="hover:underline cursor-pointer">{offer.title}</span>
                        </Link>
                      </TableCell>
                      <TableCell>{getStatusBadge(offer.status)}</TableCell>
                      <TableCell>{offer.activeCreatorCount}</TableCell>
                      <TableCell>{offer.applicationCount}</TableCell>
                      <TableCell className="text-muted-foreground">{offer.viewCount}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/company/offers/${offer.id}/edit`}
                          data-testid={`button-edit-${offer.id}`}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
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
