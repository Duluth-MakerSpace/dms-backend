"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordErrors = exports.getRegisterErrors = void 0;
const getRegisterErrors = (email, password, name) => {
    if (!email.includes("@")) {
        return [{ field: "email", message: "Invalid email address" }];
    }
    const passwordErrors = (0, exports.getPasswordErrors)(password);
    if (passwordErrors) {
        return passwordErrors;
    }
    if (name.includes('@')) {
        return [{ field: "name", message: "Invalid character(s)" }];
    }
    if (!name.includes(' ')) {
        return [{ field: "name", message: "Please enter your full name" }];
    }
    return null;
};
exports.getRegisterErrors = getRegisterErrors;
const getPasswordErrors = (password) => {
    if (password.length <= 5) {
        return [{ field: "password", message: "Password is too short" }];
    }
    return null;
};
exports.getPasswordErrors = getPasswordErrors;
