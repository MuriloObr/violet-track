import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SummaryData } from '../lib/aggregations';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';

interface StatsCardsProps {
  data: SummaryData;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${data.balance < 0 ? 'text-destructive' : 'text-primary'}`}>
            {formatCurrency(data.balance)}
          </div>
          <p className="text-xs text-muted-foreground">
            Líquido do período selecionado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entradas</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(data.totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total de créditos no período
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saídas</CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {formatCurrency(data.totalExpense)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total de débitos no período
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
