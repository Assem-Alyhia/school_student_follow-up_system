// src/components/TeacherRole/ExamResults/ResultsSection.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationSection from "../../../../../layout/PaginationSection";
import Section2 from "../Section2"; 
import { getTeacherExamResults } from './../../../../../api/Teacher/Exam/getTeacherExamResults';

export default function Section3() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-exam-results", page, rowsPerPage],
        queryFn: () => getTeacherExamResults(page, rowsPerPage),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    const rows = Array.isArray(data?.data) ? data.data : [];
    const meta = data?.meta || {};
    const total = Number(meta.total ?? rows.length);
    const lastPage = Number(meta.last_page ?? Math.max(1, Math.ceil(total / (Number(meta.per_page ?? rowsPerPage) || 1))));

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
                onPageChange={(newPage) => setPage(newPage)}           // 1-based
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                }}
            />
        </>
    );
}
