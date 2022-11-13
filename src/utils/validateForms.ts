import { FieldError } from "src/types";

export const getRegisterErrors = (email: string, password: string, username: string): FieldError[] | null => {
    // Validate user creation.
    // TODO: better email validation with !
    if (!email.includes("@")) {
        return [{ field: "email", message: "Invalid email address" }]
    }
    const passwordErrors = getPasswordErrors(password);
    if (passwordErrors) {
        return passwordErrors;
    }

    if (username.includes('@')) {
        return [{ field: "username", message: "Invalid character(s)" }]
    }

    return null;
}


export const getPasswordErrors = (password: string): FieldError[] | null => {
    if (password.length <= 5) {
        return [{ field: "password", message: "Password is too short" }]
    }
    return null;
}