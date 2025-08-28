// src/components/ParentRole/ExamResults/ResultsSection.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationSection from "../../../../../layout/PaginationSection";
import Section2 from "../Section2";
import { getStudentExamGrades } from "../../../../../api/Student/Exams/getStudentExamGrades";

export default function Section3() { // ✅ اسم أوضح
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["student-exam-results", page, rowsPerPage],
        queryFn: () => getStudentExamGrades({ page, per_page: rowsPerPage }),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    const meta = data?.meta || {};
    const total = Number(meta.total ?? rows.length);
    const perPage = Number(meta.per_page ?? rowsPerPage) || 10;
    const lastPage = Number(meta.last_page ?? Math.max(1, Math.ceil(total / perPage)));

    return (
        <>
            <Section2
                rows={rows}
                loading={isLoading}
                errorMessage={isError ? (error?.response?.data?.message || error?.message) : null}
            />
            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                lastPage={lastPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                }}
            />
        </>
    );
}
