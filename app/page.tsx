"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSettings } from "@features/settings/context/SettingsContext";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "./components/ui/sheet";
import { Switch } from "./components/ui/switch";
import { LanguageSwitcher } from "@features/settings/components/LanguageSwitcher";
import { MapCanvas } from "@features/map/components/MapCanvas";
import { VoiceTestButton } from "@shared/ui/VoiceTestButton";

export default function HomePage() {
	const tHome = useTranslations("HomePage");
	const tSettings = useTranslations("Settings");
	const tAuth = useTranslations("Auth");

	const { settings, setThemeMode, setVoiceEnabled } = useSettings();

	const [sheetOpen, setSheetOpen] = useState(false);
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	return (
		<main className="min-h-dvh flex flex-col items-center justify-center gap-6 bg-background text-foreground p-6">
			<MapCanvas />
			<h1 className="text-2xl font-semibold tracking-tight text-center">
				{tHome("title")}
			</h1>
			<p className="text-sm text-muted-foreground max-w-md text-center">
				{tHome("subtitle")}
			</p>

			{/* Theme & language controls */}
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>{tSettings("title")}</CardTitle>
					<CardDescription>{tSettings("description")}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Theme switcher */}
					<div className="flex items-center justify-between gap-4">
						<div className="space-y-1">
							<p className="text-sm font-medium leading-none">
								{tSettings("themeLabel")}
							</p>
							<p className="text-xs text-muted-foreground">
								{tSettings("themeDescription")}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-xs text-muted-foreground">
								{tSettings("light")}
							</span>
							{isHydrated && (
								<Switch
									checked={settings.themeMode === "dark"}
									onCheckedChange={(checked) =>
										setThemeMode(checked ? "dark" : "light")
									}
									aria-label={tSettings("darkMode")}
								/>
							)}
							<span className="text-xs text-muted-foreground">
								{tSettings("dark")}
							</span>
						</div>
					</div>

					{/* Language switcher */}
					<div className="flex items-center justify-between gap-4">
						<div className="space-y-1">
							<p className="text-sm font-medium leading-none">
								{tSettings("languageLabel")}
							</p>
							<p className="text-xs text-muted-foreground">
								{tSettings("languageDescription")}
							</p>
						</div>
						{isHydrated && <LanguageSwitcher />}
					</div>

					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between gap-4">
							<div className="space-y-1">
								<p className="text-sm font-medium leading-none">
									{tSettings("voiceLabel")}
								</p>
								<p className="text-xs text-muted-foreground">
									{tSettings("voiceDescription")}
								</p>
							</div>
							{isHydrated && (
								<Switch
									checked={settings.voiceEnabled}
									onCheckedChange={(checked) => setVoiceEnabled(checked)}
									aria-label="Toggle voice guidance"
								/>
							)}
						</div>

						<VoiceTestButton />
					</div>
				</CardContent>
			</Card>

			{/* Simple auth/demo card like before */}
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>{tAuth("title")}</CardTitle>
					<CardDescription>{tAuth("description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="flex flex-col gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">{tAuth("email")}</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">{tAuth("password")}</Label>
								<button
									type="button"
									className="ml-auto inline-block text-xs text-muted-foreground underline-offset-4 hover:underline"
								>
									{tAuth("forgotPassword")}
								</button>
							</div>
							<Input id="password" type="password" required />
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col gap-2">
					<Button type="submit" className="w-full">
						{tAuth("login")}
					</Button>
					<Button variant="outline" className="w-full">
						{tAuth("loginWithGoogle")}
					</Button>
				</CardFooter>
			</Card>

			{/* Optional bottom sheet demo using shadcn Sheet */}
			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent side="bottom" className="space-y-4">
					<SheetHeader>
						<SheetTitle>{tHome("sheetTitle")}</SheetTitle>
						<SheetDescription>{tHome("sheetDescription")}</SheetDescription>
					</SheetHeader>
					<div className="flex gap-2">
						<Button className="flex-1" onClick={() => setSheetOpen(false)}>
							{tHome("sheetConfirm")}
						</Button>
						<Button
							variant="outline"
							className="flex-1"
							onClick={() => setSheetOpen(false)}
						>
							{tHome("sheetClose")}
						</Button>
					</div>
				</SheetContent>
			</Sheet>

			<Button variant="outline" size="sm" onClick={() => setSheetOpen(true)}>
				{tHome("openSheet")}
			</Button>
		</main>
	);
}
