import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { encyclopediaData } from "@/lib/dnd-data";

export default function EncyclopediaTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEntries = encyclopediaData.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || entry.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Search & Filters */}
      <div className="lg:col-span-1">
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-cinzel font-bold text-dnd-brown mb-4">Search</h3>
            
            <div className="space-y-4">
              <Input
                placeholder="Search rules, spells, monsters..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white/50 border border-dnd-saddle"
              />
              
              <div>
                <label className="block text-sm font-philosopher font-bold text-dnd-brown mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={(value) => {
                  setSelectedCategory(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="bg-white/50 border border-dnd-saddle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="rules">Rules</SelectItem>
                    <SelectItem value="spells">Spells</SelectItem>
                    <SelectItem value="monsters">Monsters</SelectItem>
                    <SelectItem value="items">Items</SelectItem>
                    <SelectItem value="classes">Classes</SelectItem>
                    <SelectItem value="races">Races</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-philosopher font-bold text-dnd-brown mb-2">Level</label>
                <Select value={selectedLevel} onValueChange={(value) => {
                  setSelectedLevel(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="bg-white/50 border border-dnd-saddle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Level</SelectItem>
                    <SelectItem value="cantrip">Cantrip</SelectItem>
                    <SelectItem value="1st">1st Level</SelectItem>
                    <SelectItem value="2nd">2nd Level</SelectItem>
                    <SelectItem value="3rd">3rd Level</SelectItem>
                    <SelectItem value="4th">4th Level</SelectItem>
                    <SelectItem value="5th">5th Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Results */}
      <div className="lg:col-span-3">
        <Card className="parchment-bg medieval-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-cinzel font-bold text-dnd-brown">D&D 5e Encyclopedia</h3>
              <span className="text-sm text-dnd-saddle">{filteredEntries.length} entries found</span>
            </div>
            
            <div className="space-y-4 min-h-[400px]">
              {paginatedEntries.map((entry) => (
                <div key={entry.id} className="bg-white/30 rounded-lg p-4 border border-dnd-saddle hover:bg-white/40 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-philosopher font-bold text-dnd-brown">{entry.name}</h4>
                        <Badge variant="secondary" className="bg-dnd-burgundy text-dnd-parchment">
                          {entry.category}
                        </Badge>
                        {entry.level && (
                          <Badge variant="outline" className="bg-dnd-crimson text-dnd-parchment border-dnd-crimson">
                            {entry.level}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-dnd-brown mb-2">{entry.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-dnd-saddle">
                        {entry.details.map((detail, index) => (
                          <span key={index}>{detail}</span>
                        ))}
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-dnd-burgundy text-dnd-parchment hover:bg-dnd-crimson ml-4"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {paginatedEntries.length === 0 && (
                <div className="text-center py-8 text-dnd-saddle">
                  <p>No entries found matching your criteria.</p>
                  <p className="text-sm mt-2">Try adjusting your search terms or filters.</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-dnd-burgundy text-dnd-parchment hover:bg-dnd-crimson border-dnd-burgundy"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  if (page > totalPages) return null;
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={currentPage === page 
                        ? "bg-dnd-burgundy text-dnd-parchment hover:bg-dnd-crimson" 
                        : "bg-dnd-brown text-dnd-beige hover:bg-dnd-burgundy hover:text-dnd-parchment border-dnd-saddle"
                      }
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-dnd-burgundy text-dnd-parchment hover:bg-dnd-crimson border-dnd-burgundy"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
