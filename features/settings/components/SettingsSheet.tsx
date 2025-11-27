"use client";

import { Button } from "@app/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@app/components/ui/drawer";
import { Settings as SettingsIcon } from "lucide-react";

import { LanguageSettingsSection } from "./LanguageSettingsSection";
import { OrientationSettingsSection } from "./OrientationSettingsSection";
import { TextSizeSettingsSection } from "./TextSizeSettingsSection";
import { ThemeSettingsSection } from "./ThemeSettingsSection";
import { VoiceSettingsSection } from "./VoiceSettingsSection";

export function SettingsSheet() {
  return (
    <Drawer>
      {/* Floating settings button */}
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-5 bottom-5 z-40 rounded-full bg-background/90 shadow-md backdrop-blur"
          aria-label="Ustawienia"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-auto max-h-[75vh] rounded-b-3xl border-b bg-card">
        <DrawerTitle className="sr-only">Settings</DrawerTitle>
        <div className="mt-4 space-y-4 px-5 pb-5 text-sm">
          <ThemeSettingsSection />
          <LanguageSettingsSection />
          <TextSizeSettingsSection />
          <VoiceSettingsSection />
          <OrientationSettingsSection />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
