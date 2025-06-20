import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plus, Package } from "lucide-react";
import type { Character } from "@shared/schema";

interface InventoryTabProps {
  character: Character;
}

export default function InventoryTab({ character }: InventoryTabProps) {
  const [currency, setCurrency] = useState(character.currency);

  const { data: items = [] } = useQuery({
    queryKey: ["/api/characters", character.id, "items"],
  });

  // Sample equipment for demonstration
  const sampleEquipment = [
    {
      id: 1,
      name: "Warhammer +1",
      type: "Weapon (warhammer), uncommon",
      description: "You have a +1 bonus to attack and damage rolls made with this magic weapon.",
      quantity: 1,
      weight: 20, // 2.0 lbs
      value: 15000, // 150 gp in copper
      equipped: true,
    },
    {
      id: 2,
      name: "Plate Armor",
      type: "Armor (plate), common",
      description: "AC 18. While wearing this armor, you have disadvantage on Stealth checks.",
      quantity: 1,
      weight: 650, // 65 lbs
      value: 150000, // 1500 gp in copper
      equipped: true,
    },
    {
      id: 3,
      name: "Potion of Healing",
      type: "Potion, common",
      description: "You regain 2d4 + 2 hit points when you drink this potion.",
      quantity: 3,
      weight: 5, // 0.5 lbs
      value: 5000, // 50 gp in copper
      equipped: false,
    },
    {
      id: 4,
      name: "Adventurer's Pack",
      type: "Equipment pack",
      description: "Includes backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 feet of hempen rope.",
      quantity: 1,
      weight: 590, // 59 lbs
      value: 200, // 2 gp in copper
      equipped: false,
    },
  ];

  const displayItems = items.length > 0 ? items : sampleEquipment;

  // Calculate carrying capacity
  const strength = character.abilities.strength;
  const carryingCapacity = strength * 15;
  const totalWeight = displayItems.reduce((total, item) => total + (item.weight * item.quantity), 0) / 10; // Convert to lbs
  const weightPercentage = (totalWeight / carryingCapacity) * 100;

  const handleCurrencyChange = (type: keyof typeof currency, value: number) => {
    setCurrency(prev => ({ ...prev, [type]: Math.max(0, value) }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Equipment */}
      <div className="lg:col-span-2">
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-cinzel font-bold text-dnd-brown">Equipment</h3>
              <Button className="bg-dnd-burgundy text-dnd-parchment hover:bg-dnd-crimson font-philosopher">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayItems.map((item) => (
                <div key={item.id} className="bg-white/30 rounded-lg p-4 border border-dnd-saddle hover:bg-white/40 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 rounded border-2 border-dnd-saddle bg-dnd-saddle/20 flex items-center justify-center">
                      <Package className="w-6 h-6 text-dnd-brown" />
                    </div>
                    <div className="flex-1 ml-3">
                      <h4 className="font-philosopher font-bold text-dnd-brown">{item.name}</h4>
                      <p className="text-sm text-dnd-saddle">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-dnd-brown">Qty: {item.quantity}</div>
                      <div className="text-xs text-dnd-saddle">{(item.weight * item.quantity / 10).toFixed(1)} lb</div>
                    </div>
                  </div>
                  <p className="text-xs text-dnd-brown">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Character Info */}
      <div className="lg:col-span-1 space-y-6">
        {/* Carrying Capacity */}
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-cinzel font-bold text-dnd-brown mb-4">Carrying Capacity</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-philosopher text-dnd-brown">Weight Carried</span>
                  <span className="font-bold text-dnd-burgundy">{totalWeight.toFixed(1)} / {carryingCapacity} lbs</span>
                </div>
                <Progress value={Math.min(weightPercentage, 100)} className="h-3" />
              </div>
              
              <div className="text-sm text-dnd-brown space-y-1">
                <div className="flex justify-between">
                  <span>Carrying Capacity:</span>
                  <span className="font-bold">{carryingCapacity} lbs</span>
                </div>
                <div className="flex justify-between">
                  <span>Push/Drag/Lift:</span>
                  <span className="font-bold">{carryingCapacity * 2} lbs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency */}
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-cinzel font-bold text-dnd-brown mb-4">Currency</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-white/30 rounded border border-dnd-saddle">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full border border-gray-400"></div>
                  <span className="font-philosopher text-dnd-brown">Platinum</span>
                </div>
                <Input
                  type="number"
                  value={currency.platinum}
                  onChange={(e) => handleCurrencyChange("platinum", parseInt(e.target.value) || 0)}
                  className="w-16 bg-white/50 border border-dnd-saddle text-center text-sm font-bold text-dnd-brown"
                />
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white/30 rounded border border-dnd-saddle">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border border-yellow-600"></div>
                  <span className="font-philosopher text-dnd-brown">Gold</span>
                </div>
                <Input
                  type="number"
                  value={currency.gold}
                  onChange={(e) => handleCurrencyChange("gold", parseInt(e.target.value) || 0)}
                  className="w-16 bg-white/50 border border-dnd-saddle text-center text-sm font-bold text-dnd-brown"
                />
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white/30 rounded border border-dnd-saddle">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full border border-gray-600"></div>
                  <span className="font-philosopher text-dnd-brown">Silver</span>
                </div>
                <Input
                  type="number"
                  value={currency.silver}
                  onChange={(e) => handleCurrencyChange("silver", parseInt(e.target.value) || 0)}
                  className="w-16 bg-white/50 border border-dnd-saddle text-center text-sm font-bold text-dnd-brown"
                />
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white/30 rounded border border-dnd-saddle">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full border border-yellow-900"></div>
                  <span className="font-philosopher text-dnd-brown">Copper</span>
                </div>
                <Input
                  type="number"
                  value={currency.copper}
                  onChange={(e) => handleCurrencyChange("copper", parseInt(e.target.value) || 0)}
                  className="w-16 bg-white/50 border border-dnd-saddle text-center text-sm font-bold text-dnd-brown"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
