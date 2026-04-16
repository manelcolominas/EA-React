import { useState } from 'react';
import UserManagement from './components/users/UserManagement';
import OrganizationManagement from './components/organizations/OrganizationManagement';
import RecordManagement from './components/records/RecordManagement';

function App() {
  const [view, setView] = useState<'users' | 'organizations' | 'records'>('users');

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${view === 'users' ? 'active' : ''}`}
            onClick={() => setView('users')}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${view === 'organizations' ? 'active' : ''}`}
            onClick={() => setView('organizations')}
          >
            Organizations
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${view === 'records' ? 'active' : ''}`}
            onClick={() => setView('records')}
          >
            Records
          </button>
        </li>
      </ul>

      {view === 'users' && <UserManagement />}
      {view === 'organizations' && <OrganizationManagement />}
      {view === 'records' && <RecordManagement />}
    </div>
  );
}

export default App;
