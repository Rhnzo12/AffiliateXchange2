import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, Users, Star } from "lucide-react";
import type { Offer, Company } from "@shared/schema";

interface OfferCardProps {
  offer: Offer & {
    company?: Company;
    averageRating?: number;
  };
  onFavorite?: (offerId: string) => void;
  isFavorited?: boolean;
}

export function OfferCard({ offer, onFavorite, isFavorited }: OfferCardProps) {
  const getCommissionDisplay = () => {
    if (!offer.commissionDetails) return "Commission Available";
    const details = offer.commissionDetails as any;
    
    switch (offer.commissionType) {
      case "per_sale":
        return details.amount ? `$${details.amount} per sale` : `${details.percentage}% per sale`;
      case "per_lead":
        return `$${details.amount} per lead`;
      case "per_click":
        return `$${details.amount} per click`;
      case "retainer":
        return `$${details.monthlyAmount}/month`;
      default:
        return "Hybrid Commission";
    }
  };

  return (
    <Card className="hover-elevate overflow-hidden group" data-testid={`card-offer-${offer.id}`}>
      {/* Featured Image */}
      {offer.featuredImageUrl && (
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={offer.featuredImageUrl}
            alt={offer.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {offer.isPriority && (
            <Badge className="absolute top-3 right-3 bg-chart-3 text-white border-0" data-testid="badge-priority">
              <TrendingUp className="w-3 h-3 mr-1" />
              Priority
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {offer.company?.logoUrl && (
              <img
                src={offer.company.logoUrl}
                alt={offer.company.tradeName || offer.company.legalName}
                className="w-10 h-10 rounded-md object-cover mb-2"
              />
            )}
            <CardTitle className="text-lg line-clamp-2" data-testid="text-offer-title">
              {offer.title}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onFavorite?.(offer.id);
            }}
            className="shrink-0"
            data-testid="button-favorite"
          >
            <Heart className={`w-5 h-5 ${isFavorited ? "fill-primary text-primary" : ""}`} />
          </Button>
        </div>

        <CardDescription className="line-clamp-2">
          {offer.shortDescription}
        </CardDescription>

        {/* Niches */}
        {offer.niches && offer.niches.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {offer.niches.slice(0, 3).map((niche, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {niche}
              </Badge>
            ))}
            {offer.niches.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{offer.niches.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Commission */}
        <div className="flex items-center justify-between p-3 rounded-md bg-accent/50">
          <span className="text-sm text-muted-foreground">Commission</span>
          <span className="text-lg font-semibold text-primary" data-testid="text-commission">
            {getCommissionDisplay()}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {offer.averageRating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-chart-3 text-chart-3" />
              <span>{offer.averageRating.toFixed(1)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{offer.activeCreatorCount} active</span>
          </div>
        </div>

        {/* CTA */}
        <Link href={`/offers/${offer.id}`}>
          <Button className="w-full" data-testid="button-view-offer">
            View Offer
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
