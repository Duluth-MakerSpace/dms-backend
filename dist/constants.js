"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_SECRET = exports.FORGOT_PASS_PREFIX = exports.COOKIE_NAME = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.COOKIE_NAME = "dms_cookie";
exports.FORGOT_PASS_PREFIX = "oops-password:";
exports.SESSION_SECRET = "keyboard_cats_hide_in_env_var";
