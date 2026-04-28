import { useState } from 'react';
import { RefreshCw, AlertTriangle, Users, Clock } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

function Dashboard() {
  const [requests, setRequests] = useState([
    {
      id: 'REQ-001',
      type: 'Medical Emergency',
      urgency: 'High',
      location: 'Downtown District',
      volunteer: 'Sarah Chen',
      status: 'In Progress',
      time: '2 min ago',
    },
    {
      id: 'REQ-002',
      type: 'Food Delivery',
      urgency: 'Medium',
      location: 'North Side',
      volunteer: 'Mike Ross',
      status: 'Assigned',
      time: '15 min ago',
    },
    {
      id: 'REQ-003',
      type: 'Power Outage',
      urgency: 'Low',
      location: 'East Village',
      volunteer: 'Unassigned',
      status: 'Pending',
      time: '32 min ago',
    },
    {
      id: 'REQ-004',
      type: 'Water Leak',
      urgency: 'High',
      location: 'Harbor Area',
      volunteer: 'Lisa Park',
      status: 'En Route',
      time: '5 min ago',
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const stats = [
    { label: 'Active', value: requests.length, icon: AlertTriangle },
    { label: 'Volunteers', value: '12', icon: Users },
    { label: 'Avg Response', value: '8m', icon: Clock },
  ];

  const statusStyles = {
    'In Progress': { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563eb' },
    'En Route': { bg: 'rgba(170, 59, 255, 0.12)', text: 'var(--accent)' },
    Assigned: { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669' },
    Pending: { bg: 'var(--code-bg)', text: 'var(--text)' },
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Command Center</h1>
          <p style={{ color: 'var(--text)' }}>
            Monitor and manage active emergency requests
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 hover:opacity-80 active:scale-[0.98] border"
          style={{
            background: 'var(--bg)',
            borderColor: 'var(--border)',
            color: 'var(--text-h)',
          }}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Updating...' : 'Refresh Data'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl border flex items-center gap-4"
            style={{
              background: 'var(--bg)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div
              className="p-3 rounded-lg"
              style={{ background: 'var(--code-bg)' }}
            >
              <stat.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-2xl font-medium" style={{ color: 'var(--text-h)', fontFamily: 'var(--heading)' }}>
                {stat.value}
              </p>
              <p className="text-sm font-medium opacity-70" style={{ color: 'var(--text)' }}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Requests Table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: 'var(--bg)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div
          className="px-6 py-4 border-b"
          style={{
            background: 'var(--code-bg)',
            borderColor: 'var(--border)',
          }}
        >
          <h2>Active Requests</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                style={{
                  background: 'var(--code-bg)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {['ID', 'Type', 'Urgency', 'Location', 'Volunteer', 'Status', 'Time'].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--text)' }}
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {requests.map((req) => {
                const statusStyle = statusStyles[req.status] || statusStyles.Pending;
                return (
                  <tr
                    key={req.id}
                    className="transition-colors duration-150"
                    style={{ borderColor: 'var(--border)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--code-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg)';
                    }}
                  >
                    <td className="px-6 py-4 text-sm font-mono" style={{ color: 'var(--text)' }}>
                      {req.id}
                    </td>
                    <td
                      className="px-6 py-4 text-sm font-medium"
                      style={{ color: 'var(--text-h)' }}
                    >
                      {req.type}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge urgency={req.urgency} />
                    </td>
                    <td className="px-6 py-4 text-sm hidden sm:table-cell" style={{ color: 'var(--text)' }}>
                      {req.location}
                    </td>
                    <td className="px-6 py-4 text-sm hidden md:table-cell" style={{ color: 'var(--text)' }}>
                      {req.volunteer}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                        }}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-sm hidden lg:table-cell"
                      style={{ color: 'var(--text)' }}
                    >
                      {req.time}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {requests.length === 0 && (
          <div className="px-6 py-12 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: 'var(--text)' }} />
            <p className="text-lg font-medium" style={{ color: 'var(--text-h)' }}>
              No active requests
            </p>
            <p className="text-sm" style={{ color: 'var(--text)' }}>
              All clear! Check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;