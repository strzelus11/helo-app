let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  // Stop any ongoing speech
  if (currentUtterance) {
    window.speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  try {
    const stored = localStorage.getItem("helo.settings.v1");
    const parsed = stored ? JSON.parse(stored) : {};

    if (parsed.language === "pl") {
      utterance.lang = "pl-PL";
    } else {
      utterance.lang = "en-US";
    }
  } catch {
    utterance.lang = "en-US";
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  currentUtterance = null;
}
