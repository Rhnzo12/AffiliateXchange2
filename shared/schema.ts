import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userTypeEnum = pgEnum("user_type", ["creator", "company", "admin"]);
export const userStatusEnum = pgEnum("user_status", ["pending", "active", "suspended", "banned"]);
export const verificationStatusEnum = pgEnum("verification_status", ["pending", "verified", "rejected"]);
export const offerStatusEnum = pgEnum("offer_status", ["draft", "under_review", "live", "paused", "archived"]);
export const commissionTypeEnum = pgEnum("commission_type", ["per_sale", "per_lead", "per_click", "retainer", "hybrid"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "approved", "rejected", "active", "completed"]);
export const reviewStatusEnum = pgEnum("review_status", ["published", "hidden", "flagged"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "scheduled", "completed", "failed", "disputed"]);
export const platformEnum = pgEnum("platform", ["youtube", "tiktok", "instagram", "facebook", "snapchat", "twitter", "linkedin", "other"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  userType: userTypeEnum("user_type").notNull(),
  status: userStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
});

// Creators table
export const creators = pgTable("creators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  socialLinks: jsonb("social_links").$type<Record<string, string>>(),
  followerCounts: jsonb("follower_counts").$type<Record<string, number>>(),
  preferredNiches: text("preferred_niches").array(),
  totalEarnings: integer("total_earnings").notNull().default(0),
  paymentInfo: jsonb("payment_info"),
}, (table) => ({
  userIdIdx: index("creators_user_id_idx").on(table.userId),
}));

// Companies table
export const companies = pgTable("companies", {
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
  paymentInfo: jsonb("payment_info"),
}, (table) => ({
  userIdIdx: index("companies_user_id_idx").on(table.userId),
}));

// Offers table
export const offers = pgTable("offers", {
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
  approvedAt: timestamp("approved_at"),
}, (table) => ({
  companyIdIdx: index("offers_company_id_idx").on(table.companyId),
  statusIdx: index("offers_status_idx").on(table.status),
  slugIdx: index("offers_slug_idx").on(table.slug),
}));

// Example Videos table
export const exampleVideos = pgTable("example_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  offerId: varchar("offer_id").notNull().references(() => offers.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  creatorCredit: text("creator_credit"),
  description: text("description"),
  platform: platformEnum("platform").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  uploadedByUserId: varchar("uploaded_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  offerIdIdx: index("example_videos_offer_id_idx").on(table.offerId),
}));

// Applications table
export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull().references(() => creators.id, { onDelete: "cascade" }),
  offerId: varchar("offer_id").notNull().references(() => offers.id, { onDelete: "cascade" }),
  message: text("message"),
  preferredCommissionType: commissionTypeEnum("preferred_commission_type"),
  status: applicationStatusEnum("status").notNull().default("pending"),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
  approvedAt: timestamp("approved_at"),
  uniqueTrackingCode: text("unique_tracking_code").unique(),
  trackingLink: text("tracking_link"),
}, (table) => ({
  creatorIdIdx: index("applications_creator_id_idx").on(table.creatorId),
  offerIdIdx: index("applications_offer_id_idx").on(table.offerId),
  trackingCodeIdx: index("applications_tracking_code_idx").on(table.uniqueTrackingCode),
}));

// Tracking Links table
export const trackingLinks = pgTable("tracking_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  shortCode: text("short_code").notNull().unique(),
  fullUrl: text("full_url").notNull(),
  clickCount: integer("click_count").notNull().default(0),
  uniqueClickCount: integer("unique_click_count").notNull().default(0),
  conversionCount: integer("conversion_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  applicationIdIdx: index("tracking_links_application_id_idx").on(table.applicationId),
  shortCodeIdx: index("tracking_links_short_code_idx").on(table.shortCode),
}));

