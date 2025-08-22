// src/components/Admin/Supervisors/Section3.jsx
import React, { useState } from "react";
import PaginationSection from "../../../layout/PaginationSection";
import { useQuery } from "@tanstack/react-query";
import Section2 from "../Section2";
import { getAllSupervisors } from './../../../api/Admin/Supervisors/getAllSupervisors';

const Section3 = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['supervisors', page, rowsPerPage],
        queryFn: () => getAllSupervisors(page, rowsPerPage),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    if (isLoading) return <div style={{ padding: 16 }}>جاري التحميل...</div>;
    if (isError) return <div style={{ padding: 16, color: 'crimson' }}>خطأ: {error.message}</div>;

    const rows = Array.isArray(data?.data) ? data.data : [];
    const meta = data?.meta || {};
    const total = meta.total || rows.length;
    const lastPage = meta.last_page || Math.max(1, Math.ceil(total / (meta.per_page || rowsPerPage || 1)));

    return (
        <>
            <Section2 supervisors={rows} />

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
};

export default Section3;
