import api from "./api";

// Summary
export const getAnalyticsSummary = async () => {
    const { data } = await api.get("/api/analytics/summary");

    const s = data.summary;

    return {
        summary: [
            {
                label: "Productivity",
                value: `${s.productivityScore}%`,
                change: "",
            },
            {
                label: "Completion Rate",
                value: `${s.completionRate}%`,
                change: "",
            },
            {
                label: "Upcoming Deadlines",
                value: s.upcomingDeadlinesCount,
                change: "",
            },
            {
                label: "Completed Tasks",
                value: `${s.completedTasks}/${s.totalTasks}`,
                change: "",
            },
        ],
    };
};

// Details
export const getAnalyticsDetails = async () => {
    const { data } = await api.get("/api/analytics/details");

    return data.details;
};
