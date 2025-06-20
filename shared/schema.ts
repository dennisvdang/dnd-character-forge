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

// Character schema
export const characterSchema = z.object({
  id: z.number(),
  name: z.string(),
  race: z.string(),
  class: z.string(),
  level: z.number().default(1),
  background: z.string(),
  abilities: abilityScoresSchema,
  skills: skillsSchema,
  combat: combatStatsSchema,
  currency: currencySchema,
  spellSlots: spellSlotsSchema.optional(),
  notes: z.string().optional(),
});

// Attack schema
export const attackSchema = z.object({
  id: z.number(),
  characterId: z.number(),
  name: z.string(),
  attackBonus: z.number(),
  damage: z.string(),
  damageType: z.string(),
  range: z.string(),
  notes: z.string().optional(),
});

// Item schema
export const itemSchema = z.object({
  id: z.number(),
  characterId: z.number(),
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  quantity: z.number().default(1),
  weight: z.number().default(0), // in pounds * 10 for precision
  value: z.number().default(0), // in copper pieces
  equipped: z.boolean().default(false),
});

// Known spell schema
export const knownSpellSchema = z.object({
  id: z.number(),
  characterId: z.number(),
  spellId: z.string(),
  level: z.number(),
  prepared: z.boolean().default(false),
});

// Roll history schema
export const rollHistorySchema = z.object({
  id: z.number(),
  formula: z.string(),
  result: z.number(),
  breakdown: z.string(),
  timestamp: z.string(),
});

// Insert schemas (without id)
export const insertCharacterSchema = characterSchema.omit({ id: true });
export const insertAttackSchema = attackSchema.omit({ id: true });
export const insertItemSchema = itemSchema.omit({ id: true });
export const insertKnownSpellSchema = knownSpellSchema.omit({ id: true });
export const insertRollHistorySchema = rollHistorySchema.omit({ id: true });

// Types
export type Character = z.infer<typeof characterSchema>;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Attack = z.infer<typeof attackSchema>;
export type InsertAttack = z.infer<typeof insertAttackSchema>;
export type Item = z.infer<typeof itemSchema>;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type KnownSpell = z.infer<typeof knownSpellSchema>;
export type InsertKnownSpell = z.infer<typeof insertKnownSpellSchema>;
export type RollHistory = z.infer<typeof rollHistorySchema>;
export type InsertRollHistory = z.infer<typeof insertRollHistorySchema>;
export type AbilityScores = z.infer<typeof abilityScoresSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type CombatStats = z.infer<typeof combatStatsSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type SpellSlots = z.infer<typeof spellSlotsSchema>;
