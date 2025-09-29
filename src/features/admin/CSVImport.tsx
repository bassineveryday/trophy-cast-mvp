import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BackButton from '@/components/BackButton';
import { Upload, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ParsedRow = {
  tournament_id?: string;
  angler_id?: string;
  fish_count?: number;
  weight_lbs?: number;
  big_fish_lbs?: number;
  valid: boolean;
  errors: string[];
};

export default function CSVImport() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file',
        description: 'Please select a CSV file',
      });
      return;
    }

    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const requiredColumns = ['tournament_id', 'angler_id', 'fish_count', 'weight_lbs'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Invalid CSV',
          description: `Missing columns: ${missingColumns.join(', ')}`,
        });
        return;
      }

      const parsed: ParsedRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx];
        });

        const errors: string[] = [];
        if (!row.tournament_id) errors.push('Missing tournament_id');
        if (!row.angler_id) errors.push('Missing angler_id');
        if (!row.fish_count || isNaN(parseInt(row.fish_count))) errors.push('Invalid fish_count');
        if (!row.weight_lbs || isNaN(parseFloat(row.weight_lbs))) errors.push('Invalid weight_lbs');

        parsed.push({
          tournament_id: row.tournament_id,
          angler_id: row.angler_id,
          fish_count: parseInt(row.fish_count) || 0,
          weight_lbs: parseFloat(row.weight_lbs) || 0,
          big_fish_lbs: row.big_fish_lbs ? parseFloat(row.big_fish_lbs) : undefined,
          valid: errors.length === 0,
          errors,
        });
      }

      setPreview(parsed);
      
      const validCount = parsed.filter(r => r.valid).length;
      const invalidCount = parsed.length - validCount;
      
      setSummary({
        total: parsed.length,
        valid: validCount,
        invalid: invalidCount,
        data: parsed.filter(r => r.valid),
      });
    };

    reader.readAsText(file);
  };

  const generateImportInstructions = () => {
    if (!summary) return;

    const instructions = `
# CSV Import Instructions for Admin

**File:** ${file?.name}
**Valid Rows:** ${summary.valid} / ${summary.total}

## Option 1: Supabase UI Import
1. Go to Supabase Dashboard → Table Editor
2. Select the "tournament_results" or "catches" table
3. Click "Import data from CSV"
4. Upload the validated CSV

## Option 2: Edge Function Import (Recommended for large files)
Create an edge function to batch insert:

\`\`\`sql
-- SQL to run in Supabase SQL Editor:
${summary.data.slice(0, 10).map((row: any) => 
  `INSERT INTO catches (tournament_id, user_id, weight, notes) 
   VALUES ('${row.tournament_id}', '${row.angler_id}', ${row.weight_lbs}, 'Imported from CSV');`
).join('\n')}
-- ... (${summary.data.length} total rows)
\`\`\`

## Data Summary JSON
\`\`\`json
${JSON.stringify(summary.data, null, 2)}
\`\`\`
    `.trim();

    navigator.clipboard.writeText(instructions);
    toast({
      title: 'Copied',
      description: 'Import instructions copied to clipboard',
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <BackButton />
      
      <div className="max-w-4xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-6 h-6 mr-2" />
              CSV Import (Admin)
            </CardTitle>
            <CardDescription>
              Upload and validate tournament results CSV. UI-only preview - admin must import via Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Required columns: tournament_id, angler_id, fish_count, weight_lbs, big_fish_lbs (optional)
                </p>
              </div>

              {summary && (
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{summary.total}</div>
                        <div className="text-xs text-muted-foreground">Total Rows</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-success">{summary.valid}</div>
                        <div className="text-xs text-muted-foreground">Valid</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-destructive">{summary.invalid}</div>
                        <div className="text-xs text-muted-foreground">Invalid</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {preview.length > 0 && (
                <>
                  <div className="border rounded-lg max-h-96 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Tournament ID</TableHead>
                          <TableHead>Angler ID</TableHead>
                          <TableHead>Fish Count</TableHead>
                          <TableHead>Weight (lbs)</TableHead>
                          <TableHead>Big Fish (lbs)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {preview.slice(0, 50).map((row, idx) => (
                          <TableRow key={idx} className={!row.valid ? 'bg-destructive/10' : ''}>
                            <TableCell>
                              {row.valid ? (
                                <CheckCircle className="w-4 h-4 text-success" />
                              ) : (
                                <div title={row.errors.join(', ')}>
                                  <XCircle className="w-4 h-4 text-destructive" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs">{row.tournament_id}</TableCell>
                            <TableCell className="font-mono text-xs">{row.angler_id}</TableCell>
                            <TableCell>{row.fish_count}</TableCell>
                            <TableCell>{row.weight_lbs}</TableCell>
                            <TableCell>{row.big_fish_lbs || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {preview.length > 50 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Showing first 50 of {preview.length} rows
                    </p>
                  )}

                  <Button 
                    onClick={generateImportInstructions} 
                    className="w-full"
                    disabled={!summary || summary.valid === 0}
                  >
                    Generate Import Instructions
                  </Button>

                  <Card className="bg-warning/10 border-warning">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold mb-1">Admin Action Required</p>
                          <p className="text-muted-foreground">
                            This UI only validates CSV data. Click "Generate Import Instructions" to get the SQL 
                            commands or JSON data for importing via Supabase Dashboard or Edge Function.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
