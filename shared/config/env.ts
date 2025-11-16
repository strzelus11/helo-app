import { z } from "zod";

const Env = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]),
	NEXT_PUBLIC_API_BASE: z.string().url().optional(), // example public var
});

export const env = Env.parse({
	NODE_ENV: process.env.NODE_ENV,
	NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
});
