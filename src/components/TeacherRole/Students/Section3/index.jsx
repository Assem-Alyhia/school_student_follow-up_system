import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationSection from "../../../../layout/PaginationSection";
import Section2 from "../Section2";
import { getTeacherStudents } from "../../../../api/Teacher/Students/getTeacherStudents";

const Section3 = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, isLoading, isError, error, isFetching } = useQuery({
        queryKey: ["teacher-students", page, rowsPerPage],
        queryFn: () => getTeacherStudents(page, rowsPerPage),
        keepPreviousData: true,
    });

    if (isLoading) return <div>جاري التحميل...</div>;
    if (isError) return <div>خطأ: {error.message}</div>;

    const students = data?.data || [];
    const total = data?.meta?.total || 0;
    const lastPage = data?.meta?.last_page || 1;

    return (
        <>
            <Section2 students={students} isFetching={isFetching} />

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
