import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import NextImage from "next/image";
import { redirect } from "next/navigation";

import EditAppModal from "./EditAppModal";

import { App } from "@/types";
import { prisma } from "@/prisma";

type AppLauncherProps = {
  props: App;
};

export default function AppLauncher({ props }: AppLauncherProps) {
  const { name, port, image, domain } = props;
  const base64String =
    "data:image/png;base64," + Buffer.from(image).toString("base64");

  async function editApp(
    id: string,
    name: string,
    port: number,
    image?: Uint8Array | undefined
  ) {
    "use server";
    const updateData: { name: string; port: number; image?: Uint8Array } = {
      name,
      port
    };

    if (image) {
      updateData.image = image;
    }

    await prisma.app.update({
      where: {
        id
      },
      data: updateData
    });
    redirect("/");
  }

  return (
    <div className="group relative gap-2 border border-default p-2 rounded-xl hover:-translate-y-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary">
      <Link isExternal href={`${domain}:${port}`}>
        <Image
          alt={`${name} icon`}
          as={NextImage}
          className="rounded-xl"
          height={75}
          src={base64String}
          width={75}
        />
      </Link>
      <EditAppModal app={props} editApp={editApp} />
    </div>
  );
}
