import { headers } from "next/headers";

export async function getDomain() {
  let host = (await headers()).get("host");

  host = host ? host.split(":")[0] : "localhost";

  return host;
}

export default async function middleware() {}
