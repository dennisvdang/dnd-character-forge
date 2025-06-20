import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Character abilities
export const abilityScoresSchema = z.object({
  strength: z.number().min(1).max(30),
  dexterity: z.number().min(1).max(30),
  constitution: z.number().min(1).max(30),
  intelligence: z.number().min(1).max(30),
  wisdom: z.number().min(1).max(30),
  charisma: z.number().min(1).max(30),
});

// Character skills
export const skillsSchema = z.record(z.object({
  proficient: z.boolean(),
  expertise: z.boolean().default(false),
}));

// Combat stats
export const combatStatsSchema = z.object({
  ac: z.number(),
  initiative: z.number(),
  currentHp: z.number(),
  maxHp: z.number(),
  hitDice: z.string(),
  speed: z.number(),
});

// Currency
export const currencySchema = z.object({
  platinum: z.number().min(0),
  gold: z.number().min(0),
  silver: z.number().min(0),
  copper: z.number().min(0),
});

// Spell slots
export const spellSlotsSchema = z.record(z.object({
  total: z.number(),
  used: z.number(),
}));

// Characters table
export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  race: text("race").notNull(),
  class: text("class").notNull(),
  level: integer("level").notNull().default(1),
  background: text("background").notNull(),
  abilities: jsonb("abilities").$type<z.infer<typeof abilityScoresSchema>>().notNull(),
  skills: jsonb("skills").$type<z.infer<typeof skillsSchema>>().notNull(),
  combat: jsonb("combat").$type<z.infer<typeof combatStatsSchema>>().notNull(),
  currency: jsonb("currency").$type<z.infer<typeof currencySchema>>().notNull(),
  spellSlots: jsonb("spell_slots").$type<z.infer<typeof spellSlotsSchema>>(),
  notes: text("notes"),
});

// Attacks/Weapons
export const attacks = pgTable("attacks", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull(),
  name: text("name").notNull(),
  attackBonus: integer("attack_bonus").notNull(),
  damage: text("damage").notNull(),
  damageType: text("damage_type").notNull(),
  range: text("range").notNull(),
  notes: text("notes"),
});

// Items/Equipment
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull().default(1),
  weight: integer("weight").notNull().default(0), // in pounds * 10 for precision
  value: integer("value").notNull().default(0), // in copper pieces
  equipped: boolean("equipped").default(false),
});

// Known Spells
export const knownSpells = pgTable("known_spells", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull(),
  spellId: text("spell_id").notNull(),
  level: integer("level").notNull(),
  prepared: boolean("prepared").default(false),
});

// Dice Roll History
export const rollHistory = pgTable("roll_history", {
  id: serial("id").primaryKey(),
  formula: text("formula").notNull(),
  result: integer("result").notNull(),
  breakdown: text("breakdown").notNull(),
  timestamp: text("timestamp").notNull(),
});

// Insert schemas
export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
});

export const insertAttackSchema = createInsertSchema(attacks).omit({
  id: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
});

export const insertKnownSpellSchema = createInsertSchema(knownSpells).omit({
  id: true,
});

export const insertRollHistorySchema = createInsertSchema(rollHistory).omit({
  id: true,
});

// Types
export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Attack = typeof attacks.$inferSelect;
export type InsertAttack = z.infer<typeof insertAttackSchema>;
export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type KnownSpell = typeof knownSpells.$inferSelect;
export type InsertKnownSpell = z.infer<typeof insertKnownSpellSchema>;
export type RollHistory = typeof rollHistory.$inferSelect;
export type InsertRollHistory = z.infer<typeof insertRollHistorySchema>;
export type AbilityScores = z.infer<typeof abilityScoresSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type CombatStats = z.infer<typeof combatStatsSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type SpellSlots = z.infer<typeof spellSlotsSchema>;