// Click Events table
export const clickEvents = pgTable("click_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingLinkId: varchar("tracking_link_id").notNull().references(() => trackingLinks.id, { onDelete: "cascade" }),
  ipAddressHash: text("ip_address_hash"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  country: text("country"),
  deviceType: text("device_type"),
  clickedAt: timestamp("clicked_at").notNull().defaultNow(),
  converted: boolean("converted").notNull().default(false),
}, (table) => ({
  trackingLinkIdIdx: index("click_events_tracking_link_id_idx").on(table.trackingLinkId),
}));

// Messages table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  applicationId: varchar("application_id").references(() => applications.id),
  messageText: text("message_text").notNull(),
  attachments: text("attachments").array(),
  read: boolean("read").notNull().default(false),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
}, (table) => ({
  senderIdIdx: index("messages_sender_id_idx").on(table.senderId),
  receiverIdIdx: index("messages_receiver_id_idx").on(table.receiverId),
}));

// Reviews table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull().references(() => creators.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  applicationId: varchar("application_id").references(() => applications.id),
  rating: integer("rating").notNull(),
  reviewText: text("review_text"),
  categoryRatings: jsonb("category_ratings").$type<{
    paymentSpeed?: number;
    communication?: number;
    offerQuality?: number;
    support?: number;
  }>(),
  status: reviewStatusEnum("status").notNull().default("published"),
  editedByAdmin: boolean("edited_by_admin").notNull().default(false),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  companyIdIdx: index("reviews_company_id_idx").on(table.companyId),
}));

// Transactions table
export const transactions = pgTable("transactions", {
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
  receiptUrl: text("receipt_url"),
}, (table) => ({
  creatorIdIdx: index("transactions_creator_id_idx").on(table.creatorId),
  companyIdIdx: index("transactions_company_id_idx").on(table.companyId),
}));

// Favorites table
export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull().references(() => creators.id, { onDelete: "cascade" }),
  offerId: varchar("offer_id").notNull().references(() => offers.id, { onDelete: "cascade" }),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
}, (table) => ({
  creatorOfferIdx: index("favorites_creator_offer_idx").on(table.creatorId, table.offerId),
}));

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  creator: one(creators, {
    fields: [users.id],
    references: [creators.userId],
  }),
  company: one(companies, {
    fields: [users.id],
    references: [companies.userId],
  }),
}));

export const creatorsRelations = relations(creators, ({ one, many }) => ({
  user: one(users, {
    fields: [creators.userId],
    references: [users.id],
  }),
  applications: many(applications),
  reviews: many(reviews),
  favorites: many(favorites),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  user: one(users, {
    fields: [companies.userId],
    references: [users.id],
  }),
  offers: many(offers),
  reviews: many(reviews),
}));

export const offersRelations = relations(offers, ({ one, many }) => ({
  company: one(companies, {
    fields: [offers.companyId],
    references: [companies.id],
  }),
  exampleVideos: many(exampleVideos),
  applications: many(applications),
  favorites: many(favorites),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  creator: one(creators, {
    fields: [applications.creatorId],
    references: [creators.id],
  }),
  offer: one(offers, {
    fields: [applications.offerId],
    references: [offers.id],
  }),
  trackingLink: one(trackingLinks),
  messages: many(messages),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export const insertCreatorSchema = createInsertSchema(creators).omit({
  id: true,
  totalEarnings: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  verificationStatus: true,
  approvalDate: true,
});

export const insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
  status: true,
  viewCount: true,
  applicationCount: true,
  activeCreatorCount: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  status: true,
  appliedAt: true,
  approvedAt: true,
  uniqueTrackingCode: true,
  trackingLink: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  status: true,
  editedByAdmin: true,
  adminNotes: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  savedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Creator = typeof creators.$inferSelect;
export type InsertCreator = z.infer<typeof insertCreatorSchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type ExampleVideo = typeof exampleVideos.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type TrackingLink = typeof trackingLinks.$inferSelect;
export type ClickEvent = typeof clickEvents.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
