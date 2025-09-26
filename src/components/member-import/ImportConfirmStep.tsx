import React from 'react';
import { CheckCircle, AlertTriangle, Users, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ValidationResults {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: any[];
}

interface ImportConfirmStepProps {
  validationResults: ValidationResults;
  onConfirm: () => void;
  onBack: () => void;
  isProcessing: boolean;
}

export default function ImportConfirmStep({ 
  validationResults, 
  onConfirm, 
  onBack, 
  isProcessing 
}: ImportConfirmStepProps) {
  return (
    <div className="space-y-6">
      {/* Import Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Confirm Import
          </CardTitle>
          <CardDescription>
            Review the import details before proceeding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Import Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Records to Import</span>
                  <span className="text-lg font-bold text-green-600">
                    {validationResults.validRows}
                  </span>
                </div>
                {validationResults.invalidRows > 0 && (
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">Records to Skip</span>
                    <span className="text-lg font-bold text-red-600">
                      {validationResults.invalidRows}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">What will happen:</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Create User Accounts</p>
                    <p className="text-muted-foreground">
                      New user accounts will be created for each valid member
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Send Welcome Emails</p>
                    <p className="text-muted-foreground">
                      Welcome emails with login instructions will be sent automatically
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Assign Club Roles</p>
                    <p className="text-muted-foreground">
                      Members will be assigned their specified club roles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {validationResults.invalidRows > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> {validationResults.invalidRows} records have validation 
                errors and will be skipped. Only {validationResults.validRows} valid records will 
                be imported. You can fix the errors in your source file and run another import later.
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              <strong>Email Notifications:</strong> Each imported member will receive a welcome 
              email with instructions to set their password and log in to the system.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Final Confirmation */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Ready to import {validationResults.validRows} members?
              </h3>
              <p className="text-muted-foreground">
                This action cannot be undone. User accounts will be created and welcome emails sent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Preview
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={isProcessing || validationResults.validRows === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Importing Members...
            </>
          ) : (
            <>
              Confirm Import
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}