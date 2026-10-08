// Components guard dev-only warnings with `process.env.NODE_ENV`, which bundlers replace;
// declare just that much instead of pulling in Node's types.
declare const process: { env: { NODE_ENV?: string } };
