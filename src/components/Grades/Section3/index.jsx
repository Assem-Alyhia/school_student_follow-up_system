// src/features/Grades/Section3.jsx
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationSection from "../../../layout/PaginationSection";
import Section1 from "../Section1";
import Section2 from "../Section2";
import { getAllGrades } from "../../../api/Admin/Grades/getAllGrades";

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
    const [selectedClass, setSelectedClass] = useState("");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["grades", page, rowsPerPage], 
        queryFn: () => getAllGrades(page, rowsPerPage /*, searchTerm, selectedClass */),
        keepPreviousData: true,
    });

    const rows = Array.isArray(data?.data)
        ? data.data
        : (Array.isArray(data) ? data : []);

    const meta = data?.meta || {};

    const filteredRows = useMemo(() => {
        const q = normalizeArabic(searchTerm);

        return rows.filter((row) => {
            const studentName = normalizeArabic(
                row?.student?.user?.name ||
                row?.student?.name ||
                row?.student_name ||
                row?.name ||
                ""
            );

            const className = String(
                row?.class?.name ||
                row?.grade_class?.name ||
                row?.class_name ||
                row?.grade?.name ||
                row?.level ||
                ""
            );

            const matchesName = !q || studentName.includes(q);
            const matchesClass = !selectedClass || className === selectedClass;

            return matchesName && matchesClass;
        });
    }, [rows, searchTerm, selectedClass]);

    const isFiltering = Boolean(searchTerm || selectedClass);

    const totalForPagination = isFiltering
        ? filteredRows.length                      
        : (meta.total ?? rows.length);             

    const lastPage = Math.max(1, Math.ceil(totalForPagination / rowsPerPage));

    if (isLoading) return <div>جاري التحميل...</div>;
    if (isError) return <div>خطأ: {error?.message}</div>;

    return (
        <>
            <Section1
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedClass={selectedClass}
                onClassChange={(val) => {
                    setSelectedClass(val);
                    setPage(1); 
                }}
            />

            <Section2 rows={filteredRows} page={page} rowsPerPage={rowsPerPage} />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={totalForPagination}
                lastPage={lastPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    const value = Number(event.target.value);
                    setRowsPerPage(Number.isNaN(value) ? 10 : value);
                    setPage(1);
                }}
            />
        </>
    );
};

export default Section3;
