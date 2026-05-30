import React from 'react';
import { Pie, PieChart, Cell } from 'recharts';
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
import { CategoryData } from '../lib/aggregations';

interface CategoryPieChartProps {
  data: CategoryData[];
}

const chartConfig = {
  total: {
    label: "Total",
  },
} satisfies ChartConfig;

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  return (
    <Card className="flex flex-col" key={JSON.stringify(data)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Gastos por Categoria</CardTitle>
        <CardDescription>Distribuição de débitos</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius={60}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
