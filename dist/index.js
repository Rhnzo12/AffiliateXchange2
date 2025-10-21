var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  applicationStatusEnum: () => applicationStatusEnum,
  applications: () => applications,
  applicationsRelations: () => applicationsRelations,
  clickEvents: () => clickEvents,
  commissionTypeEnum: () => commissionTypeEnum,
  companies: () => companies,
  companiesRelations: () => companiesRelations,
  creators: () => creators,
  creatorsRelations: () => creatorsRelations,
  exampleVideos: () => exampleVideos,
  favorites: () => favorites,
  insertApplicationSchema: () => insertApplicationSchema,
  insertCompanySchema: () => insertCompanySchema,
  insertCreatorSchema: () => insertCreatorSchema,
  insertFavoriteSchema: () => insertFavoriteSchema,
  insertOfferSchema: () => insertOfferSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertUserSchema: () => insertUserSchema,
  messages: () => messages,
  offerStatusEnum: () => offerStatusEnum,
  offers: () => offers,
  offersRelations: () => offersRelations,
  platformEnum: () => platformEnum,
  reviewStatusEnum: () => reviewStatusEnum,
  reviews: () => reviews,
  trackingLinks: () => trackingLinks,
  transactionStatusEnum: () => transactionStatusEnum,
  transactions: () => transactions,
  userStatusEnum: () => userStatusEnum,
  userTypeEnum: () => userTypeEnum,
  users: () => users,
  usersRelations: () => usersRelations,
  verificationStatusEnum: () => verificationStatusEnum
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var userTypeEnum = pgEnum("user_type", ["creator", "company", "admin"]);
var userStatusEnum = pgEnum("user_status", ["pending", "active", "suspended", "banned"]);
var verificationStatusEnum = pgEnum("verification_status", ["pending", "verified", "rejected"]);
var offerStatusEnum = pgEnum("offer_status", ["draft", "under_review", "live", "paused", "archived"]);
var commissionTypeEnum = pgEnum("commission_type", ["per_sale", "per_lead", "per_click", "retainer", "hybrid"]);
var applicationStatusEnum = pgEnum("application_status", ["pending", "approved", "rejected", "active", "completed"]);
var reviewStatusEnum = pgEnum("review_status", ["published", "hidden", "flagged"]);
var transactionStatusEnum = pgEnum("transaction_status", ["pending", "scheduled", "completed", "failed", "disputed"]);
var platformEnum = pgEnum("platform", ["youtube", "tiktok", "instagram", "facebook", "snapchat", "twitter", "linkedin", "other"]);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  userType: userTypeEnum("user_type").notNull(),
  status: userStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login")
});
var creators = pgTable("creators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  socialLinks: jsonb("social_links").$type(),
  followerCounts: jsonb("follower_counts").$type(),
  preferredNiches: text("preferred_niches").array(),
  totalEarnings: integer("total_earnings").notNull().default(0),
  paymentInfo: jsonb("payment_info")
}, (table) => ({
  userIdIdx: index("creators_user_id_idx").on(table.userId)
}));
var companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  legalName: text("legal_name").notNull(),
  tradeName: text("trade_name"),
  logoUrl: text("logo_url"),
  website: text("website").notNull(),
  description: text("description"),
  industry: text("industry"),
  companySize: text("company_size"),
  verificationStatus: verificationStatusEnum("verification_status").notNull().default("pending"),
  verificationDocuments: text("verification_documents").array(),
  approvalDate: timestamp("approval_date"),
  paymentInfo: jsonb("payment_info")
}, (table) => ({
  userIdIdx: index("companies_user_id_idx").on(table.userId)
}));
var offers = pgTable("offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  featuredImageUrl: text("featured_image_url"),
  niches: text("niches").array(),
  commissionType: commissionTypeEnum("commission_type").notNull(),
  commissionDetails: jsonb("commission_details"),
  requirements: jsonb("requirements"),
  terms: text("terms"),
  status: offerStatusEnum("status").notNull().default("draft"),
  isPriority: boolean("is_priority").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  applicationCount: integer("application_count").notNull().default(0),
  activeCreatorCount: integer("active_creator_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  approvedAt: timestamp("approved_at")
}, (table) => ({
  companyIdIdx: index("offers_company_id_idx").on(table.companyId),
  statusIdx: index("offers_status_idx").on(table.status),
  slugIdx: index("offers_slug_idx").on(table.slug)
}));
var exampleVideos = pgTable("example_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  offerId: varchar("offer_id").notNull().references(() => offers.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  creatorCredit: text("creator_credit"),
  description: text("description"),
  platform: platformEnum("platform").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  uploadedByUserId: varchar("uploaded_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow()
}, (table) => ({
  offerIdIdx: index("example_videos_offer_id_idx").on(table.offerId)
}));
var applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull().references(() => creators.id, { onDelete: "cascade" }),
  offerId: varchar("offer_id").notNull().references(() => offers.id, { onDelete: "cascade" }),
  message: text("message"),
  preferredCommissionType: commissionTypeEnum("preferred_commission_type"),
  status: applicationStatusEnum("status").notNull().default("pending"),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
  approvedAt: timestamp("approved_at"),
  uniqueTrackingCode: text("unique_tracking_code").unique(),
  trackingLink: text("tracking_link")
}, (table) => ({
  creatorIdIdx: index("applications_creator_id_idx").on(table.creatorId),
  offerIdIdx: index("applications_offer_id_idx").on(table.offerId),
  trackingCodeIdx: index("applications_tracking_code_idx").on(table.uniqueTrackingCode)
}));
var trackingLinks = pgTable("tracking_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  shortCode: text("short_code").notNull().unique(),
  fullUrl: text("full_url").notNull(),
  clickCount: integer("click_count").notNull().default(0),
  uniqueClickCount: integer("unique_click_count").notNull().default(0),
  conversionCount: integer("conversion_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow()
}, (table) => ({
  applicationIdIdx: index("tracking_links_application_id_idx").on(table.applicationId),
  shortCodeIdx: index("tracking_links_short_code_idx").on(table.shortCode)
}));
var clickEvents = pgTable("click_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingLinkId: varchar("tracking_link_id").notNull().references(() => trackingLinks.id, { onDelete: "cascade" }),
  ipAddressHash: text("ip_address_hash"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  country: text("country"),
  deviceType: text("device_type"),
  clickedAt: timestamp("clicked_at").notNull().defaultNow(),
  converted: boolean("converted").notNull().default(false)
}, (table) => ({
  trackingLinkIdIdx: index("click_events_tracking_link_id_idx").on(table.trackingLinkId)
}));
var messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  applicationId: varchar("application_id").references(() => applications.id),
  messageText: text("message_text").notNull(),
  attachments: text("attachments").array(),
  read: boolean("read").notNull().default(false),
  sentAt: timestamp("sent_at").notNull().defaultNow()
}, (table) => ({
  senderIdIdx: index("messages_sender_id_idx").on(table.senderId),
  receiverIdIdx: index("messages_receiver_id_idx").on(table.receiverId)
}));
var reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull().references(() => creators.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  applicationId: varchar("application_id").references(() => applications.id),
  rating: integer("rating").notNull(),
  reviewText: text("review_text"),
  categoryRatings: jsonb("category_ratings").$type(),
  status: reviewStatusEnum("status").notNull().default("published"),
  editedByAdmin: boolean("edited_by_admin").notNull().default(false),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (table) => ({
  companyIdIdx: index("reviews_company_id_idx").on(table.companyId)
}));
var transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => applications.id),
  creatorId: varchar("creator_id").notNull().references(() => creators.id),
  companyId: varchar("company_id").notNull().references(() => companies.id),
  amountGross: integer("amount_gross").notNull(),
  platformFee: integer("platform_fee").notNull(),
  processingFee: integer("processing_fee").notNull(),
  amountNet: integer("amount_net").notNull(),
  status: transactionStatusEnum("status").notNull().default("pending"),
  paymentMethod: text("payment_method"),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  receiptUrl: text("receipt_url")
}, (table) => ({
  creatorIdIdx: index("transactions_creator_id_idx").on(table.creatorId),
  companyIdIdx: index("transactions_company_id_idx").on(table.companyId)
}));
var favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull().references(() => creators.id, { onDelete: "cascade" }),
  offerId: varchar("offer_id").notNull().references(() => offers.id, { onDelete: "cascade" }),
  savedAt: timestamp("saved_at").notNull().defaultNow()
}, (table) => ({
  creatorOfferIdx: index("favorites_creator_offer_idx").on(table.creatorId, table.offerId)
}));
var usersRelations = relations(users, ({ one }) => ({
  creator: one(creators, {
    fields: [users.id],
    references: [creators.userId]
  }),
  company: one(companies, {
    fields: [users.id],
    references: [companies.userId]
  })
}));
var creatorsRelations = relations(creators, ({ one, many }) => ({
  user: one(users, {
    fields: [creators.userId],
    references: [users.id]
  }),
  applications: many(applications),
  reviews: many(reviews),
  favorites: many(favorites)
}));
var companiesRelations = relations(companies, ({ one, many }) => ({
  user: one(users, {
    fields: [companies.userId],
    references: [users.id]
  }),
  offers: many(offers),
  reviews: many(reviews)
}));
var offersRelations = relations(offers, ({ one, many }) => ({
  company: one(companies, {
    fields: [offers.companyId],
    references: [companies.id]
  }),
  exampleVideos: many(exampleVideos),
  applications: many(applications),
  favorites: many(favorites)
}));
var applicationsRelations = relations(applications, ({ one, many }) => ({
  creator: one(creators, {
    fields: [applications.creatorId],
    references: [creators.id]
  }),
  offer: one(offers, {
    fields: [applications.offerId],
    references: [offers.id]
  }),
  trackingLink: one(trackingLinks),
  messages: many(messages)
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true
});
var insertCreatorSchema = createInsertSchema(creators).omit({
  id: true,
  totalEarnings: true
});
var insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  verificationStatus: true,
  approvalDate: true
});
var insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
  status: true,
  viewCount: true,
  applicationCount: true,
  activeCreatorCount: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true
});
var insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  status: true,
  appliedAt: true,
  approvedAt: true,
  uniqueTrackingCode: true,
  trackingLink: true
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  status: true,
  editedByAdmin: true,
  adminNotes: true,
  createdAt: true,
  updatedAt: true
});
var insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  savedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, desc } from "drizzle-orm";
var DatabaseStorage = class {
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Creator methods
  async getCreator(id) {
    const [creator] = await db.select().from(creators).where(eq(creators.id, id));
    return creator || void 0;
  }
  async getCreatorByUserId(userId) {
    const [creator] = await db.select().from(creators).where(eq(creators.userId, userId));
    return creator || void 0;
  }
  async createCreator(insertCreator) {
    const [creator] = await db.insert(creators).values(insertCreator).returning();
    return creator;
  }
  // Company methods
  async getCompany(id) {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || void 0;
  }
  async getCompanyByUserId(userId) {
    const [company] = await db.select().from(companies).where(eq(companies.userId, userId));
    return company || void 0;
  }
  async createCompany(insertCompany) {
    const [company] = await db.insert(companies).values(insertCompany).returning();
    return company;
  }
  // Offer methods
  async getOffers(filters) {
    const offersData = await db.select().from(offers).where(eq(offers.status, "live")).orderBy(desc(offers.createdAt)).limit(filters?.limit || 50);
    return offersData;
  }
  async getOffer(id) {
    const [offer] = await db.select().from(offers).where(eq(offers.id, id));
    return offer || void 0;
  }
  async createOffer(insertOffer) {
    const [offer] = await db.insert(offers).values(insertOffer).returning();
    return offer;
  }
  async updateOffer(id, updates) {
    const [offer] = await db.update(offers).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(offers.id, id)).returning();
    return offer || void 0;
  }
  // Application methods
  async getApplications(filters) {
    const applicationsData = await db.select().from(applications).where(filters?.creatorId ? eq(applications.creatorId, filters.creatorId) : void 0).orderBy(desc(applications.appliedAt));
    return applicationsData;
  }
  async getApplication(id) {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || void 0;
  }
  async createApplication(insertApplication) {
    const [application] = await db.insert(applications).values(insertApplication).returning();
    return application;
  }
  async updateApplication(id, updates) {
    const [application] = await db.update(applications).set(updates).where(eq(applications.id, id)).returning();
    return application || void 0;
  }
  // Favorites methods
  async getFavorites(creatorId) {
    const favoritesData = await db.select().from(favorites).where(eq(favorites.creatorId, creatorId)).orderBy(desc(favorites.savedAt));
    return favoritesData;
  }
  async createFavorite(insertFavorite) {
    const [favorite] = await db.insert(favorites).values(insertFavorite).returning();
    return favorite;
  }
  async deleteFavorite(creatorId, offerId) {
    await db.delete(favorites).where(and(eq(favorites.creatorId, creatorId), eq(favorites.offerId, offerId)));
  }
  // Reviews methods
  async getReviews(companyId) {
    const reviewsData = await db.select().from(reviews).where(and(eq(reviews.companyId, companyId), eq(reviews.status, "published"))).orderBy(desc(reviews.createdAt));
    return reviewsData;
  }
  async createReview(insertReview) {
    const reviewData = {
      ...insertReview,
      status: "published",
      editedByAdmin: false,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
import bcrypt from "bcrypt";
var SALT_ROUNDS = 10;
function generateShortCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
async function scheduleAutoApproval(applicationId) {
  setTimeout(async () => {
    try {
      const shortCode = generateShortCode();
      const trackingLink = `https://track.affiliatexchange.com/go/${shortCode}`;
      await storage.updateApplication(applicationId, {
        status: "approved",
        approvedAt: /* @__PURE__ */ new Date(),
        uniqueTrackingCode: shortCode,
        trackingLink
      });
      console.log(`Application ${applicationId} auto-approved with tracking code ${shortCode}`);
    } catch (error) {
      console.error(`Error auto-approving application ${applicationId}:`, error);
    }
  }, 7 * 60 * 1e3);
}
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const registerSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        userType: z.enum(["creator", "company", "admin"]).default("creator"),
        displayName: z.string().min(1)
      });
      const validatedData = registerSchema.parse(req.body);
      const { email, password, userType, displayName } = validatedData;
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        userType,
        status: "active"
      });
      if (userType === "creator") {
        await storage.createCreator({
          userId: user.id,
          displayName
        });
      } else if (userType === "company") {
        await storage.createCompany({
          userId: user.id,
          legalName: displayName,
          website: ""
          // Will be updated in onboarding
        });
      }
      res.json({ user: { id: user.id, email: user.email, userType: user.userType } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string()
      });
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      res.json({ user: { id: user.id, email: user.email, userType: user.userType } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/offers", async (req, res) => {
    try {
      const { niche, sort, limit } = req.query;
      const offers2 = await storage.getOffers({
        niche,
        sort,
        limit: limit ? parseInt(limit) : 50
      });
      res.json(offers2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/offers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const offer = await storage.getOffer(id);
      if (!offer) {
        return res.status(404).json({ error: "Offer not found" });
      }
      const company = await storage.getCompany(offer.companyId);
      res.json({ ...offer, company });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/offers", async (req, res) => {
    try {
      const offerData = insertOfferSchema.parse(req.body);
      const slug = offerData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const offer = await storage.createOffer({
        ...offerData,
        slug: `${slug}-${Date.now()}`
      });
      res.json(offer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(applicationData);
      scheduleAutoApproval(application.id);
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/creators/me/applications", async (req, res) => {
    try {
      const creatorId = req.query.creatorId;
      if (!creatorId) {
        return res.status(400).json({ error: "Creator ID required" });
      }
      const applications2 = await storage.getApplications({ creatorId });
      res.json(applications2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/creators/me/analytics", async (req, res) => {
    try {
      res.json({
        totalEarnings: 2450,
        totalClicks: 15234,
        totalConversions: 89,
        conversionRate: 0.58
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/creators/me/favorites", async (req, res) => {
    try {
      const creatorId = req.query.creatorId;
      if (!creatorId) {
        return res.status(400).json({ error: "Creator ID required" });
      }
      const favorites2 = await storage.getFavorites(creatorId);
      res.json(favorites2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/favorites", async (req, res) => {
    try {
      const favoriteData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.createFavorite(favoriteData);
      res.json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/favorites/:offerId", async (req, res) => {
    try {
      const { offerId } = req.params;
      const creatorId = req.query.creatorId;
      if (!creatorId) {
        return res.status(400).json({ error: "Creator ID required" });
      }
      await storage.deleteFavorite(creatorId, offerId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/reviews/company/:companyId", async (req, res) => {
    try {
      const { companyId } = req.params;
      const reviews2 = await storage.getReviews(companyId);
      res.json(reviews2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/companies/me/offers", async (req, res) => {
    try {
      const offers2 = await storage.getOffers({});
      res.json(offers2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/companies/me/analytics", async (req, res) => {
    try {
      res.json({
        totalCreators: 45,
        activeCreators: 32,
        totalClicks: 45678,
        pendingApplications: 8
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/track/:shortCode", async (req, res) => {
    try {
      const { shortCode } = req.params;
      res.redirect("https://example.com");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  if (process.platform === "win32") {
    server.listen(port, () => {
      log(`serving on port ${port}`);
    });
  } else {
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`serving on port ${port}`);
    });
  }
})();
