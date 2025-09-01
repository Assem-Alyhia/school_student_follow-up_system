// src/components/TeacherRole/Fees/Section3.jsx
import React, { useRef, useState } from "react";
import PaginationSection from "../../../layout/PaginationSection";
import Section1 from "../Section1";
import Section2 from "../Section2";

export default function Section3() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const metaRef = useRef({ total: 0, last_page: 1 });

    return (
        <>
            <Section1 searchTerm={searchTerm} onSearchChange={(v) => {
                setSearchTerm(v);
                setPage(1); // رجّع لأول صفحة عند تغيير البحث
            }} />

            <Section2
                page={page}
                rowsPerPage={rowsPerPage}
                searchTerm={searchTerm}
                onMeta={(m) => (metaRef.current = m || metaRef.current)}
            />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={metaRef.current?.total || 0}
                lastPage={metaRef.current?.last_page || 1}
                onPageChange={(p) => setPage(p)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                }}
            />
        </>
    );
}
