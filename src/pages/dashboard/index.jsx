import OverviewSection from "../../components/Dashboard/Section1";
import DashboardWidgets from "../../components/Dashboard/Section2";
import QuickAccessSection from "../../components/Dashboard/Section3";

const Dashboard = () => {
    return ( 
        <>
            <OverviewSection/>
            <DashboardWidgets/>
            <QuickAccessSection/>
        </>
    );
}

export default Dashboard;