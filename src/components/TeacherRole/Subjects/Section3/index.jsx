import React, { useState } from "react";
import PaginationSection from "../../../../layout/PaginationSection";
import Section2 from "../Section2";

export default function Section3() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    return (
        <>
            <Section2 page={page} rowsPerPage={rowsPerPage} />
            <PaginationSection
                page={page}
                rowsPerPage={rowsPerPage}
                total={0}
                lastPage={1}
                onPageChange={(p) => setPage(p)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                }}
            />
        </>
    );
}
