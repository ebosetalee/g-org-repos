import { BAD_REQUEST, METHOD_NOT_ALLOWED, NOT_FOUND, UNAUTHORIZED, PRECONDITION_FAILED } from "http-status";

export class ControllerError extends Error {
	public code: number;
	public message: string;
	constructor(message: string, code?: number) {
		super(message);
		this.code = code;
		this.name = this.constructor.name;

		Error.captureStackTrace(this);
	}
}

export class validationError extends ControllerError {
	metadata: Record<string, object>;
	constructor(message: string, metadata: Record<string, object>) {
		super(message);
		this.metadata = metadata;
		this.code = PRECONDITION_FAILED;
	}
}

export class BodyParserError extends ControllerError {
	constructor() {
		const errorMessage = `Failed to parse request body`;
		super(errorMessage);
		this.code = BAD_REQUEST;
	}
}

export class MethodNotAllowedError extends ControllerError {
	constructor(message: string) {
		super(message);
		this.code = METHOD_NOT_ALLOWED;
	}
}

/**
 * Generic HTTP Not Found error
 * Sets the HTTP status code to 404 `Not Found` when a queried item is not found.
 */
export class NotFoundError extends ControllerError {
	constructor(message: string) {
		super(message, NOT_FOUND);
	}
}

export class InvalidSecretKeyError extends ControllerError {
	constructor() {
		const errorMessage = `the secret key provided doesn't exist`;
		super(errorMessage);

		this.code = UNAUTHORIZED;
	}
}

export class MissingAuthHeaderError extends ControllerError {
	constructor() {
		const errorMessage = `authorization token not found`;
		super(errorMessage);

		this.code = UNAUTHORIZED;
	}
}

export class InvalidAuthTokenError extends ControllerError {
	constructor() {
		const errorMessage = `Access Denied! Token Expired`;
		super(errorMessage);

		this.code = UNAUTHORIZED;
	}
}

export class AccountNotFoundError extends ControllerError {
	constructor(id: string) {
		const errorMessage = `account with id: (${id}) does not exist`;
		super(errorMessage);

		this.code = BAD_REQUEST;
	}
}

export class AccountExistsError extends ControllerError {
	constructor() {
		const errorMessage = "A user with matching details exists";
		super(errorMessage);

		this.code = BAD_REQUEST;
	}
}

export class AccountNotExistsError extends ControllerError {
	constructor() {
		const errorMessage = "account does not exist";
		super(errorMessage);

		this.code = BAD_REQUEST;
	}
}

export class LoginAuthenticationError extends ControllerError {
	constructor() {
		const errorMessage = "Incorrect email or password supplied";
		super(errorMessage);

		this.code = UNAUTHORIZED;
	}
}

export default ControllerError;
