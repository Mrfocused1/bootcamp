import type { NextConfig } from "next";

// The marketing site is now fully native React (app/(marketing)/*). The former
// static clone under public/site/ and its rewrites have been removed.
const nextConfig: NextConfig = {
  // A parent-dir package-lock.json makes Next infer the wrong workspace root.
  // Pin it to this project so the build/dev don't trace files outside the app.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
