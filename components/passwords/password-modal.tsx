"use client";

import { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordRecordSchema, PasswordRecordInput } from "@/lib/validations";
import { CATEGORIES, PasswordRecord } from "@/types";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PasswordRecordInput) => Promise<void>;
  record?: PasswordRecord | null;
  isLoading: boolean;
}

export function PasswordModal({
  isOpen,
  onClose,
  onSubmit,
  record,
  isLoading,
}: PasswordModalProps) {
  const isEditing = !!record;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PasswordRecordInput>({
    resolver: zodResolver(passwordRecordSchema),
    defaultValues: {
      category: "Otros",
    },
  });

  useEffect(() => {
    if (record) {
      setValue("service", record.service);
      setValue("username", record.username);
      setValue("password", record.password);
      setValue("category", record.category);
    } else {
      reset({ category: "Otros" });
    }
  }, [record, setValue, reset]);

  const handleClose = () => {
    reset({ category: "Otros" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" placement="center">
      <ModalContent>
        <ModalHeader>
          {isEditing ? "Editar contraseña" : "Nueva contraseña"}
        </ModalHeader>
        <ModalBody>
          <form
            id="password-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input
              {...register("service")}
              label="Servicio"
              placeholder="Netflix, GitHub, Gmail..."
              variant="bordered"
              isInvalid={!!errors.service}
              errorMessage={errors.service?.message}
            />

            <Input
              {...register("username")}
              label="Usuario o Email"
              placeholder="tu@email.com"
              variant="bordered"
              isInvalid={!!errors.username}
              errorMessage={errors.username?.message}
            />

            <Input
              {...register("password")}
              label="Contraseña"
              placeholder="••••••••"
              type="text"
              variant="bordered"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />

            <Select
              {...register("category")}
              label="Categoría"
              placeholder="Seleccioná una categoría"
              variant="bordered"
              isInvalid={!!errors.category}
              errorMessage={errors.category?.message}
              defaultSelectedKeys={[record?.category ?? "Otros"]}
            >
              {CATEGORIES.filter((c) => c !== "Todos").map((cat) => (
                <SelectItem key={cat}>
                  {cat}
                </SelectItem>
              ))}
            </Select>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            type="submit"
            form="password-form"
            isLoading={isLoading}
          >
            {isEditing ? "Guardar cambios" : "Agregar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}