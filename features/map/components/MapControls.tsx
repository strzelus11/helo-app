"use client";
export function MapControls() {
	return (
		<div className="pointer-events-auto fixed bottom-4 right-4 grid gap-2">
			<button className="rounded bg-zinc-800/80 px-3 py-2">+</button>
			<button className="rounded bg-zinc-800/80 px-3 py-2">−</button>
		</div>
	);
}
