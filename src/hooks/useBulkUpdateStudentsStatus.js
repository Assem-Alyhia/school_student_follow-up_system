// src/hooks/useBulkUpdateStudentsStatus.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSupervisorStudent } from "../api/Supervisor/Students/updateSupervisorStudent";

export function useBulkUpdateStudentsStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ students, status }) => {
      await Promise.all(students.map((s) => updateSupervisorStudent(s.id, { status })));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["supervisor", "students"] });
    },
  });
}
