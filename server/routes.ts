import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCreatorSchema, insertCompanySchema, insertOfferSchema, insertApplicationSchema, insertFavoriteSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Helper function to generate unique short codes for tracking links
function generateShortCode(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to hash passwords
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Helper function to verify passwords
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Auto-approval logic (simulated - in production would use a job queue)
async function scheduleAutoApproval(applicationId: string) {
  setTimeout(async () => {
    try {
      const shortCode = generateShortCode();
      const trackingLink = `https://track.affiliatexchange.com/go/${shortCode}`;
      
      await storage.updateApplication(applicationId, {
        status: "approved",
        approvedAt: new Date(),
        uniqueTrackingCode: shortCode,
        trackingLink: trackingLink,
      });
      
      console.log(`Application ${applicationId} auto-approved with tracking code ${shortCode}`);
    } catch (error) {
      console.error(`Error auto-approving application ${applicationId}:`, error);
    }
  }, 7 * 60 * 1000); // 7 minutes
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================
  // AUTHENTICATION ROUTES
  // ============================================
  
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      // Validate request body with Zod
      const registerSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        userType: z.enum(["creator", "company", "admin"]).default("creator"),
        displayName: z.string().min(1),
      });

      const validatedData = registerSchema.parse(req.body);
      const { email, password, userType, displayName } = validatedData;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user with validated data
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        userType,
        status: "active",
      });

      // Create creator or company profile
      if (userType === "creator") {
        await storage.createCreator({
          userId: user.id,
          displayName,
        });
      } else if (userType === "company") {
        await storage.createCompany({
          userId: user.id,
          legalName: displayName,
          website: "", // Will be updated in onboarding
        });
      }

      res.json({ user: { id: user.id, email: user.email, userType: user.userType } });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      // Validate request body with Zod
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string(),
      });

      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password with bcrypt
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({ user: { id: user.id, email: user.email, userType: user.userType } });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // OFFER ROUTES
  // ============================================
  
  app.get("/api/offers", async (req: Request, res: Response) => {
    try {
      const { niche, sort, limit } = req.query;
      const offers = await storage.getOffers({ 
        niche: niche as string,
        sort: sort as string,
        limit: limit ? parseInt(limit as string) : 50,
      });
      res.json(offers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/offers/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const offer = await storage.getOffer(id);
      
      if (!offer) {
        return res.status(404).json({ error: "Offer not found" });
      }

      // Get company info
      const company = await storage.getCompany(offer.companyId);

      res.json({ ...offer, company });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/offers", async (req: Request, res: Response) => {
    try {
      const offerData = insertOfferSchema.parse(req.body);
      
      // Generate slug from title
      const slug = offerData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      const offer = await storage.createOffer({
        ...offerData,
        slug: `${slug}-${Date.now()}`,
      });

      res.json(offer);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // APPLICATION ROUTES
  // ============================================
  
  app.post("/api/applications", async (req: Request, res: Response) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      
      const application = await storage.createApplication(applicationData);

      // Schedule auto-approval after 7 minutes
      scheduleAutoApproval(application.id);

      res.json(application);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/creators/me/applications", async (req: Request, res: Response) => {
    try {
      // TODO: Get creator ID from authenticated session
      const creatorId = req.query.creatorId as string;
      
      if (!creatorId) {
        return res.status(400).json({ error: "Creator ID required" });
      }

      const applications = await storage.getApplications({ creatorId });
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/creators/me/analytics", async (req: Request, res: Response) => {
    try {
      // TODO: Implement real analytics aggregation
      res.json({
        totalEarnings: 2450,
        totalClicks: 15234,
        totalConversions: 89,
        conversionRate: 0.58,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // FAVORITES ROUTES
  // ============================================
  
  app.get("/api/creators/me/favorites", async (req: Request, res: Response) => {
    try {
      const creatorId = req.query.creatorId as string;
      
      if (!creatorId) {
        return res.status(400).json({ error: "Creator ID required" });
      }

      const favorites = await storage.getFavorites(creatorId);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/favorites", async (req: Request, res: Response) => {
    try {
      const favoriteData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.createFavorite(favoriteData);
      res.json(favorite);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/favorites/:offerId", async (req: Request, res: Response) => {
    try {
      const { offerId } = req.params;
      const creatorId = req.query.creatorId as string;
      
      if (!creatorId) {
        return res.status(400).json({ error: "Creator ID required" });
      }

      await storage.deleteFavorite(creatorId, offerId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // REVIEWS ROUTES
  // ============================================
  
  app.get("/api/reviews/company/:companyId", async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const reviews = await storage.getReviews(companyId);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // COMPANY ROUTES
  // ============================================
  
  app.get("/api/companies/me/offers", async (req: Request, res: Response) => {
    try {
      // TODO: Get company ID from authenticated session
      // For now, return all offers (in production, filter by companyId)
      const offers = await storage.getOffers({});
      res.json(offers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/companies/me/analytics", async (req: Request, res: Response) => {
    try {
      // TODO: Implement real analytics aggregation
      res.json({
        totalCreators: 45,
        activeCreators: 32,
        totalClicks: 45678,
        pendingApplications: 8,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // TRACKING ROUTES
  // ============================================
  
  app.get("/track/:shortCode", async (req: Request, res: Response) => {
    try {
      const { shortCode } = req.params;
      
      // TODO: Log click event and redirect
      // For now, just redirect to a placeholder
      res.redirect("https://example.com");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
