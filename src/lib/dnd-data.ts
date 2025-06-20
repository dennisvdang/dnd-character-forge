// D&D 5e SRD Data for the encyclopedia and spells

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
}

export interface EncyclopediaEntry {
  id: string;
  name: string;
  category: string;
  level?: string;
  description: string;
  details: string[];
}

export const spellsDatabase: Spell[] = [
  {
    id: "magic-missile",
    name: "Magic Missile",
    level: 1,
    school: "Evocation",
    castingTime: "1 action",
    range: "120 feet",
    components: "V, S",
    duration: "Instantaneous",
    description: "A dart of magical force springs from your finger to strike its target. The dart automatically hits and deals 1d4 + 1 force damage. At higher levels, you create one additional dart for each spell slot level above 1st."
  },
  {
    id: "shield",
    name: "Shield",
    level: 1,
    school: "Abjuration",
    castingTime: "1 reaction",
    range: "Self",
    components: "V, S",
    duration: "1 round",
    description: "An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile."
  },
  {
    id: "fireball",
    name: "Fireball",
    level: 3,
    school: "Evocation",
    castingTime: "1 action",
    range: "150 feet",
    components: "V, S, M (a tiny ball of bat guano and sulfur)",
    duration: "Instantaneous",
    description: "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one."
  },
  {
    id: "cure-wounds",
    name: "Cure Wounds",
    level: 1,
    school: "Evocation",
    castingTime: "1 action",
    range: "Touch",
    components: "V, S",
    duration: "Instantaneous",
    description: "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs."
  },
  {
    id: "eldritch-blast",
    name: "Eldritch Blast",
    level: 0,
    school: "Evocation",
    castingTime: "1 action",
    range: "120 feet",
    components: "V, S",
    duration: "Instantaneous",
    description: "A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage."
  },
  {
    id: "healing-word",
    name: "Healing Word",
    level: 1,
    school: "Evocation",
    castingTime: "1 bonus action",
    range: "60 feet",
    components: "V",
    duration: "Instantaneous",
    description: "A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs."
  }
];

export const encyclopediaData: EncyclopediaEntry[] = [
  {
    id: "fireball-spell",
    name: "Fireball",
    category: "spells",
    level: "3rd Level",
    description: "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw.",
    details: ["School: Evocation", "Casting Time: 1 action", "Range: 150 feet", "Components: V, S, M"]
  },
  {
    id: "ancient-red-dragon",
    name: "Ancient Red Dragon",
    category: "monsters",
    level: "CR 24",
    description: "Gargantuan dragon, chaotic evil. The most powerful of the chromatic dragons, ancient red dragons have no compunction about killing lesser creatures.",
    details: ["AC: 22", "HP: 546", "Speed: 40 ft., climb 40 ft., fly 80 ft."]
  },
  {
    id: "grappling-rules",
    name: "Grappling Rules",
    category: "rules",
    description: "When you want to grab a creature or wrestle with it, you can use the Attack action to make a special melee attack, a grapple. If you're able to make multiple attacks with the Attack action, this attack replaces one of them.",
    details: ["Source: Player's Handbook", "Page: 195", "Chapter: Combat"]
  },
  {
    id: "longsword",
    name: "Longsword",
    category: "items",
    description: "A versatile martial weapon that can be wielded with one or two hands. Popular among fighters and paladins for its balance of reach and damage.",
    details: ["Damage: 1d8 slashing (1d10 versatile)", "Properties: Versatile", "Weight: 3 lbs", "Cost: 15 gp"]
  },
  {
    id: "fighter-class",
    name: "Fighter",
    category: "classes",
    description: "A master of martial combat, skilled with a variety of weapons and armor. Fighters share an unparalleled mastery with weapons and armor, and a thorough knowledge of the skills of combat.",
    details: ["Hit Die: d10", "Primary Ability: Strength or Dexterity", "Saving Throw Proficiencies: Strength, Constitution"]
  },
  {
    id: "human-race",
    name: "Human",
    category: "races",
    description: "In the reckonings of most worlds, humans are the youngest of the common races, late to arrive on the world scene and short-lived in comparison to dwarves, elves, and dragons.",
    details: ["Ability Score Increase: +1 to all abilities", "Size: Medium", "Speed: 30 feet", "Languages: Common and one extra"]
  },
  {
    id: "stealth-rules",
    name: "Stealth",
    category: "rules",
    description: "Make a Dexterity (Stealth) check when you attempt to conceal yourself from enemies, slink past guards, slip away without being noticed, or sneak up on someone without being seen or heard.",
    details: ["Ability: Dexterity", "Type: Skill", "Used for: Hiding, sneaking, ambushing"]
  },
  {
    id: "goblin",
    name: "Goblin",
    category: "monsters",
    level: "CR 1/4",
    description: "Small humanoid (goblinoid), neutral evil. Goblins are small, black-hearted, selfish humanoids that lair in caves, abandoned mines, despoiled dungeons, and other dismal settings.",
    details: ["AC: 15", "HP: 7", "Speed: 30 ft.", "Skills: Stealth +6"]
  },
  {
    id: "potion-of-healing",
    name: "Potion of Healing",
    category: "items",
    description: "A character who drinks the magical red fluid in this vial regains 2d4 + 2 hit points. Drinking or administering a potion takes an action.",
    details: ["Rarity: Common", "Weight: 0.5 lbs", "Healing: 2d4 + 2 HP"]
  },
  {
    id: "wizard-class",
    name: "Wizard",
    category: "classes",
    description: "Wizards are supreme magic-users, defined and united as a class by the spells they cast. Drawing on the subtle weave of magic that permeates the cosmos, wizards cast spells of explosive fire, arcing lightning, subtle deception, and brute-force mind control.",
    details: ["Hit Die: d6", "Primary Ability: Intelligence", "Saving Throw Proficiencies: Intelligence, Wisdom"]
  },
  {
    id: "elf-race",
    name: "Elf",
    category: "races",
    description: "Elves are a magical people of otherworldly grace, living in the world but not entirely part of it. They live in places of ethereal beauty, in the midst of ancient forests or in silvery spires glittering with faerie light.",
    details: ["Ability Score Increase: +2 Dexterity", "Size: Medium", "Speed: 30 feet", "Darkvision: 60 feet"]
  },
  {
    id: "concentration",
    name: "Concentration",
    category: "rules",
    description: "Some spells require you to maintain concentration in order to keep their magic active. If you lose concentration, such a spell ends. You can end concentration at any time (no action required).",
    details: ["Duration: Varies by spell", "Breaking: Damage, incapacitation, or death", "Only one spell at a time"]
  }
];
