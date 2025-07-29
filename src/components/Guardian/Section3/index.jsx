import React, { useState, useEffect } from "react";
import PaginationSection from "../../../layout/PaginationSection";
import { useQuery } from "@tanstack/react-query";
import { getAllParents } from "../../../api/Admin/Parents/getAllParents";
import Section2 from "../Section2";

const Section3 = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [parents, setParents] = useState([]);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["parents", page, rowsPerPage],
        queryFn: () => getAllParents(page, rowsPerPage),
        keepPreviousData: true,
    });

    // تحديث القائمة عند جلب البيانات من React Query
    useEffect(() => {
        if (data?.data) {
            setParents(data.data);
        }
    }, [data]);

    if (isLoading) return <div>جاري التحميل...</div>;
    if (isError) return <div>خطأ: {error.message}</div>;

    return (
        <>
            <Section2 parents={parents} setParents={setParents} />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={data?.meta?.total || 0}
                lastPage={data?.meta?.last_page || 1}
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
