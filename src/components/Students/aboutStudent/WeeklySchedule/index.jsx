import WeeklySchedule1 from "./Section2";
import BreakAndHolidaysAbout from "./Section3";
import { useParams } from 'react-router-dom';
const WeeklySchedule = () => {
    const { id: studentId } = useParams();

    return ( 
        <>
            <WeeklySchedule1 studentId={studentId} />
            <BreakAndHolidaysAbout/>
        </>
    );
}

export default WeeklySchedule;