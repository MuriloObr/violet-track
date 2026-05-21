import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { api, Bill } from '../services/api';

interface DashboardProps {
  onAddClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAddClick }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBills()
      .then(setBills)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Minhas Contas</h2>
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Carregando...</div>
          ) : bills.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">Nenhuma transação encontrada.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell>{formatDate(bill.date)}</TableCell>
                    <TableCell className="font-medium">{bill.description}</TableCell>
                    <TableCell>{bill.category || 'Sem categoria'}</TableCell>
                    <TableCell className={`text-right ${bill.value < 0 ? 'text-destructive' : 'text-primary'}`}>
                      {formatCurrency(bill.value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
