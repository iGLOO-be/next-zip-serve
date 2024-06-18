import { catchRouteError } from "./catchRouteError";
import { verifyString } from "./jwt";
import { serveZipEntry, serveZipList } from "./serveZipEntry";
const secret = process.env.JWT_SECRET;

if (!secret) console.warn("JWT_SECRET is not set. JWTs will not be verified.");

export const serveEntry = (
  zip: string,
  entry: string,
  {
    secret,
  }: {
    secret?: string;
  } = {}
) =>
  catchRouteError(async () =>
    serveZipEntry(await verifyString(zip, secret), entry)
  );

export const serveList = (
  zip: string,
  {
    secret,
  }: {
    secret?: string;
  } = {}
) => catchRouteError(async () => serveZipList(await verifyString(zip, secret)));
