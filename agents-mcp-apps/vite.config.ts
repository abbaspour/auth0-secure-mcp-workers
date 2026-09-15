// @ts-ignore
import path from "node:path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const ROOT = process.env.UI_ROOT;
if (!ROOT) {
    throw new Error("UI_ROOT environment variable is not set");
}

export default defineConfig({
    root: ROOT,
    plugins: [viteSingleFile()],
    build: {
        outDir: path.resolve(process.env.OUTDIR ?? "dist-ui"),
        emptyOutDir: false,
        rollupOptions: {
            input: path.resolve(ROOT, "mcp-app.html"),
        },
    },
});
