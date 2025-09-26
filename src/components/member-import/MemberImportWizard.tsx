import React, { useState, useCallback } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, Users, FileSpreadsheet, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import FileUploadStep from './FileUploadStep';
import DataPreviewStep from './DataPreviewStep';
import ImportConfirmStep from './ImportConfirmStep';
import ImportResultsStep from './ImportResultsStep';

type ImportStep = 'upload' | 'preview' | 'confirm' | 'results';

interface ImportData {
  file: File | null;
  importLogId: string | null;
  parsedData: any[];
  validationResults: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    errors: any[];
  } | null;
  finalResults: {
    successCount: number;
    failureCount: number;
    errors: any[];
  } | null;
}

interface MemberImportWizardProps {
  clubId: string;
  onComplete?: () => void;
}

export default function MemberImportWizard({ clubId, onComplete }: MemberImportWizardProps) {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importData, setImportData] = useState<ImportData>({
    file: null,
    importLogId: null,
    parsedData: [],
    validationResults: null,
    finalResults: null
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const downloadTemplate = useCallback(() => {
    const templateData = [
      {
        'Name': 'John Doe',
        'Email': 'john.doe@example.com',
        'Phone': '(555) 123-4567',
        'Home State': 'Alabama',
        'City': 'Birmingham',
        'Club Role': 'Member',
        'Signature Techniques': 'Crankbait, Spinnerbait, Drop Shot',
        'Emergency Contact': 'Jane Doe - (555) 123-4568',
        'Boat Registration': 'AL-1234-AB'
      }
    ];

    const csv = [
      Object.keys(templateData[0]).join(','),
      Object.values(templateData[0]).map(val => `"${val}"`).join(',')
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Template downloaded',
      description: 'Use this template to format your member data correctly.'
    });
  }, [toast]);

  const handleFileUpload = useCallback(async (file: File, parsedData: any[]) => {
    if (!user) return;

    setIsProcessing(true);
    try {
      // Create import log entry
      const { data: importLog, error: logError } = await supabase
        .from('member_import_logs')
        .insert({
          club_id: clubId,
          imported_by: user.id,
          file_name: file.name,
          file_size: file.size,
          status: 'processing'
        })
        .select()
        .single();

      if (logError) throw logError;

      // Process the data through edge function
      const { data: validationResults, error: processError } = await supabase.functions.invoke(
        'process-member-import',
        {
          body: {
            importLogId: importLog.id,
            data: parsedData
          }
        }
      );

      if (processError) throw processError;

      setImportData({
        file,
        importLogId: importLog.id,
        parsedData,
        validationResults,
        finalResults: null
      });

      setCurrentStep('preview');
      
      toast({
        title: 'File processed',
        description: `Found ${validationResults.validRows} valid records out of ${validationResults.totalRows} total.`
      });

    } catch (error: any) {
      console.error('Error processing file:', error);
      toast({
        title: 'Processing failed',
        description: error.message || 'Failed to process the uploaded file.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user, clubId, toast]);

  const handleConfirmImport = useCallback(async () => {
    if (!importData.importLogId) return;

    setIsProcessing(true);
    try {
      const { data: results, error } = await supabase.functions.invoke(
        'complete-member-import',
        {
          body: {
            importLogId: importData.importLogId,
            clubId
          }
        }
      );

      if (error) throw error;

      setImportData(prev => ({
        ...prev,
        finalResults: results
      }));

      setCurrentStep('results');

      toast({
        title: 'Import completed',
        description: `Successfully imported ${results.successCount} members.`
      });

    } catch (error: any) {
      console.error('Error completing import:', error);
      toast({
        title: 'Import failed',
        description: error.message || 'Failed to complete the import.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [importData.importLogId, clubId, toast]);

  const handleReset = useCallback(() => {
    setCurrentStep('upload');
    setImportData({
      file: null,
      importLogId: null,
      parsedData: [],
      validationResults: null,
      finalResults: null
    });
  }, []);

  const getStepNumber = (step: ImportStep): number => {
    const steps = ['upload', 'preview', 'confirm', 'results'];
    return steps.indexOf(step) + 1;
  };

  const isStepCompleted = (step: ImportStep): boolean => {
    const stepNumber = getStepNumber(step);
    const currentStepNumber = getStepNumber(currentStep);
    return stepNumber < currentStepNumber;
  };

  return (
    <PermissionGuard permission="club.manage.members" clubId={clubId}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Member Import Wizard
            </CardTitle>
            <CardDescription>
              Import multiple club members from CSV or Excel files
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Progress Steps */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              {(['upload', 'preview', 'confirm', 'results'] as ImportStep[]).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      isStepCompleted(step)
                        ? 'bg-green-500 text-white'
                        : currentStep === step
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isStepCompleted(step) ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < 3 && (
                    <ArrowRight
                      className={`h-4 w-4 mx-2 ${
                        isStepCompleted(step) ? 'text-green-500' : 'text-muted-foreground'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className={currentStep === 'upload' ? 'font-medium' : 'text-muted-foreground'}>
                Upload File
              </span>
              <span className={currentStep === 'preview' ? 'font-medium' : 'text-muted-foreground'}>
                Preview Data
              </span>
              <span className={currentStep === 'confirm' ? 'font-medium' : 'text-muted-foreground'}>
                Confirm Import
              </span>
              <span className={currentStep === 'results' ? 'font-medium' : 'text-muted-foreground'}>
                Results
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Template Download */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Download Template</p>
                  <p className="text-sm text-muted-foreground">
                    Get the CSV template with required columns and sample data
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="space-y-6">
          {isProcessing && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span>Processing...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 'upload' && (
            <FileUploadStep
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 'preview' && importData.validationResults && (
            <DataPreviewStep
              importLogId={importData.importLogId!}
              validationResults={importData.validationResults}
              onNext={() => setCurrentStep('confirm')}
              onBack={() => setCurrentStep('upload')}
            />
          )}

          {currentStep === 'confirm' && importData.validationResults && (
            <ImportConfirmStep
              validationResults={importData.validationResults}
              onConfirm={handleConfirmImport}
              onBack={() => setCurrentStep('preview')}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 'results' && importData.finalResults && (
            <ImportResultsStep
              results={importData.finalResults}
              onStartOver={handleReset}
              onComplete={onComplete}
            />
          )}
        </div>
      </div>
    </PermissionGuard>
  );
}