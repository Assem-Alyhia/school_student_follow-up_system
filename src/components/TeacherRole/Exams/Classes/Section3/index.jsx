// src/components/TeacherRole/Classrooms/Section3.jsx
import React, { useRef, useState } from "react";
import PaginationSection from "../../../../../layout/PaginationSection";
import Section2 from "../Section2"; 

export default function Section3() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const metaRef = useRef({ total: 0, last_page: 1 });

    return (
        <>
            <Section2
                page={page}
                rowsPerPage={rowsPerPage}
                onMeta={(m) => (metaRef.current = m || metaRef.current)}
            />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={metaRef.current?.total || 0}
                lastPage={metaRef.current?.last_page || 1}
                onPageChange={setPage}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                }}
            />
        </>
    );
}
