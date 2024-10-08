/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    images:{
        domains: ['lh5.googleusercontent.com','streetviewpixels-pa.googleapis.com'],

    }
};

export default config;
