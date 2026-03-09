"use client";

import { useState, useCallback } from "react";
import {
  Button,
  Slider,
  Input,
  Divider,
  Checkbox,
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
  const [copied, setCopied] = useState(false);
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
    if (options.uppercase) generated += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
    if (options.lowercase) generated += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
    if (options.numbers) generated += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    if (options.symbols) generated += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    for (let i = generated.length; i < options.length; i++) {
      generated += charset[Math.floor(Math.random() * charset.length)];
    }

    const shuffled = generated.split("").sort(() => Math.random() - 0.5).join("");
    setPassword(shuffled);
    setStrength(calculateStrength(shuffled, options));
  }, [options]);

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Contraseña copiada al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  const strengthConfig = {
    weak:   { label: "Débil",  color: "bg-danger",  width: "w-1/3" },
    medium: { label: "Media",  color: "bg-warning", width: "w-2/3" },
    strong: { label: "Fuerte", color: "bg-success", width: "w-full" },
    "":     { label: "",       color: "",            width: "w-0" },
  };

  const checkboxItems = [
    { key: "uppercase", label: "Mayúsculas", desc: "A, B, C..." },
    { key: "lowercase", label: "Minúsculas", desc: "a, b, c..." },
    { key: "numbers",   label: "Números",    desc: "0, 1, 2..." },
    { key: "symbols",   label: "Símbolos",   desc: "!, @, #..." },
  ] as const;

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-6 w-full max-w-lg">

        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-semibold tracking-tight">Generador de Contraseñas</h1>
          <p className="text-default-400 text-xs">Creá contraseñas seguras y aleatorias</p>
        </div>

        <Divider className="opacity-50" />

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              value={password}
              placeholder="Hacé click en Generar..."
              variant="bordered"
              size="sm"
              classNames={{
                inputWrapper: "border-divider",
                input: "font-mono text-sm select-all",
              }}
              readOnly
            />
            <Button
              isIconOnly
              variant="bordered"
              size="sm"
              onPress={copyToClipboard}
              isDisabled={!password}
              aria-label="Copiar"
              className={`border-divider ${copied ? "text-success" : "text-default-400"}`}
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
              )}
            </Button>
          </div>

          {strength && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-default-400">
                <span>Fortaleza</span>
                <span className={
                  strength === "strong" ? "text-success" :
                  strength === "medium" ? "text-warning" : "text-danger"
                }>
                  {strengthConfig[strength].label}
                </span>
              </div>
              <div className="w-full h-1 bg-default-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${strengthConfig[strength].color} ${strengthConfig[strength].width}`} />
              </div>
            </div>
          )}
        </div>

        <Divider className="opacity-50" />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Longitud</span>
              <span className="text-sm font-semibold text-primary tabular-nums">{options.length}</span>
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

          <Divider className="opacity-50" />

          <div className="flex flex-col gap-1">
            <span className="text-xs text-default-400 uppercase tracking-wider mb-2">Tipos de caracteres</span>
            <div className="grid grid-cols-2 gap-2">
              {checkboxItems.map((item) => (
                <Checkbox
                  key={item.key}
                  isSelected={options[item.key]}
                  onValueChange={(val) => setOptions({ ...options, [item.key]: val })}
                  color="primary"
                  size="sm"
                  classNames={{
                    base: "flex items-center gap-2 py-2 px-3 rounded-lg border border-divider hover:bg-default-50 transition-colors max-w-full",
                    label: "flex flex-col gap-0",
                  }}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-default-400">{item.desc}</span>
                </Checkbox>
              ))}
            </div>
          </div>
        </div>

        <Button
          color="primary"
          size="md"
          onPress={generatePassword}
          className="font-medium"
          startContent={
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
            </svg>
          }
        >
          Generar contraseña
        </Button>

      </div>
    </div>
  );
}