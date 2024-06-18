import { catchRouteError } from "./catchRouteError";
import { download } from "./download";
import { verifyString } from "./jwt";
import { serveZipEntry, serveZipList } from "./serveZipEntry";

export const serveEntry = (
  zip: string,
  entry: string,
  {
    secret,
    cacheDir,
  }: {
    secret?: string;
    cacheDir?: string;
  } = {}
) =>
  catchRouteError(async () =>
    serveZipEntry(
      await download(await verifyString(zip, secret), {
        cacheDir,
      }),
      entry
    )
  );

export const serveList = (
  zip: string,
  {
    secret,
    cacheDir,
  }: {
    secret?: string;
    cacheDir?: string;
  } = {}
) =>
  catchRouteError(async () =>
    serveZipList(
      await download(await verifyString(zip, secret), {
        cacheDir,
      })
    )
  );
