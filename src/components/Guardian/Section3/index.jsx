// src/components/Admin/Parents/Section3.jsx
import React, { useMemo, useState, useEffect } from "react";
import PaginationSection from "../../../layout/PaginationSection";
import { useQuery } from "@tanstack/react-query";
import { getAllParents } from "../../../api/Admin/Parents/getAllParents";
import Section1 from "../Section1";
import Section2 from "../Section2";

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
    const [parents, setParents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["parents", page, rowsPerPage], 
        queryFn: () => getAllParents(page, rowsPerPage /*, searchTerm*/),
        keepPreviousData: true,
    });

    useEffect(() => {
        if (Array.isArray(data?.data)) setParents(data.data);
    }, [data]);

    const meta = data?.meta || {};
    const total = meta.total || parents.length;
    const lastPage = meta.last_page || Math.max(1, Math.ceil(total / (meta.per_page || rowsPerPage || 1)));

    const filteredParents = useMemo(() => {
        if (!searchTerm) return parents;
        const q = normalizeArabic(searchTerm);
        return parents.filter((p) => {
            const name = normalizeArabic(p?.user?.name || p?.name || "");
            return name.includes(q);
        });
    }, [parents, searchTerm]);

    if (isLoading) return <div>جاري التحميل...</div>;
    if (isError) return <div>خطأ: {error?.message}</div>;

    return (
        <>
            <Section1 searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <Section2 parents={filteredParents} setParents={setParents} />

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
