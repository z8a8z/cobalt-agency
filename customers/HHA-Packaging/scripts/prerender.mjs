import { readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const outputHtml = resolve(projectRoot, "dist/index.html");
const serverEntry = resolve(projectRoot, ".ssr/entry-server.js");
const { render } = await import(pathToFileURL(serverEntry));
const html = await readFile(outputHtml, "utf8");
const appHtml = render();
const marker = /<!--app-html-start-->[\s\S]*?<!--app-html-end-->/;

if (!marker.test(html)) {
  throw new Error("Static render markers were not found in dist/index.html");
}

await writeFile(outputHtml, html.replace(marker, () => `<!--app-html-start-->${appHtml}<!--app-html-end-->`));
await rm(resolve(projectRoot, ".ssr"), { recursive: true, force: true });
