import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Users, Star, Eye, TrendingUp, Play, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function OfferDetail() {
  const { id } = useParams();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");

  const { data: offer, isLoading } = useQuery({
    queryKey: ["/api/offers", id],
  });

  const { data: videos } = useQuery({
    queryKey: ["/api/offers", id, "videos"],
  });

  const { data: reviews } = useQuery({
    queryKey: ["/api/reviews/company", offer?.companyId],
    enabled: !!offer?.companyId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardTitle className="mb-2">Offer Not Found</CardTitle>
          <CardDescription>This offer may have been removed or doesn't exist.</CardDescription>
          <Link href="/browse">
            <Button className="mt-4">Browse All Offers</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleApply = () => {
    // TODO: Implement application submission
    console.log("Applying with message:", applicationMessage);
    setIsApplyDialogOpen(false);
  };

  const getCommissionDisplay = () => {
    const details = offer.commissionDetails as any;
    switch (offer.commissionType) {
      case "per_sale":
        return details?.amount ? `$${details.amount}` : `${details?.percentage}%`;
      case "per_lead":
        return `$${details?.amount}`;
      case "per_click":
        return `$${details?.amount}`;
      case "retainer":
        return `$${details?.monthlyAmount}/mo`;
      default:
        return "Hybrid";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <Link href="/browse">
            <Button variant="ghost" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              {offer.isPriority && (
                <Badge className="mb-3 bg-chart-3 text-white border-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Priority Listing
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-title">
                {offer.title}
              </h1>
              
              {/* Company Info */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={offer.company?.logoUrl} />
                  <AvatarFallback>
                    <Building2 className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{offer.company?.tradeName || offer.company?.legalName}</p>
                  <p className="text-sm text-muted-foreground">{offer.company?.industry}</p>
                </div>
              </div>

              {/* Niches */}
              {offer.niches && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {offer.niches.map((niche: string, index: number) => (
                    <Badge key={index} variant="secondary">{niche}</Badge>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span>{offer.viewCount} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{offer.activeCreatorCount} active creators</span>
                </div>
                {reviews && reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-chart-3 text-chart-3" />
                    <span>
                      {(reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)} 
                      {" "}({reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="videos">Example Videos</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">About This Offer</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {offer.fullDescription}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="videos" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {videos && videos.length > 0 ? (
                    videos.map((video: any) => (
                      <Card key={video.id} className="overflow-hidden hover-elevate">
                        <div className="aspect-video bg-muted flex items-center justify-center relative group cursor-pointer">
                          <Play className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                          <Badge className="absolute top-2 right-2" variant="secondary">
                            {video.platform}
                          </Badge>
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{video.title}</CardTitle>
                          {video.creatorCredit && (
                            <CardDescription className="text-xs">by {video.creatorCredit}</CardDescription>
                          )}
                        </CardHeader>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground col-span-2">No example videos available yet.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Creator Requirements</h3>
                  <div className="space-y-3 text-sm">
                    {offer.requirements && (
                      <>
                        {(offer.requirements as any).minFollowers && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Minimum Followers</span>
                            <span className="font-medium">{(offer.requirements as any).minFollowers}+</span>
                          </div>
                        )}
                        {(offer.requirements as any).platforms && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Allowed Platforms</span>
                            <span className="font-medium">{(offer.requirements as any).platforms.join(", ")}</span>
                          </div>
                        )}
                        {(offer.requirements as any).geographic && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Geographic Restrictions</span>
                            <span className="font-medium">{(offer.requirements as any).geographic}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review: any) => (
                      <Card key={review.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? "fill-chart-3 text-chart-3" : "text-muted"}`}
                                  />
                                ))}
                              </div>
                              <CardDescription className="text-xs">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        {review.reviewText && (
                          <CardContent>
                            <p className="text-sm">{review.reviewText}</p>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 space-y-6" style={{ height: "fit-content" }}>
            <Card>
              <CardHeader>
                <CardTitle>Commission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 rounded-lg bg-accent/30">
                  <p className="text-3xl font-bold text-primary" data-testid="text-commission">
                    {getCommissionDisplay()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">
                    {offer.commissionType?.replace("_", " ")}
                  </p>
                </div>

                <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg" data-testid="button-apply">
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply to {offer.title}</DialogTitle>
                      <DialogDescription>
                        Tell the company why you're interested in promoting this offer.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="message">Why are you interested? (Optional)</Label>
                        <Textarea
                          id="message"
                          placeholder="Share a bit about your audience and why you'd be a great fit..."
                          value={applicationMessage}
                          onChange={(e) => setApplicationMessage(e.target.value)}
                          rows={4}
                          maxLength={500}
                          data-testid="textarea-message"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                          {applicationMessage.length}/500
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleApply} data-testid="button-submit-application">
                        Submit Application
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full" data-testid="button-save">
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>
              </CardContent>
            </Card>

            {/* Company Info */}
            {offer.company && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About the Company</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={offer.company.logoUrl} />
                      <AvatarFallback>
                        <Building2 className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{offer.company.tradeName || offer.company.legalName}</p>
                      <p className="text-sm text-muted-foreground">{offer.company.industry}</p>
                    </div>
                  </div>
                  {offer.company.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {offer.company.description}
                    </p>
                  )}
                  {offer.company.website && (
                    <a
                      href={offer.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Visit Website →
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
