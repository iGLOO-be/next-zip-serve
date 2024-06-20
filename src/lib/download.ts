import fs from "fs/promises";
import sanitize from "sanitize-filename";
import pMemoize from "p-memoize";

export const download = pMemoize(
  async (
    zip: string,
    {
      cacheDir,
    }: {
      cacheDir?: string;
    } = {}
  ) => {
    console.log("Downloading zip file", zip);

    const cachePath = cacheDir && `${cacheDir}/${sanitize(zip)}`;
    if (cachePath) {
      console.log("Using cache path", cachePath);
    } else {
      console.warn("Cache is disabled!");
    }

    if (cachePath && cacheDir) {
      await fs.mkdir(cacheDir, { recursive: true });
      try {
        const file = await fs.readFile(cachePath);
        console.log("Using cached zip file", zip);
        return file;
      } catch (e) {}
    }

    const res = await fetch(zip);
    if (!res.ok) {
      const error = new Error("fetch failed");
      error.cause = res.statusText;
      throw error;
    }
    const blob = await res.blob();
    const buffer = Buffer.from(await new Response(blob).arrayBuffer());

    if (cachePath) {
      await fs.writeFile(cachePath, buffer);
    }

    return buffer;
  }
);
