import { MapShell } from "@features/map/components/MapShell";
import { NavigationDrawer } from "@features/navigation/components/NavigationDrawer";
import { SearchDrawer } from "@features/searchbar/components/SearchDrawer";
import { SettingsSheet } from "@features/settings/components/SettingsSheet";

export default function HomePage() {
  return (
    <main className="relative min-h-dvh bg-background">
      {/* Map area */}
      <MapShell />
      <SettingsSheet />
      <SearchDrawer />
      <NavigationDrawer />
    </main>
  );
}
