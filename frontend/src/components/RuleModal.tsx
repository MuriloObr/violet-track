import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { api, Category, Tag, Rule } from '../services/api';
import { getColorForString } from '../lib/colors';

interface RuleModalProps {
  rule: Rule | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const RuleModal: React.FC<RuleModalProps> = ({
  rule,
  isOpen,
  onClose,
  onSave,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [name, setName] = useState('');
  const [field, setField] = useState<'description' | 'value'>('description');
  const [operator, setOperator] = useState<'contains' | 'equals' | 'gt' | 'lt'>('contains');
  const [value, setValue] = useState('');
  const [targetCategory, setTargetCategory] = useState<string>('none');
  const [targetTagIds, setTargetTagIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (field === 'description' && (operator === 'gt' || operator === 'lt')) {
      setOperator('contains');
    } else if (field === 'value' && operator === 'contains') {
      setOperator('equals');
    }
  }, [field, operator]);

  useEffect(() => {
    if (isOpen) {
      api.getCategories().then(setCategories).catch(console.error);
      api.getTags().then(setAllTags).catch(console.error);
      
      if (rule) {
        setName(rule.name);
        setField(rule.field);
        setOperator(rule.operator);
        setValue(rule.value);
        setTargetCategory(rule.target_category || 'none');
        setTargetTagIds(rule.target_tag_ids || []);
      } else {
        setName('');
        setField('description');
        setOperator('contains');
        setValue('');
        setTargetCategory('none');
        setTargetTagIds([]);
      }
    }
  }, [isOpen, rule]);

  const toggleTag = (tagId: string) => {
    setTargetTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    const ruleData: Rule = {
      name,
      field,
      operator,
      value,
      target_category: targetCategory === 'none' ? '' : targetCategory,
      target_tag_ids: targetTagIds,
    };

    try {
      if (rule?.id) {
        await api.updateRule(rule.id, { ...ruleData, id: rule.id });
      } else {
        await api.createRule(ruleData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save rule:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{rule ? 'Editar Regra' : 'Nova Regra'}</DialogTitle>
          <DialogDescription>
            Configure uma regra para automatizar a categorização de suas transações.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Nome da Regra</p>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ex: Uber como Transporte"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Campo</p>
              <Select value={field} onValueChange={(v: any) => setField(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Campo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="description">Descrição</SelectItem>
                  <SelectItem value="value">Valor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Operador</p>
              <Select value={operator} onValueChange={(v: any) => setOperator(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Operador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Igual</SelectItem>
                  {field === 'description' && (
                    <SelectItem value="contains">Contém</SelectItem>
                  )}
                  {field === 'value' && (
                    <SelectItem value="gt">Maior que</SelectItem>
                  )}
                  {field === 'value' && (
                    <SelectItem value="lt">Menor que</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Valor de Comparação</p>
            <Input 
              value={value} 
              onChange={(e) => setValue(e.target.value)} 
              placeholder={field === 'value' ? 'Ex: 100.50' : 'Ex: Uber'}
            />
          </div>

          <div className="space-y-2 pt-2 border-t">
            <p className="text-sm font-semibold">Ações</p>
            <p className="text-sm font-medium">Aplicar Categoria</p>
            <Select
              value={targetCategory}
              onValueChange={setTargetCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Nenhuma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Aplicar Tags</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {allTags.map((tag) => {
                const isSelected = targetTagIds.includes(tag.id);
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'ring-2 ring-primary ring-offset-1' 
                        : `opacity-60 hover:opacity-100 ${getColorForString(tag.name)}`
                    }`}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !name || !value}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
