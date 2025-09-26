import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Eye, ArrowRight, ArrowLeft, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

interface ValidationResults {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: any[];
}

interface DataPreviewStepProps {
  importLogId: string;
  validationResults: ValidationResults;
  onNext: () => void;
  onBack: () => void;
}

interface StagingRow {
  id: string;
  row_number: number;
  name: string;
  email: string;
  phone?: string;
  home_state?: string;
  city?: string;
  club_role: string;
  signature_techniques: string[];
  emergency_contact?: string;
  boat_registration?: string;
  validation_errors: any;
  is_valid: boolean;
  is_duplicate: boolean;
}

export default function DataPreviewStep({ 
  importLogId, 
  validationResults, 
  onNext, 
  onBack 
}: DataPreviewStepProps) {
  const [previewData, setPreviewData] = useState<StagingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        const { data, error } = await supabase
          .from('member_import_staging')
          .select('*')
          .eq('import_log_id', importLogId)
          .order('row_number')
          .limit(10);

        if (error) throw error;
        setPreviewData(data || []);
      } catch (error) {
        console.error('Error fetching preview data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreviewData();
  }, [importLogId]);

  const validData = previewData.filter(row => row.is_valid);
  const invalidData = previewData.filter(row => !row.is_valid);

  const getErrorMessage = (errors: any, isDuplicate: boolean) => {
    if (isDuplicate) return 'Duplicate email address';
    if (!errors) return '';
    
    // Handle both array and object formats
    const errorArray = Array.isArray(errors) ? errors : (errors ? [errors] : []);
    if (errorArray.length === 0) return '';
    
    return errorArray.map((err: any) => `${err.field}: ${err.message}`).join(', ');
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Loading preview data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Data Preview & Validation
          </CardTitle>
          <CardDescription>
            Review the uploaded data and validation results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-primary">{validationResults.totalRows}</div>
              <div className="text-sm text-muted-foreground">Total Rows</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{validationResults.validRows}</div>
              <div className="text-sm text-muted-foreground">Valid Records</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{validationResults.invalidRows}</div>
              <div className="text-sm text-muted-foreground">Invalid Records</div>
            </div>
          </div>

          {validationResults.invalidRows > 0 && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {validationResults.invalidRows} records have validation errors and will be skipped during import.
                Review the errors below and fix them in your source file if needed.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Data Preview (First 10 rows)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="valid" className="space-y-4">
            <TabsList>
              <TabsTrigger value="valid" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Valid Records ({validData.length})
              </TabsTrigger>
              <TabsTrigger value="invalid" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Invalid Records ({invalidData.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="valid">
              {validData.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.row_number}</TableCell>
                          <TableCell className="font-medium">{row.name}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.phone || '-'}</TableCell>
                          <TableCell>{row.home_state || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {formatRole(row.club_role)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Valid
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No valid records found in the preview
                </div>
              )}
            </TabsContent>

            <TabsContent value="invalid">
              {invalidData.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invalidData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.row_number}</TableCell>
                          <TableCell>{row.name || '-'}</TableCell>
                          <TableCell>{row.email || '-'}</TableCell>
                          <TableCell>
                            <div className="text-red-600 text-sm">
                              {getErrorMessage(row.validation_errors, row.is_duplicate)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No invalid records in the preview
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Upload
        </Button>
        <Button 
          onClick={onNext} 
          disabled={validationResults.validRows === 0}
        >
          Continue to Import
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}