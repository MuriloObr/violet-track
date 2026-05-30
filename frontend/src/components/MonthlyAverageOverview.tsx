import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CategoryAverageData } from '../lib/aggregations';

interface MonthlyAverageOverviewProps {
  data: CategoryAverageData[];
}

export const MonthlyAverageOverview: React.FC<MonthlyAverageOverviewProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Médias Mensais por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {data.map((item) => (
            <div key={item.category} className="space-y-1 border-l-2 pl-3" style={{ borderLeftColor: item.fill }}>
              <p className="text-xs text-muted-foreground font-medium truncate" title={item.category}>
                {item.category}
              </p>
              <p className="text-lg font-bold">
                {formatCurrency(item.average)}
              </p>
              <p className="text-[10px] text-muted-foreground italic">
                {item.monthsCount} {item.monthsCount === 1 ? 'mês' : 'meses'} analisados
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
