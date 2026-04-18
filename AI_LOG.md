GEMINI ASSISTANT CODE

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '../../models/User';
import { Organization } from '../../models/Organization';
import { useEffect } from 'react';
import Button from '../Button/Button';

const schema = z.object({
name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
email: z.string().email({ message: 'Invalid email address.' }),
organization: z.string().min(1, { message: 'Please select an organization.' }),
password: z.union([z.string().min(6, { message: 'Password must be at least 6 characters.' }),z.literal('')]).optional(),
});

export type UserFormData = z.infer<typeof schema>;

interface Props {
onSubmit: (data: UserFormData) => void;
initialData?: User;
onCancel: () => void;
organizations: Organization[];
}

/**
* RecordForm component - Displays a form for creating/editing users
* Handles only form rendering and validation, logic is managed by parent component
  */
  const RecordForm = ({ onSubmit, initialData, onCancel, organizations }: Props) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({ resolver: zodResolver(schema) });

useEffect(() => {
if (initialData) {
const orgId =
typeof initialData.organization === 'object' &&
initialData.organization !== null
? initialData.organization._id
: initialData.organization;

      reset({
        name: initialData.name,
        email: initialData.email,
        organization: orgId as string,
        password: '',
      });
    }
}, [initialData, reset]);

return (
<form
onSubmit={handleSubmit((data) => {
onSubmit(data);
reset();
})}
className="mb-4 p-3 border rounded bg-light"
>
<h4 className="mb-3">
{initialData ? 'Edit User' : 'New User'}
</h4>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          className="form-control"
        />
        {errors.name && (
          <p className="text-danger">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          className="form-control"
        />
        {errors.email && (
          <p className="text-danger">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          {...register('password')}
          id="password"
          type="password"
          className="form-control"
          placeholder={
            initialData
              ? 'Leave blank to keep current'
              : 'Required for new users'
          }
        />
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="organization" className="form-label">
          Organization
        </label>
        <select
          {...register('organization')}
          id="organization"
          className="form-select"
        >
          <option value="">Select an organization...</option>
          {organizations.map((org) => (
            <option key={org._id} value={org._id}>
              {org.name}
            </option>
          ))}
        </select>
        {errors.organization && (
          <p className="text-danger">{errors.organization.message}</p>
        )}
      </div>

      <div className="d-flex justify-content-end">
        <Button type="button" className="me-2" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" color="primary">
          {initialData ? 'Update' : 'Add'}
        </Button>
      </div>
    </form>
);
};

export default RecordForm;




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
