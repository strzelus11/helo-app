"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@app/components/ui/command";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Toilet, ArrowRight } from "lucide-react";
import { useState } from "react";

const MOCK_RECENT = [
  { id: "room-101", label: "Gabinet 101", hint: "Pawilon 1 · Poziom 1" },
  { id: "toilet-1", label: "Toaleta przy wejściu głównym", hint: "Pawilon 2" },
];

const MOCK_CATEGORIES = [
  { id: "rooms", label: "Pokoje / gabinety", icon: MapPin },
  { id: "booths", label: "Stoiska targowe", icon: ArrowRight },
  { id: "toilets", label: "Toalety", icon: Toilet },
];

export function SearchDrawer() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (!query.trim()) {
      setOpen(false);
      return;
    }

    // TODO: tutaj uruchomisz realne wyszukiwanie / nawigację
    console.log("Search submit:", query);

    setOpen(false);
  };

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30"
          onClick={() => setOpen(false)}
          aria-label="Zamknij wyszukiwanie"
        />
      )}
      <div className="absolute inset-x-4 top-4 z-40">
        <Command className="rounded-xl shadow-lg border border-border bg-card">
          <CommandInput
            placeholder="Wpisz numer pokoju, nazwę, stoisko..."
            value={query}
            onValueChange={setQuery}
            onFocus={() => setOpen(true)}
            onClear={() => {
              setQuery("");
              setOpen(false);
            }}
            onSubmitKey={handleSubmit}
          />
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <CommandList className="max-h-[60vh] border-t border-border/60">
                  <CommandEmpty>
                    Brak wyników. Spróbuj innego hasła.
                  </CommandEmpty>

                  {MOCK_RECENT.length > 0 && (
                    <CommandGroup heading="Ostatnio wyszukiwane">
                      {MOCK_RECENT.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.label}
                          onSelect={() => {
                            setQuery(item.label);
                            setOpen(false);
                          }}
                        >
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="text-sm">{item.label}</span>
                            <span className="text-[11px] text-muted-foreground">
                              {item.hint}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  <CommandSeparator />

                  <CommandGroup heading="Kategorie">
                    {MOCK_CATEGORIES.map((cat) => (
                      <CommandItem
                        key={cat.id}
                        value={cat.label}
                        onSelect={() => {
                          setQuery(cat.label);
                          setOpen(false);
                        }}
                      >
                        <cat.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{cat.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </motion.div>
            )}
          </AnimatePresence>
        </Command>
      </div>
    </>
  );
}
