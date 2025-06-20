import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, X } from "lucide-react";
import type { Character } from "@shared/schema";

interface CharacterSheetProps {
  character: Character;
}

export default function CharacterSheet({ character }: CharacterSheetProps) {
  const [editedCharacter, setEditedCharacter] = useState(character);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: character?.name || "",
    race: character?.race || "",
    class: character?.class || "",
    level: character?.level || 1,
    background: character?.background || ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Ensure character has all required properties with defaults
  const safeCharacter = {
    ...editedCharacter,
    name: editedCharacter?.name || "Unknown Character",
    race: editedCharacter?.race || "Unknown",
    class: editedCharacter?.class || "Unknown", 
    level: editedCharacter?.level || 1,
    background: editedCharacter?.background || "Unknown",
    combat: editedCharacter?.combat || {
      ac: 10,
      initiative: 0,
      currentHp: 1,
      maxHp: 1,
      hitDice: "1d6",
      speed: 30,
    },
    abilities: editedCharacter?.abilities || {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skills: editedCharacter?.skills || {}
  };

  const updateCharacterMutation = useMutation({
    mutationFn: async (updates: Partial<Character>) => {
      const response = await apiRequest("PATCH", `/api/characters/${character.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/characters", character.id] });
      toast({ title: "Character updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update character", variant: "destructive" });
    },
  });

  const saveCharacterEdit = () => {
    updateCharacterMutation.mutate({
      name: editForm.name,
      race: editForm.race,
      class: editForm.class,
      level: editForm.level,
      background: editForm.background
    });
    setEditedCharacter({ ...editedCharacter, ...editForm });
    setIsEditDialogOpen(false);
  };

  const calculateModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const formatModifier = (modifier: number) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const handleAbilityChange = (ability: keyof typeof character.abilities, value: number) => {
    const newAbilities = { ...safeCharacter.abilities, [ability]: value };
    const updated = { ...safeCharacter, abilities: newAbilities };
    setEditedCharacter(updated);
    updateCharacterMutation.mutate({ abilities: newAbilities });
  };

  const handleCombatChange = (field: keyof typeof character.combat, value: number) => {
    const newCombat = { ...safeCharacter.combat, [field]: value };
    const updated = { ...safeCharacter, combat: newCombat };
    setEditedCharacter(updated);
    updateCharacterMutation.mutate({ combat: newCombat });
  };

  const abilities = [
    { key: "strength" as const, label: "STR", fullName: "Strength" },
    { key: "dexterity" as const, label: "DEX", fullName: "Dexterity" },
    { key: "constitution" as const, label: "CON", fullName: "Constitution" },
    { key: "intelligence" as const, label: "INT", fullName: "Intelligence" },
    { key: "wisdom" as const, label: "WIS", fullName: "Wisdom" },
    { key: "charisma" as const, label: "CHA", fullName: "Charisma" },
  ];

  const skills = [
    { name: "Athletics", ability: "strength" },
    { name: "Acrobatics", ability: "dexterity" },
    { name: "Intimidation", ability: "charisma" },
    { name: "Perception", ability: "wisdom" },
    { name: "Survival", ability: "wisdom" },
    { name: "Stealth", ability: "dexterity" },
  ];

  const hpPercentage = (safeCharacter.combat.currentHp / safeCharacter.combat.maxHp) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Character Info & Stats */}
      <div className="lg:col-span-8 space-y-6">
        {/* Character Header */}
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 rounded-full border-4 border-dnd-burgundy bg-gradient-to-br from-dnd-saddle to-dnd-brown flex items-center justify-center">
                <span className="text-2xl font-cinzel font-bold text-dnd-parchment">
                  {character?.name?.charAt(0) || "?"}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-cinzel font-bold text-dnd-brown mb-4">{character?.name || "Unknown Character"}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-dnd-brown">
                  <div>
                    <Label className="font-philosopher font-bold">Race</Label>
                    <div className="font-medium">{character?.race || "Unknown"}</div>
                  </div>
                  <div>
                    <Label className="font-philosopher font-bold">Class</Label>
                    <div className="font-medium">{character?.class || "Unknown"}</div>
                  </div>
                  <div>
                    <Label className="font-philosopher font-bold">Level</Label>
                    <div className="font-medium">{character?.level || 1}</div>
                  </div>
                  <div>
                    <Label className="font-philosopher font-bold">Background</Label>
                    <div className="font-medium">{character?.background || "Unknown"}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ability Scores */}
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-cinzel font-bold text-dnd-brown mb-4">Ability Scores</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {abilities.map((ability) => {
                const score = safeCharacter.abilities[ability.key];
                const modifier = calculateModifier(score);
                return (
                  <div key={ability.key} className="stat-box rounded-lg p-4 text-center">
                    <div className="text-sm font-philosopher font-bold text-dnd-brown">{ability.label}</div>
                    <div className="text-3xl font-cinzel font-bold text-dnd-burgundy">{score}</div>
                    <div className="text-lg font-bold text-dnd-brown">{formatModifier(modifier)}</div>
                    <Input
                      type="number"
                      value={score}
                      onChange={(e) => handleAbilityChange(ability.key, parseInt(e.target.value) || 0)}
                      className="w-full bg-white/50 border border-dnd-saddle text-xs text-center mt-1"
                      min={1}
                      max={30}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-cinzel font-bold text-dnd-brown mb-4">Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {skills.map((skill) => {
                const skillKey = skill.name.toLowerCase();
                const isProfilent = safeCharacter.skills[skillKey]?.proficient || false;
                const abilityScore = safeCharacter.abilities[skill.ability as keyof typeof safeCharacter.abilities];
                const modifier = calculateModifier(abilityScore);
                const proficiencyBonus = Math.ceil(character.level / 4) + 1;
                const totalBonus = modifier + (isProfilent ? proficiencyBonus : 0);

                return (
                  <div key={skill.name} className="flex items-center justify-between p-2 bg-white/30 rounded border border-dnd-saddle">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={isProfilent}
                        onCheckedChange={(checked) => {
                          const newSkills = {
                            ...safeCharacter.skills,
                            [skillKey]: { proficient: !!checked, expertise: false },
                          };
                          const updated = { ...safeCharacter, skills: newSkills };
                          setEditedCharacter(updated);
                          updateCharacterMutation.mutate({ skills: newSkills });
                        }}
                        className="text-dnd-burgundy"
                      />
                      <span className="font-philosopher text-dnd-brown">{skill.name}</span>
                      <span className="text-xs text-dnd-saddle">({skill.ability.charAt(0).toUpperCase() + skill.ability.slice(1, 3)})</span>
                    </div>
                    <span className="font-bold text-dnd-burgundy">{formatModifier(totalBonus)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Combat Stats & Actions */}
      <div className="lg:col-span-4 space-y-6">
        {/* Combat Stats */}
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-cinzel font-bold text-dnd-brown mb-4">Combat</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="stat-box rounded-lg p-3 text-center">
                <div className="text-sm font-philosopher font-bold text-dnd-brown">Armor Class</div>
                <div className="text-2xl font-cinzel font-bold text-dnd-burgundy">{safeCharacter.combat.ac}</div>
              </div>
              <div className="stat-box rounded-lg p-3 text-center">
                <div className="text-sm font-philosopher font-bold text-dnd-brown">Initiative</div>
                <div className="text-2xl font-cinzel font-bold text-dnd-burgundy">
                  {formatModifier(safeCharacter.combat.initiative)}
                </div>
              </div>
            </div>
            
            <div className="stat-box rounded-lg p-4 mb-4">
              <div className="text-sm font-philosopher font-bold text-dnd-brown mb-2">Hit Points</div>
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  type="number"
                  value={safeCharacter.combat.currentHp}
                  onChange={(e) => handleCombatChange("currentHp", parseInt(e.target.value) || 0)}
                  className="w-16 bg-white/50 border border-dnd-saddle text-center font-bold text-dnd-burgundy"
                />
                <span className="text-dnd-brown font-bold">/</span>
                <Input
                  type="number"
                  value={safeCharacter.combat.maxHp}
                  onChange={(e) => handleCombatChange("maxHp", parseInt(e.target.value) || 0)}
                  className="w-16 bg-white/50 border border-dnd-saddle text-center font-bold text-dnd-brown"
                />
              </div>
              <Progress value={hpPercentage} className="h-4" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="stat-box rounded-lg p-3 text-center">
                <div className="text-sm font-philosopher font-bold text-dnd-brown">Hit Dice</div>
                <div className="text-lg font-cinzel font-bold text-dnd-burgundy">{safeCharacter.combat.hitDice}</div>
              </div>
              <div className="stat-box rounded-lg p-3 text-center">
                <div className="text-sm font-philosopher font-bold text-dnd-brown">Speed</div>
                <div className="text-lg font-cinzel font-bold text-dnd-burgundy">{safeCharacter.combat.speed} ft</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saving Throws */}
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-cinzel font-bold text-dnd-brown mb-4">Saving Throws</h3>
            <div className="space-y-2">
              {abilities.map((ability) => {
                const score = safeCharacter.abilities[ability.key];
                const modifier = calculateModifier(score);
                const proficiencyBonus = Math.ceil(character.level / 4) + 1;
                // Assume proficiency in Strength and Constitution for Fighter
                const isProfilent = ability.key === "strength" || ability.key === "constitution";
                const totalBonus = modifier + (isProfilent ? proficiencyBonus : 0);

                return (
                  <div key={ability.key} className="flex items-center justify-between p-2 bg-white/30 rounded border border-dnd-saddle">
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={isProfilent} className="text-dnd-burgundy" />
                      <span className="font-philosopher text-dnd-brown">{ability.fullName}</span>
                    </div>
                    <span className="font-bold text-dnd-burgundy">{formatModifier(totalBonus)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
