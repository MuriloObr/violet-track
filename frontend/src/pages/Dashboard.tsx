import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Edit2, X } from 'lucide-react';
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
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { api, Bill, Category, Tag } from '../services/api';
import { BillEditModal } from '../components/BillEditModal';
import { getColorForString } from '../lib/colors';

interface DashboardProps {
  onAddClick: () => void;
}

const STORAGE_KEY = 'dashboard_filters';

export const Dashboard: React.FC<DashboardProps> = ({ onAddClick }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    category: 'all',
    tagId: 'all',
  });

  // Load filters from localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem(STORAGE_KEY);
    if (savedFilters) {
      try {
        setFilters(JSON.parse(savedFilters));
      } catch (e) {
        console.error('Failed to parse saved filters', e);
      }
    }
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [billsData, categoriesData, tagsData] = await Promise.all([
        api.getBills(),
        api.getCategories(),
        api.getTags(),
      ]);
      setBills(billsData);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const matchSearch = bill.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchDate =
        (!filters.startDate || bill.date >= filters.startDate) &&
        (!filters.endDate || bill.date <= filters.endDate);
      const matchCategory = filters.category === 'all' || bill.category === filters.category;
      const matchTag = filters.tagId === 'all' || bill.tags?.some((t) => t.id === filters.tagId);
      return matchSearch && matchDate && matchCategory && matchTag;
    });
  }, [bills, filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      startDate: '',
      endDate: '',
      category: 'all',
      tagId: 'all',
    });
  };

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 items-end">
        <div className="lg:col-span-2 space-y-2">
          <label className="text-sm font-medium">Descrição</label>
          <Input
            placeholder="Buscar por descrição..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data Início</label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data Fim</label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters((f) => ({ ...f, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tag</label>
          <Select
            value={filters.tagId}
            onValueChange={(value) => setFilters((f) => ({ ...f, tagId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 lg:col-span-6 justify-end">
          {(filters.search || filters.startDate || filters.endDate || filters.category !== 'all' || filters.tagId !== 'all') && (
            <Button variant="ghost" onClick={handleResetFilters} size="sm">
              <X className="mr-2 h-4 w-4" /> Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Carregando...</div>
          ) : filteredBills.length === 0 ? (
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
                {filteredBills.map((bill) => (
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
        onSave={fetchData}
      />
    </div>
  );
};
