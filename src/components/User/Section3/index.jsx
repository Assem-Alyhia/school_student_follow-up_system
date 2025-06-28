import React, { useState } from "react";
import PaginationSection from "../../../layout/PaginationSection";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../../api/Admin/Users/getAllUsers";
import Section2 from "../Section2";

const Section3 = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['users', page, rowsPerPage],
        queryFn: () => getAllUsers(page, rowsPerPage),
        keepPreviousData: true,
    });

    if (isLoading) return <div>جاري التحميل...</div>;
    if (isError) return <div>خطأ: {error.message}</div>;

    return (
        <>
            <Section2 page={page} rowsPerPage={rowsPerPage} />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={data?.meta?.total || 0}
                lastPage={data?.meta?.last_page || 1}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(event.target.value);
                    setPage(1);
                }}
            />
        </>
    );
};

export default Section3;
