import { useMemo, useState } from 'react';
import { useRecord } from '../../hooks/useRecord';
import RecordList from './RecordList';
import Button from '../Button/Button';

/**
 * RecordManagement component - Read-only traceability browser for backend-generated records.
 */
export default function RecordManagement() {
  const { records, loading, error, fetchRecords } = useRecord();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return records;
    }

    return records.filter((record) => {
      const searchBlob = [
        record.relatedEntityType,
        record.relatedEntityId,
        record.action,
        record._id,
        record.createdAt,
        typeof record.performedBy === 'string' ? record.performedBy : record.performedBy?.name,
        ...(record.changes ?? []).flatMap((change) => [
          change.field,
          change.previous == null ? '' : String(change.previous),
          change.current == null ? '' : String(change.current),
        ]),
      ]
        .join(' ')
        .toLowerCase();

      return searchBlob.includes(normalizedSearch);
    });
  }, [records, searchTerm]);

  const handleRefresh = () => {
    fetchRecords();
  };

  return (
    <div>
      <h2 className="mb-4">Traceability Records</h2>
      <p className="text-muted">
        Read-only audit log for backend-generated changes to users and organizations.
      </p>
      {error && <p className="text-danger">{error}</p>}
      {loading && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <Button color="secondary" onClick={handleRefresh}>
            Refresh
          </Button>
          <span className="text-muted small">
            {filteredRecords.length} of {records.length} records
          </span>
        </div>
        <div className="flex-grow-1 ms-3" style={{ maxWidth: '360px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by entity, action, record ID, or change field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredRecords.length > 0 ? (
        <RecordList records={filteredRecords} />
      ) : (
        !loading && (
          <div className="alert alert-info mb-0">
            No records match the current search.
          </div>
        )
      )}
    </div>
  );
}
