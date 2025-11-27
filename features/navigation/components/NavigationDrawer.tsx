"use client";

import { Button } from "@app/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@app/components/ui/drawer";

export function NavigationDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full px-6 shadow-lg"
        >
          Otwórz nawigację
        </Button>
      </DrawerTrigger>

      <DrawerContent className="px-5 pb-5 bg-card">
        <DrawerTitle className="sr-only">Nawigacja</DrawerTitle>
        <p className="text-sm font-medium">Nawigacja</p>
        <p className="text-xs text-muted-foreground">
          Tutaj pojawi się trasa, kroki i przyciski start/stop.
        </p>
        <Button variant="secondary" size="sm" className="mt-2">
          Symuluj start nawigacji
        </Button>
      </DrawerContent>
    </Drawer>
  );
}
