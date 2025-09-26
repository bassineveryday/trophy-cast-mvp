import React from 'react';
import { CheckCircle, AlertCircle, Users, RotateCcw, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ImportResults {
  successCount: number;
  failureCount: number;
  errors: Array<{
    row: number;
    email: string;
    error: string;
  }>;
}

interface ImportResultsStepProps {
  results: ImportResults;
  onStartOver: () => void;
  onComplete?: () => void;
}

export default function ImportResultsStep({ 
  results, 
  onStartOver, 
  onComplete 
}: ImportResultsStepProps) {
  const totalProcessed = results.successCount + results.failureCount;
  const successRate = totalProcessed > 0 ? (results.successCount / totalProcessed) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Import Completed!
          </CardTitle>
          <CardDescription>
            Your member import has been processed
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Import Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{results.successCount}</div>
              <div className="text-sm text-muted-foreground">Successfully Imported</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{results.failureCount}</div>
              <div className="text-sm text-muted-foreground">Failed Imports</div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-3xl font-bold text-primary">{successRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>

          {/* Success Message */}
          {results.successCount > 0 && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Great!</strong> {results.successCount} members have been successfully 
                imported and welcome emails have been sent. They can now log in to the system.
              </AlertDescription>
            </Alert>
          )}

          {/* Failure Details */}
          {results.failureCount > 0 && (
            <>
              <Alert className="mb-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> {results.failureCount} members could not be imported 
                  due to errors. Review the details below.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h4 className="font-semibold">Failed Import Details:</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.errors.map((error, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge variant="destructive">{error.row}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{error.email}</TableCell>
                          <TableCell className="text-red-600 text-sm">{error.error}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Welcome Emails Sent</p>
                <p className="text-sm text-muted-foreground">
                  All successfully imported members have received welcome emails with login instructions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Club Roles Assigned</p>
                <p className="text-sm text-muted-foreground">
                  Members have been assigned their specified club roles and can access relevant features.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Member Management</p>
                <p className="text-sm text-muted-foreground">
                  You can now manage these members through the club management dashboard.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={onStartOver}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Import More Members
        </Button>
        {onComplete && (
          <Button onClick={onComplete}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Go to Member Management
          </Button>
        )}
      </div>
    </div>
  );
}