// src/components/SupervisorRole/Students/Section3.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationSection from "../../../../layout/PaginationSection";
import Section2 from "../Section2";
import { getSupervisorStudents } from './../../../../api/Supervisor/Students/getSupervisorStudents';

export default function Section3() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["supervisor-students", page, rowsPerPage],
        queryFn: () => getSupervisorStudents(page, rowsPerPage),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    if (isLoading) return <div style={{ padding: 16 }}>جاري التحميل…</div>;
    if (isError) return <div style={{ padding: 16 }}>خطأ: {error?.message}</div>;

    const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    const total = Number(data?.meta?.total ?? rows.length);
    const lastPage = Number(
        data?.meta?.last_page ?? Math.max(1, Math.ceil(total / (Number(data?.meta?.per_page ?? rowsPerPage) || 1)))
    );

    return (
        <>
            <Section2 students={rows} />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                lastPage={lastPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setPage(1);
                }}
            />
        </>
    );
}
