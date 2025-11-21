"use client";

import { speak } from "@shared/lib/voice/tts";
import { useSettings } from "@features/settings/context/SettingsContext";
import { Button } from "@app/components/ui/button";

export function VoiceTestButton() {
	const { settings } = useSettings();

	function handleTest() {
		if (!settings.voiceEnabled) return;

		const text =
			settings.language === "pl"
				? "To jest test głosu aplikacji HELO."
				: "This is a test of HELO voice guidance.";

		speak(text);
	}

	return (
		<Button
			variant="secondary"
			onClick={handleTest}
			className="w-full mt-2"
			aria-label="Test voice guidance"
		>
			Test Voice
		</Button>
	);
}
