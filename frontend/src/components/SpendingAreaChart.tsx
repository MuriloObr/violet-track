import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
import { EvolutionData } from '../lib/aggregations';

interface SpendingAreaChartProps {
  data: EvolutionData[];
}

const chartConfig = {
  income: {
    label: 'Entradas',
    color: 'var(--chart-2)',
  },
  expense: {
    label: 'Saídas',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export const SpendingAreaChart: React.FC<SpendingAreaChartProps> = ({ data }) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Evolução Mensal</CardTitle>
        <CardDescription>
          Comparativo de entradas e saídas ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="expense"
              type="natural"
              fill="var(--color-expense)"
              fillOpacity={0.4}
              stroke="var(--color-expense)"
              stackId="a"
            />
            <Area
              dataKey="income"
              type="natural"
              fill="var(--color-income)"
              fillOpacity={0.4}
              stroke="var(--color-income)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
