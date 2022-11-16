import { FieldError } from "src/types";

export const getRegisterErrors = (email: string, password: string, name: string): FieldError[] | null => {
    // Validate user creation.
    // TODO: better email validation with !
    if (!email.includes("@")) {
        return [{ field: "email", message: "Invalid email address" }]
    }
    const passwordErrors = getPasswordErrors(password);
    if (passwordErrors) {
        return passwordErrors;
    }

    if (name.includes('@')) {
        return [{ field: "name", message: "Invalid character(s)" }]
    }
    if (!name.includes(' ')) {
        return [{ field: "name", message: "Please enter your full name" }]
    }

    return null;
}


export const getPasswordErrors = (password: string): FieldError[] | null => {
    if (password.length <= 5) {
        return [{ field: "password", message: "Password is too short" }]
    }
    return null;
}