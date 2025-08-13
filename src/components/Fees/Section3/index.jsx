// Section3.jsx
import React, { useState } from "react";
import PaginationSection from "../../../layout/PaginationSection";
import { useQuery } from "@tanstack/react-query";
import { getAllPayments } from "../../../api/Admin/Payments/getAllPayments";
import Section2 from "../Section2";

const Section3 = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["payments", { page, rowsPerPage, search }],
        queryFn: () =>
            getAllPayments({
                page,
                perPage: rowsPerPage,
                search: search || "",
            }),
        keepPreviousData: true,
    });

    const rows = Array.isArray(data?.data) ? data.data : [];
    const total = data?.meta?.total || 0;

    if (isLoading && !data) return <div>جاري التحميل...</div>;
    if (isError) return <div>خطأ: {error?.message || "حدث خطأ"} </div>;

    return (
        <>
            <Section2
                payments={rows}
                onSearchChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
            />

            <PaginationSection
                sx={{ direction: "ltr" }}
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                lastPage={data?.meta?.last_page || Math.ceil(total / rowsPerPage) || 1}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setPage(1);
                }}
            />
        </>
    );
};

export default Section3;
