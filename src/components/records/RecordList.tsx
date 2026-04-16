import { Record } from '../../models/Record';

interface Props {
  records: Record[];
}

/**
 * RecordList component - Displays read-only traceability records.
 */
const RecordList = ({ records }: Props) => {
  const formatValue = (value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) {
      return null;
    }

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const getActionBadgeClass = (action: Record['action']) => {
    switch (action) {
      case 'CREATE':
        return 'bg-success';
      case 'UPDATE':
        return 'bg-primary';
      case 'DELETE':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getActorLabel = (performedBy?: Record['performedBy']) => {
    if (!performedBy) {
      return null;
    }

    if (typeof performedBy === 'string') {
      return performedBy;
    }

    return performedBy.name;
  };

  return (
    <div className="list-group">
      {records.map((record) => {
        const actorLabel = getActorLabel(record.performedBy);
        const formattedTimestamp = formatTimestamp(record.createdAt);

        return (
          <div key={record._id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                  <span className="badge bg-dark">{record.relatedEntityType}</span>
                  <span className={`badge ${getActionBadgeClass(record.action)}`}>
                    {record.action}
                  </span>
                  {formattedTimestamp && (
                    <span className="text-muted small">{formattedTimestamp}</span>
                  )}
                </div>
                <div className="fw-semibold">Entity ID: {record.relatedEntityId}</div>
                <div className="text-muted small">Record ID: {record._id}</div>
                {actorLabel && (
                  <div className="text-muted small">Actor: {actorLabel}</div>
                )}
              </div>
            </div>

            <div className="mt-3">
              <div className="fw-semibold mb-2">Changes</div>
              {record.changes && record.changes.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Previous</th>
                        <th>Current</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.changes.map((change, index) => (
                        <tr key={`${record._id}-${change.field}-${index}`}>
                          <td className="fw-semibold">{change.field}</td>
                          <td>{formatValue(change.previous)}</td>
                          <td>{formatValue(change.current)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">No field-level changes available for this entry.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecordList;
