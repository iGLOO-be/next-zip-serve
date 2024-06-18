import { serveEntry } from "../../../../lib/serve";

export async function GET(
  request: Request,
  { params: { zip, entry } }: { params: { zip: string; entry: string[] } }
) {
  return serveEntry(zip, entry.join("/"), {
    secret: process.env.JWT_SECRET,
  });
}
