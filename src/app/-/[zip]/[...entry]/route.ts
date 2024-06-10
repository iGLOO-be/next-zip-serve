import { verifyString } from "@/lib/jwt";
import { catchRouteError } from "@/lib/route";
import { serveZipEntry } from "@/lib/serveZipEntry";

export async function GET(
  request: Request,
  { params: { zip, entry } }: { params: { zip: string; entry: string[] } }
) {
  return catchRouteError(async () =>
    serveZipEntry(await verifyString(zip), entry.join("/"))
  );
}
