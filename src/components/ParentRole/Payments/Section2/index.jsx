// src/components/ParentRole/Payments/Section.jsx (أو Section2.jsx حسب تنظيمك)
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationSection from "../../../../layout/PaginationSection";
import Section1 from "../Section1";
import { getParentPayments } from "../../../../api/Parent/Payments/getParentPayments";

export default function ParentPaymentsSection() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["parent-payments", page, rowsPerPage],
        queryFn: () => getParentPayments(page, rowsPerPage),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    const rows = Array.isArray(data?.data) ? data.data : [];
    const meta = data?.meta || {};
    const total = Number(meta.total ?? rows.length);
    const lastPage = Number(
        meta.last_page ?? Math.max(1, Math.ceil(total / (Number(meta.per_page ?? rowsPerPage) || 1)))
    );

    return (
        <>
            <Section1
                rows={rows}
                loading={isLoading}
                errorMessage={isError ? (error?.response?.data?.message || error?.message) : null}
            />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                lastPage={lastPage}
                onPageChange={(p) => setPage(p)}   
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                }}
            />
        </>
    );
}
