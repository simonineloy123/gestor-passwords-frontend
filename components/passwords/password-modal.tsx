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
  Divider,
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
    defaultValues: { category: "Otros" },
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
        <ModalHeader className="flex flex-col gap-0.5 pb-0">
          <span className="text-base font-semibold">
            {isEditing ? "Editar contraseña" : "Nueva contraseña"}
          </span>
          <span className="text-xs text-default-400 font-normal">
            {isEditing ? "Modificá los datos del registro" : "Completá los datos del nuevo registro"}
          </span>
        </ModalHeader>
        <Divider className="mt-3 opacity-50" />
        <ModalBody className="py-4">
          <form
            id="password-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <Input
              {...register("service")}
              label="Servicio"
              placeholder="Netflix, GitHub, Gmail..."
              variant="bordered"
              size="sm"
              isInvalid={!!errors.service}
              errorMessage={errors.service?.message}
              classNames={{
                inputWrapper: "border-divider",
                input: "select-all",
              }}
            />
            <Input
              {...register("username")}
              label="Usuario o Email"
              placeholder="tu@email.com"
              variant="bordered"
              size="sm"
              isInvalid={!!errors.username}
              errorMessage={errors.username?.message}
              classNames={{
                inputWrapper: "border-divider",
                input: "select-all",
              }}
            />
            <Input
              {...register("password")}
              label="Contraseña"
              placeholder="••••••••"
              type="text"
              variant="bordered"
              size="sm"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              classNames={{
                inputWrapper: "border-divider",
                input: "select-all font-mono",
              }}
            />
            <Select
              {...register("category")}
              label="Categoría"
              placeholder="Seleccioná una categoría"
              variant="bordered"
              size="sm"
              isInvalid={!!errors.category}
              errorMessage={errors.category?.message}
              defaultSelectedKeys={[record?.category ?? "Otros"]}
              classNames={{ trigger: "border-divider" }}
            >
              {CATEGORIES.filter((c) => c !== "Todos").map((cat) => (
                <SelectItem key={cat}>{cat}</SelectItem>
              ))}
            </Select>
          </form>
        </ModalBody>
        <Divider className="opacity-50" />
        <ModalFooter className="pt-3">
          <Button variant="light" size="sm" onPress={handleClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            size="sm"
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