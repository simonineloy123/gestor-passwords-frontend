"use client";

import { useEffect, useState } from "react";
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
  Checkbox,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { PasswordRecordInput } from "@/lib/validations";
import { CATEGORIES, PasswordRecord } from "@/types";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PasswordRecordInput) => Promise<void>;
  record?: PasswordRecord | null;
  isLoading: boolean;
}

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-default-400"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-default-400"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

export function PasswordModal({
  isOpen,
  onClose,
  onSubmit,
  record,
  isLoading,
}: PasswordModalProps) {
  const isEditing = !!record;
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<PasswordRecordInput>({
    defaultValues: {
      service: "",
      username: "",
      password: "",
      category: "Otros",
      googleLogin: false,
    },
  });

  const categoryValue = watch("category");

  useEffect(() => {
    if (record) {
      reset({
        service: record.service,
        username: record.username,
        password: record.password,
        category: record.category,
        googleLogin: record.googleLogin ?? false,
      });
    } else {
      reset({
        service: "",
        username: "",
        password: "",
        category: "Otros",
        googleLogin: false,
      });
    }
    setShowPassword(false);
  }, [record, reset, isOpen]);

  const handleClose = () => {
    reset({
      service: "",
      username: "",
      password: "",
      category: "Otros",
      googleLogin: false,
    });
    setShowPassword(false);
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
            {isEditing
              ? "Modificá los datos del registro"
              : "Completá los datos del nuevo registro"}
          </span>
        </ModalHeader>
        <Divider className="mt-3 opacity-50" />
        <ModalBody className="py-4">
          <form
            id="password-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          >
            <Input
              {...register("service")}
              label="Servicio"
              placeholder="Netflix, GitHub, Gmail..."
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                  (e.target as HTMLInputElement).value += " ";
                }
              }}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              variant="bordered"
              size="sm"
              isInvalid={!!errors.service}
              errorMessage={errors.service?.message}
              classNames={{
                inputWrapper: "border-divider",
                input: "select-text cursor-text",
              }}
            />
            <Input
              {...register("username")}
              label="Usuario o Email"
              autoComplete="off"
              placeholder="Escribe tu correo o usuario aqui..."
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                  (e.target as HTMLInputElement).value += " ";
                }
              }}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              onChange={(e) => setValue("username", e.target.value)}
              variant="bordered"
              size="sm"
              isInvalid={!!errors.username}
              errorMessage={errors.username?.message}
              classNames={{
                inputWrapper: "border-divider",
                input: "select-text cursor-text",
              }}
            />
            <Input
              {...register("password")}
              label="Contraseña"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              variant="bordered"
              size="sm"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              classNames={{
                inputWrapper: "border-divider",
                input: "select-text cursor-text font-mono",
              }}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center pb-2"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  label="Categoría"
                  placeholder="Seleccioná una categoría"
                  variant="bordered"
                  size="sm"
                  isInvalid={!!errors.category}
                  errorMessage={errors.category?.message}
                  selectedKeys={[field.value]}
                  onChange={(e) => field.onChange(e.target.value)}
                  classNames={{ trigger: "border-divider" }}
                >
                  {CATEGORIES.filter((c) => c !== "Todos").map((cat) => (
                    <SelectItem key={cat}>{cat}</SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="googleLogin"
              control={control}
              render={({ field }) => (
                <Checkbox
                  isSelected={field.value}
                  onValueChange={field.onChange}
                  size="sm"
                  classNames={{
                    base: "mt-1",
                    label: "text-sm text-default-600",
                  }}
                >
                  <div className="flex flex-col gap-0">
                    <span className="text-sm font-medium">
                      Permite login con Google
                    </span>
                    <span className="text-xs text-default-400">
                      Podés acceder a este servicio con tu cuenta de Google
                    </span>
                  </div>
                </Checkbox>
              )}
            />
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
