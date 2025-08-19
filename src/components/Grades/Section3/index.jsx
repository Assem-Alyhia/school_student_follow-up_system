// src/features/Grades/Section3.jsx

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationSection from "../../../layout/PaginationSection";
import Section2 from "../Section2";
import { getAllGrades } from "../../../api/Admin/Grades/getAllGrades";

const Section3 = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['grades', page, rowsPerPage],
        queryFn: () => getAllGrades(page, rowsPerPage),
        keepPreviousData: true,
    });

    if (isLoading) return <div>جاري التحميل...</div>;
    if (isError) return <div>خطأ: {error.message}</div>;

    const rows = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
    const total = data?.meta?.total || 0;
    const lastPage = data?.meta?.last_page || 1;

    return (
        <>
            <Section2 rows={rows} page={page} rowsPerPage={rowsPerPage} />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                lastPage={lastPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    const value = Number(event.target.value); 
                    setRowsPerPage(value);
                    setPage(1); 
                }}
            />
        </>
    );
};

export default Section3;
