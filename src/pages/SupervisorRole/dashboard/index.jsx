import SupervisorLocationPusher from "../../../components/SupervisorRole/Buses/SupervisorLocationPusher";
import OverviewSection from "../../../components/SupervisorRole/Dashboard/Section1";
import QuickAccessSection from "../../../components/SupervisorRole/Dashboard/Section2";

const SupervisorDashboard = () => {
    return (
        <>
            <SupervisorLocationPusher/>
            <OverviewSection />
            <QuickAccessSection />
        </>
    );
}

export default SupervisorDashboard;