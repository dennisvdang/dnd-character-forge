import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RotateCcw, Zap, Plus } from "lucide-react";
import { spellsDatabase } from "@/lib/dnd-data";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Character } from "@shared/schema";

interface SpellsTabProps {
  character: Character;
}

export default function SpellsTab({ character }: SpellsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [spellSlots, setSpellSlots] = useState(character.spellSlots || {});
  const [isAddSpellOpen, setIsAddSpellOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: knownSpells = [] } = useQuery({
    queryKey: ["/api/characters", character.id, "spells"],
  });

  const addSpellMutation = useMutation({
    mutationFn: async (spellId: string) => {
      const spell = spellsDatabase.find(s => s.id === spellId);
      if (!spell) throw new Error("Spell not found");
      
      return await apiRequest("POST", `/api/characters/${character.id}/spells`, {
        characterId: character.id,
        spellId: spell.id,
        spellName: spell.name,
        spellLevel: spell.level,
        prepared: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters", character.id, "spells"] });
      toast({ title: "Spell added successfully!" });
      setIsAddSpellOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to add spell", variant: "destructive" });
    }
  });

  const filteredSpells = spellsDatabase.filter(spell => {
    const matchesSearch = spell.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spell.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || spell.level.toString() === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleSpellSlotClick = (level: number, slotIndex: number) => {
    const levelKey = level.toString();
    const currentSlots = spellSlots[levelKey] || { total: 0, used: 0 };
    const newUsed = slotIndex < currentSlots.used ? slotIndex : slotIndex + 1;
    
    setSpellSlots({
      ...spellSlots,
      [levelKey]: { ...currentSlots, used: Math.min(newUsed, currentSlots.total) }
    });
  };

  const longRest = () => {
    const resetSlots = Object.keys(spellSlots).reduce((acc, level) => {
      acc[level] = { ...spellSlots[level], used: 0 };
      return acc;
    }, {} as typeof spellSlots);
    setSpellSlots(resetSlots);
  };

  // Default spell slots for demonstration
  const defaultSpellSlots = {
    "1": { total: 4, used: 2 },
    "2": { total: 3, used: 1 },
    "3": { total: 2, used: 0 },
  };

  const currentSpellSlots = Object.keys(defaultSpellSlots).length > 0 ? defaultSpellSlots : spellSlots;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Spell Slots & Casting */}
      <div className="lg:col-span-1">
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-cinzel font-bold text-dnd-brown mb-4">Spell Slots</h3>
            
            {Object.entries(currentSpellSlots).map(([level, slots]) => (
              <div key={level} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-philosopher font-bold text-dnd-brown">
                    {level === "0" ? "Cantrips" : `${level}${level === "1" ? "st" : level === "2" ? "nd" : level === "3" ? "rd" : "th"} Level`}
                  </span>
                  <span className="text-sm text-dnd-saddle">{slots.total} slots</span>
                </div>
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${slots.total}, 1fr)` }}>
                  {Array.from({ length: slots.total }, (_, i) => (
                    <div
                      key={i}
                      onClick={() => handleSpellSlotClick(parseInt(level), i)}
                      className={`w-8 h-8 rounded border-2 cursor-pointer transition-colors ${
                        i < slots.used
                          ? "bg-white/50 border-dnd-saddle"
                          : "bg-dnd-burgundy border-dnd-crimson"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
            
            <Button 
              onClick={longRest}
              className="w-full bg-dnd-burgundy text-dnd-parchment hover:bg-dnd-crimson font-philosopher"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Long Rest
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Spell List */}
      <div className="lg:col-span-2">
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-cinzel font-bold text-dnd-brown">Available Spells</h3>
              <div className="flex space-x-2">
                <Dialog open={isAddSpellOpen} onOpenChange={setIsAddSpellOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-dnd-burgundy text-dnd-parchment hover:bg-dnd-crimson font-philosopher">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Spell
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto parchment-bg">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-cinzel text-dnd-brown">Add New Spell</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Search spells..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-white/50 border border-dnd-saddle"
                        />
                        <Select value={levelFilter} onValueChange={setLevelFilter}>
                          <SelectTrigger className="w-[140px] bg-white/50 border border-dnd-saddle">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="0">Cantrips</SelectItem>
                            <SelectItem value="1">1st Level</SelectItem>
                            <SelectItem value="2">2nd Level</SelectItem>
                            <SelectItem value="3">3rd Level</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3 max-h-96 overflow-y-auto">
                        {filteredSpells.map((spell) => (
                          <div key={spell.id} className="border border-dnd-saddle rounded-lg p-4 bg-white/20">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-philosopher font-bold text-dnd-brown">{spell.name}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline" className="text-xs border-dnd-saddle text-dnd-brown">
                                    {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs border-dnd-saddle text-dnd-brown">
                                    {spell.school}
                                  </Badge>
                                </div>
                                <p className="text-sm text-dnd-saddle mt-2">{spell.description}</p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => addSpellMutation.mutate(spell.id)}
                                disabled={addSpellMutation.isPending}
                                className="ml-4 bg-dnd-burgundy text-dnd-parchment hover:bg-dnd-crimson"
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Input
                  placeholder="Search spells..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/50 border border-dnd-saddle"
                />
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[140px] bg-white/50 border border-dnd-saddle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="0">Cantrips</SelectItem>
                    <SelectItem value="1">1st Level</SelectItem>
                    <SelectItem value="2">2nd Level</SelectItem>
                    <SelectItem value="3">3rd Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSpells.map((spell) => (
                <div key={spell.id} className="bg-white/30 rounded-lg p-4 border border-dnd-saddle">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-philosopher font-bold text-dnd-brown">{spell.name}</h4>
                      <Badge variant="secondary" className="bg-dnd-burgundy text-dnd-parchment">
                        {spell.level === 0 ? "Cantrip" : `${spell.level}${spell.level === 1 ? "st" : spell.level === 2 ? "nd" : spell.level === 3 ? "rd" : "th"}`}
                      </Badge>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-dnd-burgundy text-dnd-parchment hover:bg-dnd-crimson"
                    >
                      <Zap className="mr-1 h-3 w-3" />
                      Cast
                    </Button>
                  </div>
                  <p className="text-sm text-dnd-brown mb-2">{spell.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-dnd-saddle">
                    <div><span className="font-bold">Casting Time:</span> {spell.castingTime}</div>
                    <div><span className="font-bold">Range:</span> {spell.range}</div>
                    <div><span className="font-bold">Duration:</span> {spell.duration}</div>
                    <div><span className="font-bold">Components:</span> {spell.components}</div>
                  </div>
                </div>
              ))}
              
              {filteredSpells.length === 0 && (
                <div className="text-center py-8 text-dnd-saddle">
                  <p>No spells found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
