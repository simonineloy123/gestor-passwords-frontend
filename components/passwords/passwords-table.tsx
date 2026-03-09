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
                  <span className="font-medium text-sm">{record.service}</span>
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