// src/components/SchoolTransportation/Section3/index.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationSection from "../../../layout/PaginationSection";
import { getAllBuses } from "../../../api/Admin/Buses/getAllBuses";
import Section3 from "../Section3";

const Section4 = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['buses', page, rowsPerPage],
        queryFn: () => getAllBuses(page, rowsPerPage),
        keepPreviousData: true,
    });

    if (isLoading) return <div>جاري التحميل...</div>;
    if (isError) return <div>حدث خطأ: {error.message}</div>;

    return (
        <>
            <Section3 buses={data?.data || []} />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={data?.meta?.total || 0}
                lastPage={data?.meta?.last_page || 1}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value));
                    setPage(1);
                }}
            />
        </>
    );
};

export default Section4;