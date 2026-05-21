import React, { useState } from 'react';
import { ArrowLeft, Upload, FileCheck, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { api } from '../services/api';

interface ImportProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const Import: React.FC<ImportProps> = ({ onBack, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);

    try {
      await api.importCSV(file);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao importar arquivo. Verifique o formato.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Importar CSV</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecione o arquivo do Nubank</CardTitle>
          <CardDescription>
            Suporta faturas de cartão (Nubank_yyyy-MM-dd.csv) e extratos de conta (NU_...).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={importing}
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {file && !error && (
            <div className="flex items-center space-x-2 text-sm text-primary bg-primary/10 p-3 rounded-md">
              <FileCheck className="h-4 w-4" />
              <span>Arquivo selecionado: <strong>{file.name}</strong></span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline" onClick={onBack} disabled={importing}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file || importing}>
            {importing ? 'Importando...' : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Iniciar Importação
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
