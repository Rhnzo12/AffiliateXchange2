// Using PostgreSQL database blueprint from javascript_database integration
import {
  users,
  creators,
  companies,
  offers,
  exampleVideos,
  applications,
  trackingLinks,
  favorites,
  reviews,
  type User,
  type InsertUser,
  type Creator,
  type InsertCreator,
  type Company,
  type InsertCompany,
  type Offer,
  type InsertOffer,
  type Application,
  type InsertApplication,
  type Favorite,
  type InsertFavorite,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Creator methods
  getCreator(id: string): Promise<Creator | undefined>;
  getCreatorByUserId(userId: string): Promise<Creator | undefined>;
  createCreator(creator: InsertCreator): Promise<Creator>;

  // Company methods
  getCompany(id: string): Promise<Company | undefined>;
  getCompanyByUserId(userId: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;

  // Offer methods
  getOffers(filters?: any): Promise<Offer[]>;
  getOffer(id: string): Promise<Offer | undefined>;
  createOffer(offer: InsertOffer): Promise<Offer>;
  updateOffer(id: string, updates: Partial<Offer>): Promise<Offer | undefined>;

  // Application methods
  getApplications(filters?: any): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, updates: Partial<Application>): Promise<Application | undefined>;

  // Favorites methods
  getFavorites(creatorId: string): Promise<Favorite[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(creatorId: string, offerId: string): Promise<void>;

  // Reviews methods
  getReviews(companyId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Creator methods
  async getCreator(id: string): Promise<Creator | undefined> {
    const [creator] = await db.select().from(creators).where(eq(creators.id, id));
    return creator || undefined;
  }

  async getCreatorByUserId(userId: string): Promise<Creator | undefined> {
    const [creator] = await db.select().from(creators).where(eq(creators.userId, userId));
    return creator || undefined;
  }

  async createCreator(insertCreator: InsertCreator): Promise<Creator> {
    const [creator] = await db.insert(creators).values(insertCreator).returning();
    return creator;
  }

  // Company methods
  async getCompany(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async getCompanyByUserId(userId: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.userId, userId));
    return company || undefined;
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companies).values(insertCompany).returning();
    return company;
  }

  // Offer methods
  async getOffers(filters?: any): Promise<Offer[]> {
    const offersData = await db
      .select()
      .from(offers)
      .where(eq(offers.status, "live"))
      .orderBy(desc(offers.createdAt))
      .limit(filters?.limit || 50);
    return offersData;
  }

  async getOffer(id: string): Promise<Offer | undefined> {
    const [offer] = await db.select().from(offers).where(eq(offers.id, id));
    return offer || undefined;
  }

  async createOffer(insertOffer: InsertOffer): Promise<Offer> {
    const [offer] = await db.insert(offers).values(insertOffer).returning();
    return offer;
  }

  async updateOffer(id: string, updates: Partial<Offer>): Promise<Offer | undefined> {
    const [offer] = await db
      .update(offers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(offers.id, id))
      .returning();
    return offer || undefined;
  }

  // Application methods
  async getApplications(filters?: any): Promise<Application[]> {
    const applicationsData = await db
      .select()
      .from(applications)
      .where(filters?.creatorId ? eq(applications.creatorId, filters.creatorId) : undefined)
      .orderBy(desc(applications.appliedAt));
    return applicationsData;
  }

  async getApplication(id: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db.insert(applications).values(insertApplication).returning();
    return application;
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application | undefined> {
    const [application] = await db
      .update(applications)
      .set(updates)
      .where(eq(applications.id, id))
      .returning();
    return application || undefined;
  }

  // Favorites methods
  async getFavorites(creatorId: string): Promise<Favorite[]> {
    const favoritesData = await db
      .select()
      .from(favorites)
      .where(eq(favorites.creatorId, creatorId))
      .orderBy(desc(favorites.savedAt));
    return favoritesData;
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db.insert(favorites).values(insertFavorite).returning();
    return favorite;
  }

  async deleteFavorite(creatorId: string, offerId: string): Promise<void> {
    await db
      .delete(favorites)
      .where(and(eq(favorites.creatorId, creatorId), eq(favorites.offerId, offerId)));
  }

  // Reviews methods
  async getReviews(companyId: string): Promise<Review[]> {
    const reviewsData = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.companyId, companyId), eq(reviews.status, "published")))
      .orderBy(desc(reviews.createdAt));
    return reviewsData;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const reviewData = {
      ...insertReview,
      status: "published" as const,
      editedByAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }
}

export const storage = new DatabaseStorage();
