import { User } from '../../models/User';
import Button from '../Button/Button';

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

/**
 * RecordList component - Displays a list of users
 * Handles only rendering, logic is managed by parent component
 */
const UserList = ({ users, onEdit, onDelete }: Props) => {
  const getOrganizationName = (organization: User['organization']) => {
    if (typeof organization === 'object' && organization !== null) {
      return organization.name;
    }
    return organization; // Fallback to showing the ID string
  };

  return (
    <ul className="list-group">
      {users.map((user) => (
        <li
          key={user._id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <span className="fw-bold">{user.name}</span>
            <span className="mx-2 text-muted">|</span>
            <span>{user.email}</span>
            <span className="mx-2 text-muted">|</span>
            <span className="badge bg-info text-dark">
              {getOrganizationName(user.organization)}
            </span>
          </div>
          <div>
            <Button
              className="mx-1"
              color="secondary"
              onClick={() => onEdit(user)}
            >
              Edit
            </Button>
            <Button
              color="danger"
              onClick={() => onDelete(user)}
            >
              Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
