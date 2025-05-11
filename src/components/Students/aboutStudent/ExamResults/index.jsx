import StudentStats from "./Section2";
import StudentExamsTable from "./Section3";
import PaginationSection from './../../../../layout/PaginationSection';

const ExamResults = () => {
    return ( 
        <>
            <StudentStats/>
            <StudentExamsTable/>
            <PaginationSection />
        </>
    );
}

export default ExamResults;