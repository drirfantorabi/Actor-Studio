import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// New schema for scripts and dialogues
export const scripts = pgTable("scripts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  scriptId: integer("script_id").references(() => scripts.id).notNull(),
  name: text("name").notNull(),
  description: text("description")
});

export const dialogues = pgTable("dialogues", {
  id: serial("id").primaryKey(),
  scriptId: integer("script_id").references(() => scripts.id).notNull(),
  characterId: integer("character_id").references(() => characters.id).notNull(),
  lineNumber: integer("line_number").notNull(),
  content: text("content").notNull(),
  audioPath: text("audio_path")
});

// Relations
export const scriptsRelations = relations(scripts, ({ many }) => ({
  characters: many(characters),
  dialogues: many(dialogues)
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
  script: one(scripts, { fields: [characters.scriptId], references: [scripts.id] }),
  dialogues: many(dialogues)
}));

export const dialoguesRelations = relations(dialogues, ({ one }) => ({
  script: one(scripts, { fields: [dialogues.scriptId], references: [scripts.id] }),
  character: one(characters, { fields: [dialogues.characterId], references: [characters.id] })
}));

// Schemas for validation
export const scriptsInsertSchema = createInsertSchema(scripts, {
  title: (schema) => schema.min(3, "Title must be at least 3 characters"),
  description: (schema) => schema.optional()
});

export const charactersInsertSchema = createInsertSchema(characters, {
  name: (schema) => schema.min(2, "Character name must be at least 2 characters"),
  description: (schema) => schema.optional()
});

export const dialoguesInsertSchema = createInsertSchema(dialogues, {
  content: (schema) => schema.min(1, "Dialogue content cannot be empty"),
  audioPath: (schema) => schema.optional()
});

export type ScriptInsert = z.infer<typeof scriptsInsertSchema>;
export type Script = typeof scripts.$inferSelect;

export type CharacterInsert = z.infer<typeof charactersInsertSchema>;
export type Character = typeof characters.$inferSelect;

export type DialogueInsert = z.infer<typeof dialoguesInsertSchema>;
export type Dialogue = typeof dialogues.$inferSelect;
