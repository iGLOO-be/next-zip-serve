import { encryptString } from "../../../lib/jwt";
import ClientPage from "./clientPage";

export default function Page() {
  async function encryptStringOnServer(value: string) {
    "use server";
    if (process.env.NODE_ENV !== "development") {
      throw new Error("encryptString is only available in development mode");
    }
    return encryptString(value);
  }

  if (process.env.NODE_ENV !== "development") {
    return <p>encryptString is only available in development mode</p>;
  }

  return <ClientPage encryptString={encryptStringOnServer} />;
}
