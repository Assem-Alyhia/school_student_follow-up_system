import { useQuery } from "@tanstack/react-query";
import Section1 from "../../components/SchoolTransportation/Section1";
import Section2 from "../../components/SchoolTransportation/Section2";
import Section4 from "../../components/SchoolTransportation/Section4";
import { getAllBuses } from "../../api/Admin/Buses/getAllBuses";

const SchoolTransportation = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['buses'],
        queryFn: getAllBuses,
    });

    if (isLoading) return <div>جاري تحميل بيانات الباصات...</div>;
    if (isError) return <div>حدث خطأ: {error.message}</div>;

    return (
        <>
            <Section1 buses={data?.data || []} />
            <Section2 />
            <Section4 />
        </>
    );
};

export default SchoolTransportation;
