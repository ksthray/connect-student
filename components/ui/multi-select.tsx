"use client";

import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils"; // Utilitaire pour joindre les classes Tailwind
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Interface pour les options (Secteurs)
interface Option {
  label: string; // Nom affiché (ex: "Informatique")
  value: string; // ID utilisé pour le formulaire (ex: "clx123")
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[]; // IDs des valeurs sélectionnées
  onChange: (values: string[]) => void;
  placeholder: string;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");

  // Gère l'ajout ou la suppression d'une option lors du clic
  const handleSelect = (selectedValue: string) => {
    const isSelected = selectedValues.includes(selectedValue);

    if (isSelected) {
      // Supprimer la valeur
      onChange(selectedValues.filter((id) => id !== selectedValue));
    } else {
      // Ajouter la valeur
      onChange([...selectedValues, selectedValue]);
    }
  };

  // Gère la suppression d'un badge (déselection)
  const handleRemoveBadge = (idToRemove: string) => {
    onChange(selectedValues.filter((id) => id !== idToRemove));
  };

  // Filtrer les options basées sur la recherche
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // Récupérer les objets Option pour les badges affichés
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 p-2">
          {selectedValues.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="pl-2 pr-1 flex items-center gap-1">
                  {option.label}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation(); // Empêcher la fermeture de la Popover
                      handleRemoveBadge(option.value);
                    }}
                  />
                </Badge>
              ))}
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          {/* Barre de recherche */}
          <div className="p-1 border-b">
            <input
              placeholder="Rechercher un secteur..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-2 outline-none"
            />
          </div>

          <CommandList>
            <CommandGroup>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                      className="cursor-pointer">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Aucun résultat trouvé pour &quot;{searchText}&quot;.
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
