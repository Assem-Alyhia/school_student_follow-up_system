// src/components/Admin/Supervisors/Section3.jsx
import React, { useMemo, useState } from "react";
import PaginationSection from "../../../layout/PaginationSection";
import { useQuery } from "@tanstack/react-query";
import Section1 from "../Section1"; // ✅ تأكد من المسار
import Section2 from "../Section2";
import { getAllSupervisors } from "../../../api/Admin/Supervisors/getAllSupervisors";

const normalizeArabic = (str = "") =>
    str
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[إأآا]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/ء/g, "")
        .replace(/\s+/g, " ")
        .trim();

const Section3 = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["supervisors", page, rowsPerPage], 
        queryFn: () => getAllSupervisors(page, rowsPerPage /*, searchTerm*/),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    const rows = Array.isArray(data?.data) ? data.data : [];
    const meta = data?.meta || {};
    const total = meta.total || rows.length;
    const lastPage =
        meta.last_page || Math.max(1, Math.ceil(total / (meta.per_page || rowsPerPage || 1)));

    const filteredRows = useMemo(() => {
        if (!searchTerm) return rows;
        const q = normalizeArabic(searchTerm);
        return rows.filter((item) => {
            const name = normalizeArabic(item?.user?.name || item?.name || "");
            return name.includes(q);
        });
    }, [rows, searchTerm]);

    if (isLoading) return <div style={{ padding: 16 }}>جاري التحميل...</div>;
    if (isError) return <div style={{ padding: 16, color: 'crimson' }}>خطأ: {error?.message}</div>;

    return (
        <>
            <Section1 searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <Section2 supervisors={filteredRows} />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                lastPage={lastPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    const val = parseInt(event.target.value, 10);
                    setRowsPerPage(Number.isNaN(val) ? 10 : val);
                    setPage(1);
                }}
            />
        </>
    );
};

export default Section3;
