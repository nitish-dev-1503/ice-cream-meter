"use client"

import { IceCreamCone } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart"

const chartConfig = {
    penalty: {
        color: "hsl(var(--chart-2))",
    },
}

const renderCustomLabel = (props) => {
    const { x, y, width, index } = props;
    const radius = 24;

    return index === 1 ? <g className="">
        <circle cx={x + width / 2} cy={y - radius - 6} r={radius} fill="hsl(var(--chart-1))" />
        <IceCreamCone x={x + width / 2 - 11} y={y - radius - 16} stroke="#fff" />
    </g>
        : <g></g>

};

export function Chart({ chartData }) {
    return (
        <div className=" my-12">
            <ChartContainer config={chartConfig} className=" max-w-2xl m-auto">
                <BarChart accessibilityLayer data={chartData} >
                    <CartesianGrid vertical={false} horizontal={false} />
                    <XAxis
                        dataKey="name"
                        tickLine={true}
                        tickMargin={10}
                        axisLine={true}
                        tickFormatter={(value) => value}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="penalty" fill="var(--color-penalty)" radius={[8, 8, 0, 0]} >
                        <LabelList position="top" content={renderCustomLabel} />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    )
}
