import { redirect } from "next/navigation";

import AddAppModal from "@/components/CreateAppModal";
import { title } from "@/components/primitives";
import { prisma } from "@/prisma";
import AppLauncher from "@/components/AppLauncher";
import { getDomain } from "@/middleware";

export default async function Home() {
  const data = await prisma.app.findMany();
  const domain = await getDomain();

  async function addApp(name: string, port: number, image: Uint8Array) {
    "use server";
    await prisma.app.create({
      data: {
        name,
        port,
        image
      }
    });
    redirect("/");
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <span className={title()}>Your installed apps</span>
      <div className="flex flex-row items-center gap-4">
        {data.map((app) => (
          <AppLauncher key={app.id} props={{ ...app, domain }} />
        ))}
      </div>
      <AddAppModal addApp={addApp} />
    </section>
  );
}
