"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
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
        <ModalHeader className="flex flex-col gap-1">
          Eliminar contraseña
        </ModalHeader>
        <ModalBody>
          <p className="text-default-600">
            ¿Estás seguro que querés eliminar la contraseña de{" "}
            <span className="font-semibold text-foreground">
              {record?.service}
            </span>
            ? Esta acción no se puede deshacer.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="danger"
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