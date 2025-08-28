import React, { useMemo, useState } from "react";
import PaginationSection from "../../../layout/PaginationSection";
import { useQuery } from "@tanstack/react-query";
import { getAllTeachers } from "../../../api/Admin/Teachers/getAllTeachers";
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
        queryKey: ["teachers", page, rowsPerPage],
        queryFn: () => getAllTeachers(page, rowsPerPage),
        keepPreviousData: true,
    });

    const teachers = data?.data || [];

    const filteredTeachers = useMemo(() => {
        if (!searchTerm) return teachers;
        const q = normalizeArabic(searchTerm);
        return teachers.filter((t) => {
            const name = normalizeArabic(t?.user?.name || t?.name || "");
            return name.includes(q);
        });
    }, [teachers, searchTerm]);

    if (isLoading) {
        return <div>جاري التحميل...</div>;
    }

    if (isError) {
        return <div>خطأ: {error?.message}</div>;
    }

    return (
        <>
            <Section1 searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <Section2 teachers={filteredTeachers} page={page} rowsPerPage={rowsPerPage} />

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
