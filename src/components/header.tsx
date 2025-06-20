import { Crown, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Character } from "@shared/schema";
import { exportAllData, importAllData } from "@/lib/localApi";

interface HeaderProps {
  characters: Character[];
  selectedCharacterId: number;
  onCharacterChange: (id: number) => void;
  selectedCharacter?: Character;
}

export default function Header({ 
  characters, 
  selectedCharacterId, 
  onCharacterChange, 
  selectedCharacter 
}: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-dnd-burgundy via-dnd-crimson to-dnd-burgundy shadow-2xl border-b-4 border-dnd-saddle">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Crown className="text-4xl text-dnd-parchment" size={48} />
            <div>
              <h1 className="text-3xl font-cinzel font-bold text-dnd-parchment">D&D 5e Companion</h1>
              <p className="text-sm text-dnd-beige opacity-90 font-philosopher">Digital Character Sheet & Encyclopedia</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select
              value={selectedCharacterId.toString()}
              onValueChange={(value) => onCharacterChange(parseInt(value))}
            >
              <SelectTrigger className="w-[280px] bg-dnd-brown border-2 border-dnd-saddle text-dnd-beige font-philosopher focus:border-dnd-parchment">
                <SelectValue>
                  {selectedCharacter 
                    ? `${selectedCharacter.name} (${selectedCharacter.race} ${selectedCharacter.class})`
                    : "Select Character"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-dnd-brown border-dnd-saddle">
                {characters.map((character) => (
                  <SelectItem 
                    key={character.id} 
                    value={character.id.toString()}
                    className="text-dnd-beige hover:bg-dnd-saddle focus:bg-dnd-saddle"
                  >
                    {character.name} ({character.race} {character.class})
                  </SelectItem>
                ))}
                <SelectItem value="new" className="text-dnd-beige hover:bg-dnd-saddle focus:bg-dnd-saddle">
                  + Create New Character
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-dnd-parchment text-dnd-brown hover:bg-dnd-beige font-philosopher font-bold" onClick={() => {
              const code = exportAllData();
              navigator.clipboard.writeText(code);
              alert("Character data exported to clipboard!");
            }}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button className="bg-dnd-parchment text-dnd-brown hover:bg-dnd-beige font-philosopher font-bold" onClick={() => {
              const code = prompt("Paste character code to import:");
              if (code) {
                try {
                  importAllData(code);
                  window.location.reload();
                } catch {
                  alert("Invalid code");
                }
              }
            }}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
