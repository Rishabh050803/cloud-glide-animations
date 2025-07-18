import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { storageService } from '@/services/storageService';

export function StorageStatus() {
  const [status, setStatus] = useState<{ status: string; provider: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await storageService.getStorageStatus();
        setStatus(result);
      } catch (err) {
        setError('Unable to connect to storage service');
        console.error(err);
      }
    };

    checkStatus();
  }, []);

  if (!status && !error) {
    return null; // Loading state
  }

  if (error || status?.status !== 'ok') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Storage Service Issue</AlertTitle>
        <AlertDescription>
          {error || `Storage service reports: ${status?.status}`}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="default" className="bg-green-50 border-green-200">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle>Storage Connected</AlertTitle>
      <AlertDescription>
        Using {status.provider} for secure cloud storage
      </AlertDescription>
    </Alert>
  );
}