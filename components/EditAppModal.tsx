"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { FaPen } from "react-icons/fa";
import { useState } from "react";

import { App } from "@/types";

type EditAppModalProps = {
  editApp: (
    id: string,
    name: string,
    port: number,
    image?: Uint8Array
  ) => Promise<void>;
  app: App;
};

export default function EditAppModal({ editApp, app }: EditAppModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState(app.name);
  const [port, setPort] = useState(app.port);

  async function editAppHandler(formData: FormData) {
    const data = Object.fromEntries(formData);

    let image = formData.get("image") as File;
    let convertedImage: Uint8Array | undefined;

    image.size > 0
      ? (convertedImage = new Uint8Array(await image.arrayBuffer()))
      : (convertedImage = undefined);

    onOpenChange();
    await editApp(
      app.id,
      data.name as string,
      parseInt(data.port as string),
      convertedImage
    );
  }

  return (
    <>
      <Button
        isIconOnly
        className="absolute top-1 right-1 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        color="primary"
        size="sm"
        onPress={onOpen}
      >
        <FaPen />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit &quot;{app.name}&quot;
              </ModalHeader>
              <Form action={editAppHandler}>
                <ModalBody className="flex w-full gap-4 items-center">
                  <Input
                    required
                    label="Name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    required
                    label="Port"
                    max={65535}
                    min={1}
                    name="port"
                    step={1}
                    type="number"
                    value={port as unknown as string}
                    onChange={(e) => setPort(parseInt(e.target.value))}
                  />
                  <Input
                    accept="image/png, image/jpeg, image/webp"
                    className="w-fit"
                    label="Image"
                    name="image"
                    type="file"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" type="submit">
                    Edit App
                  </Button>
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
