import React, { useEffect, useMemo } from "react";
import { TimeLineChart } from "../global/TimeLineChart";
import { TrendingUp } from "lucide-react";
import { GetDevis } from '../../api/get/GetDevis'


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

export function TimeLineChartDevis({ token }) {
    const { data, isPending, isError } = GetDevis(token, null);

    const chartData = useMemo(() => {
        return formatCustomersToChartData(data);
    }, [data]);

    return (
        <div className="flex-1 space-y-6">
            <TimeLineChart
                data={chartData}
                title="Devis quotidiennes"
                bgIcon1={<TrendingUp />}
            />
        </div>
    );
}
