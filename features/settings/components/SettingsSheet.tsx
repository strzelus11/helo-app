"use client";

import { Button } from "@app/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Settings as SettingsIcon, X } from "lucide-react";
import { useState } from "react";

import { LanguageSettingsSection } from "./LanguageSettingsSection";
import { OrientationSettingsSection } from "./OrientationSettingsSection";
import { TextSizeSettingsSection } from "./TextSizeSettingsSection";
import { ThemeSettingsSection } from "./ThemeSettingsSection";
import { VoiceSettingsSection } from "./VoiceSettingsSection";

export function SettingsSheet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setIsOpen((current) => !current)}
        className="absolute right-5 bottom-5 z-40 rounded-full border border-border/60 bg-background/92 shadow-[0_10px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl"
        aria-label={isOpen ? "Zamknij ustawienia" : "Otwórz ustawienia"}
      >
        <SettingsIcon className="h-4 w-4" />
      </Button>

      <AnimatePresence initial={false} mode="wait">
        {isOpen && (
          <motion.div
            key="settings-sheet"
            initial={{ opacity: 0, y: "120%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "120%" }}
            transition={{
              y: {
                type: "spring",
                stiffness: 210,
                damping: 24,
                mass: 1,
              },
              opacity: {
                duration: 0.12,
                delay: 0.14,
                ease: "easeOut",
              },
            }}
            className="absolute inset-x-3 bottom-3 z-50 overflow-hidden rounded-[22px] border border-border/60 bg-background/92 shadow-[0_16px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl"
            role="dialog"
            aria-modal="false"
            aria-label="Ustawienia"
          >
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Ustawienia
                </p>
                <h2 className="text-sm font-semibold text-foreground">
                  Preferencje aplikacji
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-background/90 hover:text-foreground"
                aria-label="Zamknij ustawienia"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto px-4 pb-4 pt-4 text-sm">
              <ThemeSettingsSection />
              <LanguageSettingsSection />
              <TextSizeSettingsSection />
              <VoiceSettingsSection />
              <OrientationSettingsSection />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
