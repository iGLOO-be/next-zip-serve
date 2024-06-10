import { verifyString } from "@/lib/jwt";
import { catchRouteError } from "@/lib/route";
import { serveZipList } from "@/lib/serveZipEntry";

export async function GET(
  request: Request,
  { params: { zip } }: { params: { zip: string } }
) {
  return catchRouteError(async () => serveZipList(await verifyString(zip)));
}
