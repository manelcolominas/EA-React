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
  organization: z
    .string()
    .min(1, { message: 'Please select an organization.' }),
  password: z
    .union([
      z.string().min(6, { message: 'Password must be at least 6 characters.' }),
      z.literal(''),
    ])
    .optional(),
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({ resolver: zodResolver(schema) });

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
