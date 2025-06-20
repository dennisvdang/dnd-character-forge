import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { rollDice, parseDiceFormula } from "@/lib/dice-utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { RollHistory } from "@shared/schema";

export default function DiceRollerTab() {
  const [customFormula, setCustomFormula] = useState("");
  const [modifier, setModifier] = useState(0);
  const [currentRoll, setCurrentRoll] = useState({
    result: 18,
    formula: "1d20 + 3",
    breakdown: "Rolled: 15 + 3 = 18"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rollHistory = [] } = useQuery({
    queryKey: ["/api/rolls/history"],
  });

  const addRollMutation = useMutation({
    mutationFn: async (roll: { formula: string; result: number; breakdown: string }) => {
      const response = await apiRequest("POST", "/api/rolls", {
        ...roll,
        timestamp: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rolls/history"] });
    },
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/rolls/history");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rolls/history"] });
      toast({ title: "Roll history cleared" });
    },
  });

  const diceTypes = [
    { sides: 4, color: "from-dnd-parchment to-dnd-beige" },
    { sides: 6, color: "from-dnd-parchment to-dnd-beige" },
    { sides: 8, color: "from-dnd-parchment to-dnd-beige" },
    { sides: 10, color: "from-dnd-parchment to-dnd-beige" },
    { sides: 12, color: "from-dnd-parchment to-dnd-beige" },
    { sides: 20, color: "from-dnd-crimson to-dnd-burgundy" },
    { sides: 100, color: "from-dnd-parchment to-dnd-beige" },
  ];

  const quickActions = [
    { name: "Initiative", formula: "1d20+1" },
    { name: "Ability Check", formula: "1d20+3" },
    { name: "Saving Throw", formula: "1d20+5" },
    { name: "Attack Roll", formula: "1d20+8" },
    { name: "Damage Roll", formula: "1d8+4" },
  ];

  const handleDiceRoll = (sides: number) => {
    const roll = rollDice(1, sides);
    const total = roll + modifier;
    const formula = modifier !== 0 ? `1d${sides}${modifier >= 0 ? '+' : ''}${modifier}` : `1d${sides}`;
    const breakdown = modifier !== 0 ? `Rolled: ${roll} ${modifier >= 0 ? '+' : ''} ${modifier} = ${total}` : `Rolled: ${roll}`;
    
    const newRoll = {
      result: total,
      formula,
      breakdown
    };
    
    setCurrentRoll(newRoll);
    addRollMutation.mutate(newRoll);
  };

  const handleCustomRoll = () => {
    try {
      const formula = customFormula.trim() || "1d20";
      const parsed = parseDiceFormula(formula);
      const roll = rollDice(parsed.count, parsed.sides);
      const total = roll + parsed.modifier + modifier;
      const finalFormula = modifier !== 0 ? `${formula}${modifier >= 0 ? '+' : ''}${modifier}` : formula;
      const breakdown = `Rolled: ${roll}${parsed.modifier !== 0 ? ` ${parsed.modifier >= 0 ? '+' : ''} ${parsed.modifier}` : ''}${modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''} ${modifier}` : ''} = ${total}`;
      
      const newRoll = {
        result: total,
        formula: finalFormula,
        breakdown
      };
      
      setCurrentRoll(newRoll);
      addRollMutation.mutate(newRoll);
    } catch (error) {
      toast({ 
        title: "Invalid dice formula", 
        description: "Please use format like '2d6+3' or '1d20'",
        variant: "destructive" 
      });
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    try {
      const parsed = parseDiceFormula(action.formula);
      const roll = rollDice(parsed.count, parsed.sides);
      const total = roll + parsed.modifier;
      const breakdown = parsed.modifier !== 0 ? `Rolled: ${roll} ${parsed.modifier >= 0 ? '+' : ''} ${parsed.modifier} = ${total}` : `Rolled: ${roll}`;
      
      const newRoll = {
        result: total,
        formula: action.formula,
        breakdown
      };
      
      setCurrentRoll(newRoll);
      addRollMutation.mutate(newRoll);
    } catch (error) {
      toast({ 
        title: "Error rolling dice", 
        variant: "destructive" 
      });
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const rollTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - rollTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dice Roller */}
      <div className="lg:col-span-2">
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-cinzel font-bold text-dnd-brown mb-4">Dice Roller</h3>
            
            {/* Dice Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {diceTypes.map((dice) => (
                <Button
                  key={dice.sides}
                  onClick={() => handleDiceRoll(dice.sides)}
                  className={`dice-shadow bg-gradient-to-br ${dice.color} ${
                    dice.sides === 20 ? 'text-dnd-parchment' : 'text-dnd-brown'
                  } p-6 h-auto rounded-xl border-2 border-dnd-burgundy transition-all transform hover:scale-105 active:scale-95`}
                >
                  <div className="text-center">
                    <div className="text-3xl font-cinzel font-bold mb-2">d{dice.sides}</div>
                    <div className="text-sm font-philosopher">1-{dice.sides}</div>
                  </div>
                </Button>
              ))}
              
              <Button
                onClick={handleCustomRoll}
                className="dice-shadow bg-gradient-to-br from-dnd-saddle to-dnd-brown text-dnd-parchment p-6 h-auto rounded-xl border-2 border-dnd-burgundy transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="text-center">
                  <div className="text-2xl font-cinzel font-bold mb-2">Custom</div>
                  <div className="text-xs font-philosopher">Formula</div>
                </div>
              </Button>
            </div>
            
            {/* Custom Roll Input */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label className="font-philosopher font-bold text-dnd-brown mb-2">Dice Formula</Label>
                  <Input
                    placeholder="2d6+3 or 1d20+5"
                    value={customFormula}
                    onChange={(e) => setCustomFormula(e.target.value)}
                    className="bg-white/50 border border-dnd-saddle"
                  />
                </div>
                <div className="md:w-32">
                  <Label className="font-philosopher font-bold text-dnd-brown mb-2">Modifier</Label>
                  <Input
                    type="number"
                    placeholder="+0"
                    value={modifier || ""}
                    onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                    className="bg-white/50 border border-dnd-saddle text-center"
                  />
                </div>
                <div className="md:w-32 flex items-end">
                  <Button 
                    onClick={handleCustomRoll}
                    className="w-full bg-dnd-burgundy text-dnd-parchment hover:bg-dnd-crimson font-philosopher font-bold"
                  >
                    🎲 Roll
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Roll Result */}
            <div className="bg-white/30 rounded-lg p-6 border border-dnd-saddle">
              <div className="text-center">
                <div className="text-6xl font-cinzel font-bold text-dnd-burgundy mb-2">
                  {currentRoll.result}
                </div>
                <div className="text-lg font-philosopher text-dnd-brown mb-2">
                  {currentRoll.formula}
                </div>
                <div className="text-sm text-dnd-saddle">
                  {currentRoll.breakdown}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & History */}
      <div className="lg:col-span-1 space-y-6">
        {/* Quick Actions */}
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-cinzel font-bold text-dnd-brown mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Button
                  key={action.name}
                  onClick={() => handleQuickAction(action)}
                  className="w-full bg-dnd-burgundy text-dnd-parchment hover:bg-dnd-crimson font-philosopher"
                >
                  <span className="mr-2">⚡</span>
                  {action.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Roll History */}
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-cinzel font-bold text-dnd-brown">Roll History</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearHistoryMutation.mutate()}
                className="text-dnd-saddle hover:text-dnd-burgundy hover:bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {rollHistory.map((roll: RollHistory) => (
                <div key={roll.id} className="bg-white/30 rounded p-3 border border-dnd-saddle">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-philosopher font-bold text-dnd-brown text-sm">
                      {roll.formula}
                    </span>
                    <span className="text-2xl font-cinzel font-bold text-dnd-burgundy">
                      {roll.result}
                    </span>
                  </div>
                  <div className="text-xs text-dnd-saddle">{roll.breakdown}</div>
                  <div className="text-xs text-dnd-saddle">{formatTimeAgo(roll.timestamp)}</div>
                </div>
              ))}
              
              {rollHistory.length === 0 && (
                <div className="text-center py-4 text-dnd-saddle">
                  <p className="text-sm">No rolls yet. Start rolling some dice!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
