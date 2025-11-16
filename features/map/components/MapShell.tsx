export function MapShell({ children }: { children: React.ReactNode }) {
	return (
		<section className="relative h-dvh w-full overflow-hidden">
			{children}
		</section>
	);
}
