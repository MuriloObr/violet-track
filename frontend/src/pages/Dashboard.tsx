import React, { useEffect, useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
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
import { Badge } from '../components/ui/badge';
import { api, Bill } from '../services/api';
import { BillEditModal } from '../components/BillEditModal';
import { getColorForString } from '../lib/colors';

interface DashboardProps {
  onAddClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAddClick }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const fetchBills = () => {
    setLoading(true);
    api.getBills()
      .then(setBills)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBills();
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
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell>{formatDate(bill.date)}</TableCell>
                    <TableCell>
                      <span className="font-medium">{bill.description}</span>
                    </TableCell>
                    <TableCell>
                      {bill.category ? (
                        <Badge variant="outline" className={getColorForString(bill.category)}>
                          {bill.category}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm italic">Sem categoria</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {bill.tags?.map((tag) => (
                          <Badge 
                            key={tag.id} 
                            variant="outline" 
                            className={`text-[10px] px-1.5 py-0 ${getColorForString(tag.name)}`}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-mono ${bill.value < 0 ? 'text-destructive' : 'text-primary'}`}>
                      {formatCurrency(bill.value)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingBill(bill)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <BillEditModal
        bill={editingBill}
        isOpen={!!editingBill}
        onClose={() => setEditingBill(null)}
        onSave={fetchBills}
      />
    </div>
  );
};
