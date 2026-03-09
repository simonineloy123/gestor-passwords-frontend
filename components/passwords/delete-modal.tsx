"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@heroui/react";
import { PasswordRecord } from "@/types";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  record: PasswordRecord | null;
  isLoading: boolean;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  record,
  isLoading,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-0.5 pb-0">
          <span className="text-base font-semibold">Eliminar contraseña</span>
          <span className="text-xs text-default-400 font-normal">Esta acción no se puede deshacer</span>
        </ModalHeader>
        <Divider className="mt-3 opacity-50" />
        <ModalBody className="py-4">
          <p className="text-sm text-default-500">
            ¿Estás seguro que querés eliminar la contraseña de{" "}
            <span className="font-semibold text-foreground">
              {record?.service}
            </span>
            ?
          </p>
        </ModalBody>
        <Divider className="opacity-50" />
        <ModalFooter className="pt-3">
          <Button variant="light" size="sm" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="danger"
            size="sm"
            onPress={onConfirm}
            isLoading={isLoading}
          >
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}