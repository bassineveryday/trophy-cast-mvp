import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface FileUploadStepProps {
  onFileUpload: (file: File, data: any[]) => void;
  isProcessing: boolean;
}

export default function FileUploadStep({ onFileUpload, isProcessing }: FileUploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.replace(/"/g, '').trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header.toLowerCase().replace(/\s+/g, '_')] = values[index] || '';
      });
      
      data.push(row);
    }

    return data;
  };

  const parseExcel = async (file: File): Promise<any[]> => {
    // This would require a library like xlsx
    // For now, we'll show an error message
    throw new Error('Excel file parsing not yet implemented. Please use CSV format.');
  };

  const handleFile = useCallback(async (file: File) => {
    try {
      const fileType = file.name.toLowerCase();
      let data: any[] = [];

      if (fileType.endsWith('.csv')) {
        const text = await file.text();
        data = parseCSV(text);
      } else if (fileType.endsWith('.xlsx') || fileType.endsWith('.xls')) {
        data = await parseExcel(file);
      } else {
        throw new Error('Unsupported file type. Please use CSV or Excel files.');
      }

      if (data.length === 0) {
        throw new Error('No data found in file. Please check the file format.');
      }

      // Validate required columns
      const firstRow = data[0];
      const requiredColumns = ['name', 'email'];
      const missingColumns = requiredColumns.filter(col => !firstRow.hasOwnProperty(col));

      if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
      }

      setSelectedFile(file);
      onFileUpload(file, data);

    } catch (error: any) {
      console.error('Error parsing file:', error);
      toast({
        title: 'File parsing failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  }, [onFileUpload, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Member Data
        </CardTitle>
        <CardDescription>
          Upload a CSV or Excel file containing member information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {selectedFile ? selectedFile.name : 'Drop your file here, or click to browse'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports CSV and Excel files (.csv, .xlsx, .xls)
            </p>
          </div>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={isProcessing}
          />
          <label htmlFor="file-upload">
            <Button className="mt-4" disabled={isProcessing}>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </label>
        </div>

        {/* Requirements */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Required columns:</strong> Name, Email
            <br />
            <strong>Optional columns:</strong> Phone, Home State, City, Club Role, 
            Signature Techniques, Emergency Contact, Boat Registration
          </AlertDescription>
        </Alert>

        {/* Format Guidelines */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium">File Format Guidelines:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• First row should contain column headers</li>
            <li>• Email addresses must be unique and valid</li>
            <li>• Club roles: Member, President, Vice President, Secretary, Treasurer, Tournament Director, Conservation Director</li>
            <li>• Signature techniques should be comma-separated</li>
            <li>• Phone numbers can include formatting (parentheses, dashes, spaces)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}