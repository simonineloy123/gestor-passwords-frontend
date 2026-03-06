"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { toast } from "sonner";
import { PasswordRecord } from "@/types";
import { passwordService } from "@/lib/services";
import { PasswordsTable } from "@/components/passwords/passwords-table";
import { PasswordModal } from "@/components/passwords/password-modal";
import { DeleteModal } from "@/components/passwords/delete-modal";
import { PasswordRecordInput } from "@/lib/validations";

export default function PasswordsPage() {
  const [records, setRecords] = useState<PasswordRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PasswordRecord | null>(null);

  // Cargar contraseñas al montar
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const data = await passwordService.getAll();
      setRecords(data);
    } catch (error) {
      toast.error("Error al cargar las contraseñas");
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir modal para agregar
  const handleAdd = () => {
    setSelectedRecord(null);
    setIsPasswordModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (record: PasswordRecord) => {
    setSelectedRecord(record);
    setIsPasswordModalOpen(true);
  };

  // Abrir modal para eliminar
  const handleDeleteClick = (record: PasswordRecord) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  // Crear o editar
  const handleSubmit = async (data: PasswordRecordInput) => {
    setIsSaving(true);
    try {
      if (selectedRecord) {
        const updated = await passwordService.update(selectedRecord.id, data);
        setRecords((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        );
        toast.success("Contraseña actualizada correctamente");
      } else {
        const created = await passwordService.create(data);
        setRecords((prev) => [created, ...prev]);
        toast.success("Contraseña agregada correctamente");
      }
      setIsPasswordModalOpen(false);
    } catch (error) {
      toast.error("Error al guardar la contraseña");
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar
  const handleConfirmDelete = async () => {
    if (!selectedRecord) return;
    setIsDeleting(true);
    try {
      await passwordService.delete(selectedRecord.id);
      setRecords((prev) => prev.filter((r) => r.id !== selectedRecord.id));
      toast.success("Contraseña eliminada correctamente");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Error al eliminar la contraseña");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis Contraseñas</h1>
          <p className="text-default-500 text-sm mt-1">
            {records.length} contraseña{records.length !== 1 ? "s" : ""} guardada{records.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          color="primary"
          onPress={handleAdd}
          startContent={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
          }
        >
          Nueva contraseña
        </Button>
      </div>

      {/* Table */}
      <PasswordsTable
        records={records}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      {/* Modals */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleSubmit}
        record={selectedRecord}
        isLoading={isSaving}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        record={selectedRecord}
        isLoading={isDeleting}
      />
    </div>
  );
}