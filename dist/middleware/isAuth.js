"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const isAuth = ({ context }, next) => {
    if (!context.req.session.uuid) {
        throw new Error("Not authenticated");
    }
    return next();
};
exports.isAuth = isAuth;
