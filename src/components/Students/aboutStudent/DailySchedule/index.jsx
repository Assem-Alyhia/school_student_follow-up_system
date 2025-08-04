import DailyScheduleAbout from "./Section2";
import BreakAndHolidaysAbout from "./Section3";
import { useParams } from 'react-router-dom';
const DailySchedule = () => {
    const { id: studentId } = useParams();

    return ( 
        <>
            <DailyScheduleAbout studentId={studentId} />

            <BreakAndHolidaysAbout/>
        </>
    );
}

export default DailySchedule;