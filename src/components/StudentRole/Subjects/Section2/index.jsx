// src/components/ParentRole/Subjects/Section.jsx
import React, { useState, useRef } from "react";
import PaginationSection from "../../../../layout/PaginationSection";
import Section1 from "../Section1"; 

export default function Section2() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const metaRef = useRef({ total: 0, last_page: 1 });

    return (
        <>
            <Section1
                page={page}
                rowsPerPage={rowsPerPage}
                onMeta={(m) => (metaRef.current = m || metaRef.current)}
                onRequestPageChange={(p) => setPage(p)}  
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
