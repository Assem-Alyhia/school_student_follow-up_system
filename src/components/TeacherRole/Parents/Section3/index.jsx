// components/Teacher/Parents/Section3.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationSection from "../../../../layout/PaginationSection";
import Section2 from "../Section2";
import { getTeacherParents } from "../../../../api/Teacher/Parents/getTeacherParents";

const Section3 = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, isLoading, isError, error, isFetching } = useQuery({
        queryKey: ["teacher-parents", page, rowsPerPage],
        queryFn: () => getTeacherParents(page, rowsPerPage),
        keepPreviousData: true,
    });

    if (isLoading) return <div>جاري التحميل...</div>;
    if (isError) return <div>خطأ: {error.message}</div>;

    const parents = data?.data || [];
    const total = data?.meta?.total || 0;
    const lastPage = data?.meta?.last_page || 1;

    return (
        <>
            <Section2 parents={parents} isFetching={isFetching} />

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
