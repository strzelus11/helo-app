export class AppError extends Error {
	constructor(message: string, public code: string, public details?: unknown) {
		super(message);
		this.name = "AppError";
	}
}
export class NetworkError extends AppError {
	constructor(message = "Network error", details?: unknown) {
		super(message, "NETWORK", details);
	}
}
export class InvalidDataError extends AppError {
	constructor(message = "Invalid data", details?: unknown) {
		super(message, "INVALID_DATA", details);
	}
}
export class NotFoundError extends AppError {
	constructor(message = "Not found", details?: unknown) {
		super(message, "NOT_FOUND", details);
	}
}
export class PermissionError extends AppError {
	constructor(message = "Forbidden", details?: unknown) {
		super(message, "FORBIDDEN", details);
	}
}