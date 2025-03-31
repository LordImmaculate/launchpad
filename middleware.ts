import { headers } from "next/headers";

export async function getDomain() {
  let host = (await headers()).get("host");

  host = host ? host.split(":")[0] : "localhost";
  host = "https://" + host;

  return host;
}

export default async function middleware() {}
