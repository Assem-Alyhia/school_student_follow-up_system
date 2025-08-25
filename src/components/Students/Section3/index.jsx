import React, { useMemo, useState } from "react";
import PaginationSection from "../../../layout/PaginationSection";
import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "../../../api/Admin/Students/getAllStudents";
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
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["students", page, rowsPerPage], 
        queryFn: () => getAllStudents(page, rowsPerPage /*, searchTerm */),
        keepPreviousData: true,
    });

    const list = data?.data || [];

    const filteredList = useMemo(() => {
        if (!searchTerm) return list;
        const q = normalizeArabic(searchTerm);
        return list.filter((s) => {
            const name = normalizeArabic(s?.user?.name || s?.name || "");
            return name.includes(q);
        });
    }, [list, searchTerm]);

    if (isLoading) return <div>جاري التحميل...</div>;
    if (isError) return <div>خطأ: {error?.message}</div>;

    return (
        <>
            <Section1 searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <Section2 students={filteredList} />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={data?.meta?.total || 0}
                lastPage={data?.meta?.last_page || 1}
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
