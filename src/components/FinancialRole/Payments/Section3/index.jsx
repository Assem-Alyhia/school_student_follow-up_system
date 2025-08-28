// pages/financials/Section3Financials.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import Section1 from "../Section1";
import Section2 from "../Section2";

import PaginationSection from "./../../../../layout/PaginationSection";
import { getFinancialPayments } from "../../../../api/Financial/Payments/getFinancialPayments";

const normalizeArabic = (str = "") =>
    String(str)
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

    useEffect(() => { setPage(1); }, [searchTerm, rowsPerPage]);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["financial-payments", page, rowsPerPage], 
        queryFn: () => getFinancialPayments({ page: Number(page), per_page: Number(rowsPerPage) }),
        keepPreviousData: true,
        staleTime: 0,
    });

    const list = data?.data || [];

    const filteredList = useMemo(() => {
        if (!searchTerm) return list;
        const q = normalizeArabic(searchTerm);

        return list.filter((r) => {
            const pNum = normalizeArabic(r?.payment_number || r?.id || "");
            const sName = normalizeArabic(r?.student?.name || r?.student?.user?.name || "");
            const pr = normalizeArabic(r?.parent?.name || "");
            const feeN = normalizeArabic(r?.schoolFee?.name || "");
            return pNum.includes(q) || sName.includes(q) || pr.includes(q) || feeN.includes(q);
        });
    }, [list, searchTerm]);

    if (isLoading) return <div>جاري التحميل...</div>;
    if (isError) return <div>خطأ: {error?.message}</div>;

    return (
        <>
            <Section1 searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <Section2 financials={filteredList} />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={data?.meta?.total || 0}
                lastPage={data?.meta?.last_page || 1}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setRowsPerPage(Number.isNaN(val) ? 10 : val); 
                }}
            />
        </>
    );
};

export default Section3;
