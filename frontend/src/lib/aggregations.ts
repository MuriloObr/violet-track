import { Bill } from '../services/api';
import { startOfMonth, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getHexColorForString } from './chart-colors';

export interface CategoryData {
  category: string;
  total: number;
  fill: string;
}

export interface TagData {
  tag: string;
  total: number;
  fill: string;
}

export interface EvolutionData {
  date: string;
  income: number;
  expense: number;
}

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const aggregateByCategory = (bills: Bill[]): CategoryData[] => {
  console.log('Aggregating by Category, total bills:', bills.length);
  const categories: Record<string, number> = {};

  bills.forEach((bill) => {
    // Aggregating all categorized bills, regardless of sign (expense/income)
    // to ensure user sees their data.
    const cat = bill.category && bill.category.trim() !== '' ? bill.category : 'Sem Categoria';
    categories[cat] = (categories[cat] || 0) + Math.abs(bill.value);
  });

  const result = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .map(([category, total]) => ({
      category,
      total,
      fill: getHexColorForString(category),
    }));
  
  console.log('Category result:', result);
  return result;
};

export const aggregateByTag = (bills: Bill[]): TagData[] => {
  console.log('Aggregating by Tag, total bills:', bills.length);
  const tags: Record<string, number> = {};

  bills.forEach((bill) => {
    if (bill.tags && bill.tags.length > 0) {
      bill.tags.forEach((tag) => {
        tags[tag.name] = (tags[tag.name] || 0) + Math.abs(bill.value);
      });
    }
  });

  const result = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, total]) => ({
      tag,
      total,
      fill: getHexColorForString(tag),
    }));

  console.log('Tag result:', result);
  return result;
};

export const aggregateEvolution = (bills: Bill[]): EvolutionData[] => {
  const months: Record<string, { income: number; expense: number }> = {};

  // Sort bills by date first
  const sortedBills = [...bills].sort((a, b) => a.date.localeCompare(b.date));

  sortedBills.forEach((bill) => {
    const date = parseISO(bill.date);
    const monthKey = format(startOfMonth(date), 'yyyy-MM');
    
    if (!months[monthKey]) {
      months[monthKey] = { income: 0, expense: 0 };
    }

    if (bill.value > 0) {
      months[monthKey].income += bill.value;
    } else {
      months[monthKey].expense += Math.abs(bill.value);
    }
  });

  return Object.entries(months).map(([date, values]) => ({
    date: format(parseISO(`${date}-01`), 'MMM/yy', { locale: ptBR }),
    income: values.income,
    expense: values.expense,
  }));
};

export const calculateSummary = (bills: Bill[]): SummaryData => {
  let totalIncome = 0;
  let totalExpense = 0;

  bills.forEach((bill) => {
    if (bill.value > 0) {
      totalIncome += bill.value;
    } else {
      totalExpense += Math.abs(bill.value);
    }
  });

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};
