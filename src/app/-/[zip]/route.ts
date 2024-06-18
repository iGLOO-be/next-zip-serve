import { join } from "path";
import { serveList } from "../../../lib/serve";

export async function GET(
  request: Request,
  { params: { zip } }: { params: { zip: string } }
) {
  return serveList(zip, {
    secret: process.env.JWT_SECRET,
    cacheDir: process.env.CACHE_DIR || join(process.cwd(), ".cache"),
  });
}
