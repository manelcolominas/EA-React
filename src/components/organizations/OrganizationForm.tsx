import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Organization } from '../../models/Organization';
import { useEffect } from 'react';
import Button from '../Button/Button';
import { User } from '../../models/User';

const schema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  users: z.array(z.string()).default([]),
});

export type OrganizationFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: OrganizationFormData) => void;
  initialData?: Organization;
  onCancel: () => void;
  allUsers?: User[];
}

/**
 * OrganizationForm component - Displays a form for creating/editing organizations
 * Handles form rendering, validation, and user selection
 */
const OrganizationForm = ({ onSubmit, initialData, onCancel, allUsers = [] }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrganizationFormData>({ 
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      users: []
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        users: initialData.users || [],
      });
    } else {
      reset({
        name: '',
        users: []
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
        {initialData ? 'Edit Organization' : 'New Organization'}
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
        <label className="form-label">Users</label>
        <div className="border rounded p-2 bg-white" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {allUsers.length === 0 && <p className="text-muted m-0">No users available</p>}
          {allUsers.map((user) => (
            <div key={user._id} className="form-check">
              <input
                {...register('users')}
                className="form-check-input"
                type="checkbox"
                value={user._id}
                id={`user-${user._id}`}
              />
              <label className="form-check-label" htmlFor={`user-${user._id}`}>
                {user.name} ({user.email})
              </label>
            </div>
          ))}
        </div>
        {errors.users && (
          <p className="text-danger">{errors.users.message}</p>
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

export default OrganizationForm;
