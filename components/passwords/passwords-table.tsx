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
      {/* Filters */}
      <div className="flex gap-3 items-center">
        <Input
          placeholder="Buscar por servicio o usuario..."
          value={search}
          onValueChange={handleSearch}
          className="max-w-sm"
          variant="bordered"
          startContent={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-400">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          }
        />
        <Select
          placeholder="Categoría"
          selectedKeys={[selectedCategory]}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="max-w-48"
          variant="bordered"
        >
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat}>
              {cat}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Table */}
      <Table
        aria-label="Tabla de contraseñas"
        bottomContent={
          pages > 1 && (
            <div className="flex justify-center py-2">
              <Pagination
                page={page}
                total={pages}
                onChange={setPage}
                color="primary"
                showControls
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
          emptyContent="No hay contraseñas guardadas todavía."
        >
          {(record) => (
            <TableRow key={record.id}>
              <TableCell>
                <span className="font-medium">{record.service}</span>
              </TableCell>
              <TableCell>
                <span className="text-default-600">{record.username}</span>
              </TableCell>
              <TableCell>
                <PasswordCell password={record.password} />
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  color={CATEGORY_COLORS[record.category] ?? "default"}
                  variant="flat"
                >
                  {record.category}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => onEdit(record)}
                    aria-label="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                    </svg>
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => onDelete(record)}
                    aria-label="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}