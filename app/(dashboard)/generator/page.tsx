"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Slider,
  Switch,
  Input,
  Divider,
} from "@heroui/react";
import { toast } from "sonner";

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function GeneratorPage() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<"weak" | "medium" | "strong" | "">("");

  const calculateStrength = (pwd: string, opts: PasswordOptions) => {
    const activeTypes = [opts.uppercase, opts.lowercase, opts.numbers, opts.symbols].filter(Boolean).length;
    if (pwd.length < 8 || activeTypes < 2) return "weak";
    if (pwd.length < 12 || activeTypes < 3) return "medium";
    return "strong";
  };

  const generatePassword = useCallback(() => {
    let charset = "";
    if (options.uppercase) charset += UPPERCASE;
    if (options.lowercase) charset += LOWERCASE;
    if (options.numbers) charset += NUMBERS;
    if (options.symbols) charset += SYMBOLS;

    if (!charset) {
      toast.error("Seleccioná al menos un tipo de caracter");
      return;
    }

    let generated = "";
    // Garantizar al menos un caracter de cada tipo seleccionado
    if (options.uppercase) generated += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
    if (options.lowercase) generated += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
    if (options.numbers) generated += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    if (options.symbols) generated += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    // Completar el resto
    for (let i = generated.length; i < options.length; i++) {
      generated += charset[Math.floor(Math.random() * charset.length)];
    }

    // Mezclar para evitar que los caracteres garantizados siempre estén al inicio
    const shuffled = generated.split("").sort(() => Math.random() - 0.5).join("");
    setPassword(shuffled);
    setStrength(calculateStrength(shuffled, options));
  }, [options]);

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    toast.success("Contraseña copiada al portapapeles");
  };

  const strengthConfig = {
    weak:   { label: "Débil",   color: "bg-danger",  width: "w-1/3" },
    medium: { label: "Media",   color: "bg-warning",  width: "w-2/3" },
    strong: { label: "Fuerte",  color: "bg-success",  width: "w-full" },
    "":     { label: "",        color: "",             width: "w-0" },
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Generador de Contraseñas</h1>
        <p className="text-default-500 text-sm mt-1">
          Creá contraseñas seguras y aleatorias
        </p>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <h2 className="text-base font-semibold">Contraseña generada</h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          {/* Password output */}
          <div className="flex gap-2">
            <Input
              value={password}
              readOnly
              placeholder="Hacé click en Generar..."
              variant="bordered"
              className="font-mono"
            />
            <Button
              isIconOnly
              variant="bordered"
              onPress={copyToClipboard}
              isDisabled={!password}
              aria-label="Copiar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            </Button>
          </div>

          {/* Strength indicator */}
          {strength && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-default-500">
                <span>Fortaleza</span>
                <span className={
                  strength === "strong" ? "text-success" :
                  strength === "medium" ? "text-warning" : "text-danger"
                }>
                  {strengthConfig[strength].label}
                </span>
              </div>
              <div className="w-full h-1.5 bg-default-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strengthConfig[strength].color} ${strengthConfig[strength].width}`} />
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader className="pb-0">
          <h2 className="text-base font-semibold">Opciones</h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-5">
          {/* Length */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-sm">Longitud</span>
              <span className="text-sm font-semibold text-primary">{options.length}</span>
            </div>
            <Slider
              minValue={6}
              maxValue={64}
              value={options.length}
              onChange={(val) => setOptions({ ...options, length: val as number })}
              color="primary"
              size="sm"
            />
            <div className="flex justify-between text-xs text-default-400">
              <span>6</span>
              <span>64</span>
            </div>
          </div>

          <Divider />

          {/* Character types */}
          <div className="flex flex-col gap-3">
            <span className="text-sm text-default-500">Tipos de caracteres</span>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Mayúsculas</p>
                <p className="text-xs text-default-400">A, B, C...</p>
              </div>
              <Switch
                isSelected={options.uppercase}
                onValueChange={(val) => setOptions({ ...options, uppercase: val })}
                color="primary"
                size="sm"
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Minúsculas</p>
                <p className="text-xs text-default-400">a, b, c...</p>
              </div>
              <Switch
                isSelected={options.lowercase}
                onValueChange={(val) => setOptions({ ...options, lowercase: val })}
                color="primary"
                size="sm"
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Números</p>
                <p className="text-xs text-default-400">0, 1, 2...</p>
              </div>
              <Switch
                isSelected={options.numbers}
                onValueChange={(val) => setOptions({ ...options, numbers: val })}
                color="primary"
                size="sm"
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Símbolos</p>
                <p className="text-xs text-default-400">!, @, #...</p>
              </div>
              <Switch
                isSelected={options.symbols}
                onValueChange={(val) => setOptions({ ...options, symbols: val })}
                color="primary"
                size="sm"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Generate button */}
      <Button
        color="primary"
        size="lg"
        onPress={generatePassword}
        className="font-semibold"
        startContent={
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
          </svg>
        }
      >
        Generar contraseña
      </Button>
    </div>
  );
}