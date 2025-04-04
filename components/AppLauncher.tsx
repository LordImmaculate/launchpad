import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import NextImage from "next/image";
import { redirect } from "next/navigation";
import { getAverageColor } from "fast-average-color-node";

import EditAppModal from "./EditAppModal";

import { App } from "@/types";
import { prisma } from "@/prisma";

type AppLauncherProps = {
  props: ExtendedApp;
};

type ExtendedApp = App & {
  domain: string;
};

export default async function AppLauncher({ props }: AppLauncherProps) {
  const { name, port, image } = props;
  const base64String =
    "data:image/png;base64," + Buffer.from(image).toString("base64");

  const averageColor = await getAverageColor(Buffer.from(image));

  let domain = props.domain;

  if (port.toString().includes("443")) {
    domain = "https://" + domain;
  } else {
    domain = "http://" + domain;
  }

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

  async function deleteApp(id: string) {
    "use server";
    await prisma.app.delete({
      where: { id }
    });
    redirect("/");
  }

  return (
    <div
      className="group relative gap-2 border border-default p-2 rounded-xl hover:-translate-y-2 transition-all duration-300"
      style={{ boxShadow: `0px 4px 10px ${averageColor.rgba}` }}
    >
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
      <EditAppModal app={props} deleteApp={deleteApp} editApp={editApp} />
    </div>
  );
}
