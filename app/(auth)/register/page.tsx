"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Link } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerSchema, RegisterInput } from "@/lib/validations";
import { authService } from "@/lib/services";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      await authService.register(data.email, data.password);
      toast.success("Cuenta creada correctamente. Iniciá sesión!");
      router.push("/login");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al registrarse";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background p-4"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit(onSubmit)();
        }
      }}
      tabIndex={-1}
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">PassVault</h1>
          <p className="text-default-400 text-xs">Creá tu cuenta gratuita</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
        >
          <Input
            {...register("email")}
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
                (e.target as HTMLInputElement).value += " ";
              }
            }}
            onClick={(e) => (e.target as HTMLInputElement).select()}
            label="Email"
            placeholder="Escribe tu correo aqui..."
            type="email"
            variant="bordered"
            size="sm"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            classNames={{
              inputWrapper: "border-divider",
              input: "select-all",
            }}
            startContent={
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
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            }
          />

          <Input
            {...register("password")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
            label="Contraseña"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            variant="bordered"
            size="sm"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            classNames={{
              inputWrapper: "border-divider",
              input: "select-all",
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

          <Input
            {...register("confirmPassword")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
            label="Confirmar contraseña"
            placeholder="••••••••"
            type={showConfirm ? "text" : "password"}
            variant="bordered"
            size="sm"
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
            classNames={{
              inputWrapper: "border-divider",
              input: "select-all",
            }}
            endContent={
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="flex items-center pb-2"
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />

          <Button
            type="submit"
            color="primary"
            size="sm"
            className="w-full font-medium mt-1"
            isLoading={isLoading}
          >
            Crear cuenta
          </Button>

          <p className="text-center text-xs text-default-400">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" size="sm" className="text-xs">
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
