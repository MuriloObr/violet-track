import React, { useEffect, useState } from 'react';
import { Plus, Tag as TagIcon, LayoutGrid, Settings, Edit2, Trash2, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { api, Category, Tag, Rule } from '../services/api';
import { getColorForString } from '../lib/colors';
import { RuleModal } from '../components/RuleModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export const Management: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cats, tgs, rls] = await Promise.all([
        api.getCategories(),
        api.getTags(),
        api.getRules(),
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      setTags(Array.isArray(tgs) ? tgs : []);
      setRules(Array.isArray(rls) ? rls : []);
    } catch (error) {
      console.error('Failed to fetch management data:', error);
      setCategories([]);
      setTags([]);
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await api.createCategory(newCategory.trim());
      setNewCategory('');
      fetchData();
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    try {
      await api.createTag(newTag.trim());
      setNewTag('');
      fetchData();
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setIsRuleModalOpen(true);
  };

  const handleDeleteRule = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta regra?')) return;
    try {
      await api.deleteRule(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  const handleApplyRules = async () => {
    try {
      await api.applyRules();
      alert('Regras aplicadas com sucesso a todas as transações!');
    } catch (error) {
      console.error('Failed to apply rules:', error);
    }
  };

  if (loading) {
    return <div className="py-10 text-center">Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestão</h2>
        <p className="text-muted-foreground">Gerencie suas categorias, tags e regras de automatização.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Categories Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5" /> Categorias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <Input
                placeholder="Nova categoria..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant="outline"
                  className={getColorForString(cat.name)}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tags Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TagIcon className="h-5 w-5" /> Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddTag} className="flex gap-2">
              <Input
                placeholder="Nova tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className={getColorForString(tag.name)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Regras de Automatização
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleApplyRules} className="gap-2">
              <Zap className="h-4 w-4" /> Aplicar Agora
            </Button>
            <Button size="sm" onClick={() => { setEditingRule(null); setIsRuleModalOpen(true); }} className="gap-2">
              <Plus className="h-4 w-4" /> Nova Regra
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Condição</TableHead>
                <TableHead>Ações</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id || Math.random().toString()}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded mr-1">
                      {rule.field === 'description' ? 'Descrição' : 'Valor'}
                    </span>
                    <span className="text-xs font-semibold mr-1">
                      {rule.operator === 'contains' && 'contém'}
                      {rule.operator === 'equals' && 'igual a'}
                      {rule.operator === 'gt' && '>'}
                      {rule.operator === 'lt' && '<'}
                    </span>
                    <span className="text-xs italic">"{rule.value}"</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.target_category && (
                        <Badge variant="secondary" className="text-[10px] h-5">
                          Cat: {rule.target_category}
                        </Badge>
                      )}
                      {(rule.target_tag_ids || []).map(tagId => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <Badge key={tagId} variant="outline" className={`text-[10px] h-5 ${getColorForString(tag.name)}`}>
                            {tag.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditRule(rule)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => rule.id && handleDeleteRule(rule.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">
                    Nenhuma regra de automatização cadastrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RuleModal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        rule={editingRule}
        onSave={fetchData}
      />
    </div>
  );
};
