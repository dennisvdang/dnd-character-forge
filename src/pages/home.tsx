import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Character } from "@shared/schema";
import Header from "@/components/header";
import CharacterSheet from "@/components/character-sheet";
import SpellsTab from "@/components/spells-tab";
import InventoryTab from "@/components/inventory-tab";
import EncyclopediaTab from "@/components/encyclopedia-tab";
import DiceRollerTab from "@/components/dice-roller-tab";
import { Crown } from "lucide-react";

type TabType = "character" | "spells" | "inventory" | "encyclopedia" | "dice";

const tabs = [
  { id: "character" as const, label: "Character Sheet", icon: "👤" },
  { id: "spells" as const, label: "Spells", icon: "✨" },
  { id: "inventory" as const, label: "Inventory", icon: "🎒" },
  { id: "encyclopedia" as const, label: "Encyclopedia", icon: "📚" },
  { id: "dice" as const, label: "Dice Roller", icon: "🎲" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("character");
  const [selectedCharacterId, setSelectedCharacterId] = useState<number>(1);

  const { data: characters = [], isLoading: loadingCharacters } = useQuery({
    queryKey: ["/api/characters"],
  });

  const { data: selectedCharacter, isLoading: loadingCharacter } = useQuery({
    queryKey: ["/api/characters", selectedCharacterId],
    enabled: !!selectedCharacterId,
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  if (loadingCharacters || loadingCharacter) {
    return (
      <div className="min-h-screen bg-dnd-brown leather-texture flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-dnd-parchment animate-pulse mx-auto mb-4" />
          <div className="text-dnd-beige font-philosopher text-lg">Loading your adventure...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dnd-brown leather-texture font-roboto text-dnd-beige">
      <Header 
        characters={characters}
        selectedCharacterId={selectedCharacterId}
        onCharacterChange={setSelectedCharacterId}
        selectedCharacter={selectedCharacter}
      />
      
      <div className="container mx-auto px-4 py-6">
        {/* Main Navigation */}
        <nav className="mb-6">
          <div className="flex flex-wrap gap-2 bg-dnd-saddle/20 backdrop-blur-sm rounded-xl p-2 border-2 border-dnd-saddle">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`tab-button px-6 py-3 rounded-lg font-philosopher font-bold transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id ? "active" : ""
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "character" && selectedCharacter && (
            <CharacterSheet character={selectedCharacter} />
          )}
          {activeTab === "spells" && selectedCharacter && (
            <SpellsTab character={selectedCharacter} />
          )}
          {activeTab === "inventory" && selectedCharacter && (
            <InventoryTab character={selectedCharacter} />
          )}
          {activeTab === "encyclopedia" && (
            <EncyclopediaTab />
          )}
          {activeTab === "dice" && (
            <DiceRollerTab />
          )}
        </div>
      </div>
    </div>
  );
}
