// src/components/ParentRole/Exams/Section.jsx
import React, { useState } from "react";
import PaginationSection from "../../../../layout/PaginationSection";
import Section2 from "../Section2";


export default function Section3() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [meta, setMeta] = useState({ total: 0, last_page: 1 });

    return (
        <>
            <Section2
                page={page}
                rowsPerPage={rowsPerPage}
                onMeta={(m) => setMeta(m ?? { total: 0, last_page: 1 })}
            />

            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={meta.total}
                lastPage={meta.last_page}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                }}
            />
        </>
    );
}
