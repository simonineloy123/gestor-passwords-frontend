"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Input,
  Tooltip,
} from "@heroui/react";
import { PasswordRecord, CATEGORIES } from "@/types";
import { PasswordCell } from "@/components/ui/password-cell";

interface PasswordsTableProps {
  records: PasswordRecord[];
  onEdit: (record: PasswordRecord) => void;
  onDelete: (record: PasswordRecord) => void;
  isLoading: boolean;
}

const ROWS_PER_PAGE = 8;

const CATEGORY_COLORS: Record<string, "primary" | "secondary" | "success" | "warning" | "danger" | "default"> = {
  Streaming: "danger",
  "Redes Sociales": "primary",
  Educacion: "success",
  Gubernamental: "warning",
  Trabajo: "secondary",
  Finanzas: "success",
  Compras: "primary",
  Gaming: "secondary",
  Salud: "danger",
  Otros: "default",
};

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function PasswordsTable({
  records,
  onEdit,
  onDelete,
  isLoading,
}: PasswordsTableProps) {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchesCategory =
        selectedCategory === "Todos" || r.category === selectedCategory;
      const matchesSearch =
        r.service.toLowerCase().includes(search.toLowerCase()) ||
        r.username.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [records, selectedCategory, search]);

  const pages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar por servicio o usuario..."
          value={search}
          onValueChange={handleSearch}
          className="w-full sm:max-w-sm"
          variant="bordered"
          size="sm"
          classNames={{ inputWrapper: "border-divider" }}
          startContent={
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-400">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          }
        />
        <Select
          placeholder="Categoría"
          selectedKeys={[selectedCategory]}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full sm:max-w-44"
          variant="bordered"
          size="sm"
          classNames={{ trigger: "border-divider" }}
        >
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat}>{cat}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <Table
          aria-label="Tabla de contraseñas"
          removeWrapper
          classNames={{
            th: "bg-default-50 text-default-500 font-medium text-xs uppercase tracking-wider",
            td: "py-3",
          }}
          bottomContent={
            pages > 1 && (
              <div className="flex justify-center py-3 border-t border-divider">
                <Pagination
                  page={page}
                  total={pages}
                  onChange={setPage}
                  color="primary"
                  showControls
                  size="sm"
                  variant="light"
                />
              </div>
            )
          }
        >
          <TableHeader>
            <TableColumn>SERVICIO</TableColumn>
            <TableColumn>USUARIO</TableColumn>
            <TableColumn>CONTRASEÑA</TableColumn>
            <TableColumn>CATEGORÍA</TableColumn>
            <TableColumn>ULT. MODIFICACION</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody
            items={paginated}
            isLoading={isLoading}
            emptyContent={
              <div className="flex flex-col items-center gap-2 py-8 text-default-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <p className="text-sm">No hay contraseñas guardadas todavía</p>
              </div>
            }
          >
            {(record) => (
              <TableRow key={record.id} className="border-b border-divider hover:bg-default-50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm">{record.service}</span>
                    {record.googleLogin && (
                      <Tooltip content="Permite login con Google" size="sm">
                        <span className="cursor-default"><GoogleIcon /></span>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-default-500 select-all">{record.username}</span>
                </TableCell>
                <TableCell>
                  <PasswordCell password={record.password} />
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={CATEGORY_COLORS[record.category] ?? "default"}
                    variant="flat"
                    classNames={{ base: "h-5", content: "text-xs px-1" }}
                  >
                    {record.category}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-default-400 tabular-nums">
                    {formatDate(record.updatedAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Tooltip content="Editar" size="sm">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onEdit(record)}
                        aria-label="Editar"
                        className="text-default-400 hover:text-warning"
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Eliminar" size="sm" color="danger">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => onDelete(record)}
                        aria-label="Eliminar"
                        className="text-default-400 hover:text-danger"
                      >
                        <TrashIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}