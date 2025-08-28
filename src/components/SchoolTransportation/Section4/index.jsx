// src/components/SchoolTransportation/Section3/index.jsx
import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PaginationSection from "../../../layout/PaginationSection";
import { getAllBuses } from "../../../api/Admin/Buses/getAllBuses";
import Section2 from "../Section2";
import Section3 from "../Section3";

const normalizeArabic = (str = "") =>
    String(str || "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[إأآا]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/ء/g, "")
        .replace(/\s+/g, " ")
        .trim();

const Section4 = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["buses", page, rowsPerPage], 
        queryFn: () => getAllBuses(page, rowsPerPage /*, searchTerm */),
        keepPreviousData: true,
    });

    const rows = Array.isArray(data?.data) ? data.data : [];
    const meta = data?.meta || {};

    const filteredRows = useMemo(() => {
        const q = normalizeArabic(searchTerm);
        if (!q) return rows;

        return rows.filter((bus) => {
            const routeName = normalizeArabic(bus?.route?.name || bus?.route_name || bus?.name || "");
            const driverName = normalizeArabic(
                bus?.driver?.user?.name || bus?.driver?.name || bus?.driver_name || ""
            );
            const code = normalizeArabic(bus?.code || bus?.plate || "");
            return routeName.includes(q) || driverName.includes(q) || code.includes(q);
        });
    }, [rows, searchTerm]);

    const isFiltering = Boolean(searchTerm);
    const totalForPagination = isFiltering ? filteredRows.length : (meta.total ?? rows.length);
    const lastPage = Math.max(1, Math.ceil(totalForPagination / rowsPerPage));

    if (isLoading) return <div>جاري التحميل...</div>;
    if (isError) return <div>حدث خطأ: {error?.message}</div>;

    return (
        <>
            <Section2
                searchTerm={searchTerm}
                onSearchChange={(v) => {
                    setSearchTerm(v);
                    setPage(1);
                }}
                onCreated={() => {
                    queryClient.invalidateQueries({ queryKey: ["buses"] });
                }}
            />

            <Section3 buses={filteredRows} />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={totalForPagination}
                lastPage={lastPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    const val = parseInt(event.target.value, 10);
                    setRowsPerPage(Number.isNaN(val) ? 10 : val);
                    setPage(1);
                }}
            />
        </>
    );
};

export default Section4;
