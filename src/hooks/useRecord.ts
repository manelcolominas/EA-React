import { useEffect, useState } from 'react';
import recordService from '../services/record-service';
import { CanceledError } from 'axios';
import { Record } from '../models/Record';

interface UseRecordsReturn {
  records: Record[];
  loading: boolean;
  error: string;
  fetchRecords: () => void;
}

/**
 * Custom hook for reading backend-generated traceability records.
 * Handles loading, error states, and communication with record-service.
 */
export function useRecord(): UseRecordsReturn {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return fetchRecords();
  }, []);

  const fetchRecords = () => {
    setLoading(true);
    setError('');
    const { request, cancel } = recordService.getAll<Record>();

    request
      .then((res) => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError((err as Error).message);
        setLoading(false);
      });

    return () => cancel();
  };

  return {
    records,
    loading,
    error,
    fetchRecords,
  };
}

