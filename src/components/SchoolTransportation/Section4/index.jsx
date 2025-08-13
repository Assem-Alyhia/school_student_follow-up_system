// src/components/SchoolTransportation/Section3/index.jsx
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PaginationSection from "../../../layout/PaginationSection";
import { getAllBuses } from "../../../api/Admin/Buses/getAllBuses";
import Section3 from "../Section3";

const Section4 = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const queryClient = useQueryClient();

    const {
        data,
        isError,
        error,
        isFetching,   
    } = useQuery({
        queryKey: ["buses", { page, perPage: rowsPerPage }],
        queryFn: () => getAllBuses({ page, perPage: rowsPerPage }),
        keepPreviousData: true,     
        staleTime: 0,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
        select: (res) => ({
            rows: Array.isArray(res?.data) ? res.data : [],
            meta: res?.meta || { total: 0, last_page: 1 },
        }),
    });

    useEffect(() => {
        const next = page + 1;
        const prev = page - 1;
        if (data?.meta?.last_page && next <= data.meta.last_page) {
            queryClient.prefetchQuery({
                queryKey: ["buses", { page: next, perPage: rowsPerPage }],
                queryFn: () => getAllBuses({ page: next, perPage: rowsPerPage }),
            });
        }
        if (prev >= 1) {
            queryClient.prefetchQuery({
                queryKey: ["buses", { page: prev, perPage: rowsPerPage }],
                queryFn: () => getAllBuses({ page: prev, perPage: rowsPerPage }),
            });
        }
    }, [page, rowsPerPage, data?.meta?.last_page, queryClient]);

    if (isError) return <div>حدث خطأ: {error?.message || "غير معروف"}</div>;

    const rows = data?.rows ?? [];
    const total = data?.meta?.total ?? 0;
    const lastPage = data?.meta?.last_page ?? 1;

    return (
        <>
            <Section3 buses={rows} isFetching={isFetching} />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                lastPage={lastPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setPage(1);
                }}
                sx={{ direction: "ltr" }}
            />
        </>
    );
};

export default Section4;
