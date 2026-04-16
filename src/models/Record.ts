export interface RecordChange {
  field: string;
  previous?: unknown;
  current?: unknown;
}

export interface Record {
  _id: string;
  relatedEntityType: string;
  relatedEntityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  changes?: RecordChange[];
  performedBy?: string | { _id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}