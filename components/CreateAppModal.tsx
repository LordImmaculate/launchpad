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

type AddAppModalProps = {
  addApp: (name: string, port: number, image: Uint8Array) => Promise<void>;
};

export default function AddAppModal({ addApp }: AddAppModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function addAppHandler(formData: FormData) {
    const data = Object.fromEntries(formData);

    let image = formData.get("image") as File;

    const imageConvert = new Uint8Array(await image.arrayBuffer());

    onOpenChange();
    await addApp(
      data.name as string,
      parseInt(data.port as string),
      imageConvert
    );
  }

  return (
    <>
      <Button onPress={onOpen}>Add App</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add an App
              </ModalHeader>
              <Form action={addAppHandler}>
                <ModalBody className="flex w-full gap-4 items-center">
                  <Input required label="Name" name="name" type="text" />
                  <Input
                    required
                    accept="image/png, image/jpeg, image/webp"
                    label="Port"
                    max={65535}
                    min={1}
                    name="port"
                    step={1}
                    type="number"
                  />
                  <Input
                    required
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
                    Add App
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
