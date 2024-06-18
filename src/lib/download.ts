import fs from "fs/promises";
import sanitize from "sanitize-filename";
import path from "path";
import pMemoize from "p-memoize";

const cacheDir = process.env.CACHE_DIR || path.join(process.cwd(), ".cache");

export const download = pMemoize(
  async (
    zip: string,
    {
      cacheDir,
    }: {
      cacheDir?: string;
    } = {}
  ) => {
    const cachePath = `${cacheDir}/${sanitize(zip)}`;

    if (cacheDir) {
      await fs.mkdir(cacheDir, { recursive: true });
      try {
        const file = await fs.readFile(cachePath);
        console.log("Using cached zip file", zip);
        return file;
      } catch (e) {}
    }

    console.log("Downloading zip file", zip);
    const res = await fetch(zip);
    if (!res.ok) {
      const error = new Error("fetch failed");
      error.cause = res.statusText;
      throw error;
    }
    const blob = await res.blob();
    const buffer = Buffer.from(await new Response(blob).arrayBuffer());

    if (!cacheDir) {
      await fs.writeFile(cachePath, buffer);
    }

    return buffer;
  }
);
