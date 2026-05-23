import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { api, Bill, Category, Tag } from '../services/api';
import { getColorForString } from '../lib/colors';

interface BillEditModalProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const BillEditModal: React.FC<BillEditModalProps> = ({
  bill,
  isOpen,
  onClose,
  onSave,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getCategories().then(setCategories).catch(console.error);
      api.getTags().then(setAllTags).catch(console.error);
      setSelectedCategory(bill?.category || '');
      setSelectedTagIds(bill?.tags?.map((t) => t.id) || []);
    }
  }, [isOpen, bill]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId]
    );
  };

  const handleSave = async () => {
    if (!bill) return;
    setIsSaving(true);
    try {
      await api.updateBill(bill.id, { 
        category: selectedCategory,
        tags: selectedTagIds 
      });
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to update bill:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Descrição</p>
            <p className="text-sm text-muted-foreground">{bill?.description}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Categoria</p>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Tags</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {allTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
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
              {allTags.length === 0 && (
                <p className="text-xs text-muted-foreground italic">Nenhuma tag cadastrada.</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
