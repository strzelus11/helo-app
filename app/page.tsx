import { MapShell } from "@features/map/components/MapShell";
import { NavigationPanel } from "@features/navigation/components/navigation-panel/NavigationPanel";
import { SearchDrawer } from "@features/searchbar/components/SearchDrawer";
import { SettingsSheet } from "@features/settings/components/SettingsSheet";

export default function HomePage() {
  return (
    <main className="relative min-h-dvh bg-background">
      <MapShell />
      <SettingsSheet />
      <SearchDrawer />
      <NavigationPanel />
    </main>
  );
}
