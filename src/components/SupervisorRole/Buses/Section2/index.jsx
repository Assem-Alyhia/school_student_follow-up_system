// src/components/SupervisorRole/Buses/Section2.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationSection from "../../../../layout/PaginationSection";
import Section1 from "../Section1";
import { getSupervisorBuses } from "../../../../api/Supervisor/Buses/getSupervisorBuses";

export default function Section2() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(9); // 3×3 مثل الصورة

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["supervisor-buses", page, rowsPerPage],
        queryFn: () => getSupervisorBuses(page, rowsPerPage),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    if (isLoading) return <div style={{ padding: 16 }}>جاري التحميل…</div>;
    if (isError) return <div style={{ padding: 16, color: "crimson" }}>خطأ: {error?.message}</div>;

    const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    const total = Number(data?.meta?.total ?? rows.length);
    const lastPage = Number(
        data?.meta?.last_page ??
        Math.max(1, Math.ceil(total / (Number(data?.meta?.per_page ?? rowsPerPage) || 1)))
    );

    const handleOpenMap = (bus) => {
        console.log("Open map for bus:", bus);
    };

    return (
        <>
            <Section1 buses={rows} onOpenMap={handleOpenMap} />

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
