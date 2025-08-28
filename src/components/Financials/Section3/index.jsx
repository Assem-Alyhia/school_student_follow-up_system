// pages/financials/Section3Financials.jsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationSection from "../../../layout/PaginationSection";
import Section1 from "../Section1";
import Section2 from "../Section2";
import { getAllFinancials } from "../../../api/Admin/Financials/getAllFinancials";

const Section3 = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => setPage(1), [searchTerm]);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["financials", page, rowsPerPage, searchTerm],
        queryFn: () => getAllFinancials(page, rowsPerPage, searchTerm),
        keepPreviousData: true,
    });

    const list = data?.data || [];
    const total = data?.meta?.total || 0;
    const lastPage = data?.meta?.last_page || 1;

    if (isLoading) return <div>جاري التحميل...</div>;
    if (isError) return <div>خطأ: {error?.message}</div>;

    return (
        <>
            <Section1 searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <Section2 financials={list} />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                lastPage={lastPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setRowsPerPage(Number.isNaN(val) ? 10 : val);
                    setPage(1);
                }}
            />
        </>
    );
};

export default Section3;
