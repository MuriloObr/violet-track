import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from './ui/chart';
import { TagData } from '../lib/aggregations';

interface TagBarChartProps {
  data: TagData[];
}

const chartConfig = {
  total: {
    label: "Total",
  },
} satisfies ChartConfig;

export const TagBarChart: React.FC<TagBarChartProps> = ({ data }) => {
  return (
    <Card key={JSON.stringify(data)}>
      <CardHeader>
        <CardTitle>Gastos por Tag</CardTitle>
        <CardDescription>Top 10 tags com mais gastos</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="tag"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" radius={8}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
