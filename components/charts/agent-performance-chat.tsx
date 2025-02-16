import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

const AgentPerformanceChart = () => {
    const data = [
        { day: 'Mon', agent1: 20, agent2: 15, agent3: 10 },
        { day: 'Tue', agent1: 25, agent2: 28, agent3: 12 },
        { day: 'Wed', agent1: 35, agent2: 30, agent3: 20 },
        { day: 'Thu', agent1: 40, agent2: 25, agent3: 25 },
        { day: 'Fri', agent1: 42, agent2: 32, agent3: 30 },
        { day: 'Sat', agent1: 43, agent2: 35, agent3: 32 },
        { day: 'Sun', agent1: 45, agent2: 30, agent3: 35 },
    ];

    return (
        <Card className="bg-white">
            <CardContent className="p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-black">Agent Performance</h2>
                    <p className="text-sm text-[#0A1E4E]">Calls completed per agent over the week</p>
                </div>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" stroke="#0A1E4E" />
                            <YAxis stroke="#0A1E4E" />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="agent1"
                                stroke="#FF9F43"
                                name="Agent 1"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="agent2"
                                stroke="#EA5455"
                                name="Agent 2"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="agent3"
                                stroke="#28C76F"
                                name="Agent 3"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default AgentPerformanceChart;