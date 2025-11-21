"use client";

import { useEffect } from "react";
import { useSettings } from "@features/settings/context/SettingsContext";
import { speak, stopSpeaking } from "@shared/lib/voice/tts";

export type NavigationStep = {
	id: string;
	instruction: string; // already translated text: "Turn left in 10 meters"
};

type UseVoiceGuidanceProps = {
	steps: NavigationStep[];
	activeStepId: string | null;
};

export function useVoiceGuidance({
	steps,
	activeStepId,
}: UseVoiceGuidanceProps) {
	const { settings } = useSettings();

	useEffect(() => {
		if (!settings.voiceEnabled) {
			// voice is off in settings → stop and do nothing
			stopSpeaking();
			return;
		}
		if (!activeStepId) return;

		const step = steps.find((s) => s.id === activeStepId);
		if (!step) return;

		// Choose language for TTS from settings
		const lang = settings.language === "pl" ? "pl-PL" : "en-US";

		speak(step.instruction, lang);

		return () => {
			// optional: stop when component unmounts or step changes
			stopSpeaking();
		};
	}, [activeStepId, steps, settings.voiceEnabled, settings.language]);
}
