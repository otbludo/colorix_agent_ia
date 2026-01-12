import React, { useEffect, useMemo } from "react";
import { TimeLineChart } from "../global/TimeLineChart";
import { BarChart3 } from "lucide-react";
import { GetCustomer } from "../../api/get/GetCustomers";


function formatCustomersToChartData(customers) {
    if (!Array.isArray(customers)) return [];

    const countByDate = {};

    customers.forEach((customer) => {
        const dateObj = new Date(customer.created_at);
        const date = dateObj.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
        });

        countByDate[date] = (countByDate[date] || 0) + 1;
    });

    return Object.entries(countByDate).map(([date, value]) => ({
        date,
        value,
    }));
}

export function TimeLineChartCustomer({ token }) {
    const { data, isPending, isError } = GetCustomer(token, null);

    const chartData = useMemo(() => {
        return formatCustomersToChartData(data);
    }, [data]);

    return (
        <div className="flex-1 min-w-0">
            <TimeLineChart
                data={chartData}
                title="Clients quotidiens"
                bgIcon1={<BarChart3 />}
            />
        </div>
    );
}
