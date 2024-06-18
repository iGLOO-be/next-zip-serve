import yauzl from "yauzl";
import mime from "mime-types";
import etag from "etag";

const cacheControl = "public, max-age=31536000"; // 1 year

export async function serveZipList(zipBuffer: Buffer) {
  const entries = await listZip(zipBuffer);
  return new Response(JSON.stringify(entries), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": cacheControl,
      "Last-Modified": new Date().toUTCString(),
      ETag: etag(Buffer.from(entries.join(","))),
    },
  });
}

export async function serveZipEntry(zipBuffer: Buffer, entry: string) {
  const zipEntry = await searchEntry(zipBuffer, entry);

  if (!zipEntry) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": cacheControl,
        "Last-Modified": new Date().toUTCString(),
        ETag: etag(Buffer.from("Not found")),
      },
    });
  }

  const { data, type } = zipEntry;
  return new Response(data, {
    headers: {
      "Content-Type": type,
      "Content-Length": data.length.toString(),
      "Cache-Control": cacheControl,
      "Last-Modified": new Date().toUTCString(),
      ETag: etag(data),
    },
  });
}

const searchEntry = async (zip: Buffer, entryName: string) => {
  return new Promise<
    | {
        data: Buffer;
        type: string;
      }
    | undefined
  >((resolve, reject) => {
    yauzl.fromBuffer(zip, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        reject(err);
        return;
      }

      zipfile.readEntry();
      zipfile.on("entry", (entry) => {
        if (entry.fileName === entryName) {
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) {
              reject(err);
              return;
            }

            const chunks: Buffer[] = [];
            readStream.on("data", (chunk) => {
              chunks.push(chunk);
            });
            readStream.on("end", () => {
              resolve({
                data: Buffer.concat(chunks),
                type: mime.lookup(entryName) || "application/octet-stream",
              });
            });
          });
        } else {
          zipfile.readEntry();
        }
      });
      zipfile.on("end", () => {
        resolve(undefined);
      });
    });
  });
};

const listZip = async (zip: Buffer) => {
  return new Promise<string[]>((resolve, reject) => {
    yauzl.fromBuffer(zip, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        reject(err);
        return;
      }

      const entries: string[] = [];
      zipfile.readEntry();
      zipfile.on("entry", (entry) => {
        entries.push(entry.fileName);
        zipfile.readEntry();
      });
      zipfile.on("end", () => {
        resolve(entries);
      });
    });
  });
};
