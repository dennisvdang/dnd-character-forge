// Dice rolling utilities for D&D 5e

export interface DiceRoll {
  count: number;
  sides: number;
  modifier: number;
}

export function rollDice(count: number, sides: number): number {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

export function parseDiceFormula(formula: string): DiceRoll {
  // Remove spaces and convert to lowercase
  const cleaned = formula.replace(/\s/g, '').toLowerCase();
  
  // Match patterns like "2d6+3", "1d20-1", "d8", "3d4"
  const match = cleaned.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  
  if (!match) {
    throw new Error('Invalid dice formula');
  }
  
  const count = match[1] ? parseInt(match[1]) : 1;
  const sides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;
  
  if (count < 1 || sides < 2) {
    throw new Error('Invalid dice parameters');
  }
  
  return { count, sides, modifier };
}

export function rollDiceFormula(formula: string): { roll: number; breakdown: string } {
  const parsed = parseDiceFormula(formula);
  const diceRoll = rollDice(parsed.count, parsed.sides);
  const total = diceRoll + parsed.modifier;
  
  let breakdown = `Rolled: ${diceRoll}`;
  if (parsed.modifier !== 0) {
    breakdown += ` ${parsed.modifier >= 0 ? '+' : ''} ${parsed.modifier} = ${total}`;
  }
  
  return {
    roll: total,
    breakdown
  };
}

export function rollWithAdvantage(count: number, sides: number): { roll: number; rolls: number[] } {
  const roll1 = rollDice(count, sides);
  const roll2 = rollDice(count, sides);
  return {
    roll: Math.max(roll1, roll2),
    rolls: [roll1, roll2]
  };
}

export function rollWithDisadvantage(count: number, sides: number): { roll: number; rolls: number[] } {
  const roll1 = rollDice(count, sides);
  const roll2 = rollDice(count, sides);
  return {
    roll: Math.min(roll1, roll2),
    rolls: [roll1, roll2]
  };
}

export function calculateAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function rollAbilityCheck(abilityScore: number, proficiencyBonus: number = 0, isProficient: boolean = false): number {
  const roll = rollDice(1, 20);
  const modifier = calculateAbilityModifier(abilityScore);
  const proficiency = isProficient ? proficiencyBonus : 0;
  return roll + modifier + proficiency;
}

export function rollSavingThrow(abilityScore: number, proficiencyBonus: number = 0, isProficient: boolean = false): number {
  return rollAbilityCheck(abilityScore, proficiencyBonus, isProficient);
}

export function rollAttack(attackBonus: number): { roll: number; total: number; isCritical: boolean; isFumble: boolean } {
  const roll = rollDice(1, 20);
  const total = roll + attackBonus;
  const isCritical = roll === 20;
  const isFumble = roll === 1;
  
  return { roll, total, isCritical, isFumble };
}

export function rollDamage(formula: string, isCritical: boolean = false): { damage: number; breakdown: string } {
  const parsed = parseDiceFormula(formula);
  let diceRoll = rollDice(parsed.count, parsed.sides);
  
  // Double dice on critical hit
  if (isCritical) {
    const criticalDice = rollDice(parsed.count, parsed.sides);
    diceRoll += criticalDice;
  }
  
  const total = diceRoll + parsed.modifier;
  
  let breakdown = `${isCritical ? 'Critical! ' : ''}Rolled: ${diceRoll}`;
  if (parsed.modifier !== 0) {
    breakdown += ` ${parsed.modifier >= 0 ? '+' : ''} ${parsed.modifier} = ${total}`;
  }
  
  return {
    damage: total,
    breakdown
  };
}
