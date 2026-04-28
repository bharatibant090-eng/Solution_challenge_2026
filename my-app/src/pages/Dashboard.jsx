// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { RefreshCw, AlertTriangle, Users, Clock } from 'lucide-react';
// import { API_BASE_URL } from '../App';
// import StatusBadge from '../components/StatusBadge';

// function Dashboard() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchRequests = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/get-requests`);
//       // Maps backend data to your beautiful UI fields
//       setRequests(response.data.requests || []);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to load live data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   // Stats calculation from real data
//   const activeCount = requests.length;
//   const volunteerCount = new Set(requests.map((r) => r.assigned_volunteer).filter(Boolean)).size;

//   const stats = [
//     { label: 'Active', value: activeCount, icon: AlertTriangle },
//     { label: 'Volunteers', value: volunteerCount || '0', icon: Users },
//     { label: 'Avg Response', value: '8m', icon: Clock },
//   ];

//   const statusStyles = {
//     'In Progress': { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563eb' },
//     'En Route': { bg: 'rgba(170, 59, 255, 0.12)', text: 'var(--accent)' },
//     'Assigned': { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669' },
//     'Pending': { bg: 'var(--code-bg)', text: 'var(--text)' },
//     'Active': { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563eb' }, // Added for integration
//   };

//   // Time helper
//   const formatTime = (isoString) => {
//     if (!isoString) return '—';
//     const diff = Math.floor((new Date() - new Date(isoString)) / 60000);
//     return diff < 1 ? 'Just now' : `${diff}m ago`;
//   };

//   return (
//     <div className="space-y-6 text-left">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 style={{ color: 'var(--text-h)', fontFamily: 'var(--heading)' }}>Command Center</h1>
//           <p style={{ color: 'var(--text)' }}>Monitor and manage active emergency requests</p>
//         </div>
//         <button
//           onClick={fetchRequests}
//           disabled={loading}
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 hover:opacity-80 active:scale-[0.98] border"
//           style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-h)' }}
//         >
//           <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//           {loading ? 'Updating...' : 'Refresh Data'}
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         {stats.map((stat) => (
//           <div key={stat.label} className="p-5 rounded-xl border flex items-center gap-4"
//             style={{ background: 'var(--bg)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
//             <div className="p-3 rounded-lg" style={{ background: 'var(--code-bg)' }}>
//               <stat.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
//             </div>
//             <div>
//               <p className="text-2xl font-medium" style={{ color: 'var(--text-h)', fontFamily: 'var(--heading)' }}>{stat.value}</p>
//               <p className="text-sm font-medium opacity-70" style={{ color: 'var(--text)' }}>{stat.label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Requests Table */}
//       <div className="rounded-xl border overflow-hidden"
//         style={{ background: 'var(--bg)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
//         <div className="px-6 py-4 border-b" style={{ background: 'var(--code-bg)', borderColor: 'var(--border)' }}>
//           <h2 style={{ color: 'var(--text-h)' }}>Active Requests</h2>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr style={{ background: 'var(--code-bg)', borderBottom: '1px solid var(--border)' }}>
//                 {['ID', 'Type', 'Urgency', 'People', 'Volunteer', 'Status', 'Time'].map((header) => (
//                   <th key={header} className="px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text)' }}>{header}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
//               {requests.map((req, index) => {
//                 const statusStyle = statusStyles['Active']; // Default for new requests
//                 return (
//                   <tr key={index} className="transition-colors duration-150" style={{ borderColor: 'var(--border)' }}>
//                     <td className="px-6 py-4 text-sm font-mono" style={{ color: 'var(--text)' }}>
//                         REQ-{String(index + 1).padStart(3, '0')}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-h)' }}>{req.request_type}</td>
//                     <td className="px-6 py-4"><StatusBadge urgency={req.priority} /></td>
//                     <td className="px-6 py-4 text-sm" style={{ color: 'var(--text)' }}>{req.people || '—'}</td>
//                     <td className="px-6 py-4 text-sm" style={{ color: 'var(--text)' }}>{req.assigned_volunteer}</td>
//                     <td className="px-6 py-4">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
//                         style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>Active</span>
//                     </td>
//                     <td className="px-6 py-4 text-sm" style={{ color: 'var(--text)' }}>{formatTime(req.timestamp)}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



import { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, AlertTriangle, Users, Clock } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { API_BASE_URL } from '../App';

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/get-requests`);
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const stats = [
    { label: 'Active', value: requests.length, icon: AlertTriangle, color: 'text-blue-600' },
    { label: 'Volunteers', value: new Set(requests.map(r => r.assigned_volunteer)).size || '—', icon: Users, color: 'text-emerald-600' },
    { label: 'Avg Response', value: '8m', icon: Clock, color: 'text-amber-600' },
  ];

  const formatTime = (iso) => {
    if (!iso) return '—';
    const diff = (new Date() - new Date(iso)) / 60000;
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${Math.floor(diff)} min ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Command Center</h1>
          <p className="text-slate-600 mt-1">
            Monitor and manage active emergency requests
          </p>
        </div>

        <button
          onClick={fetchRequests}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Updating...' : 'Refresh Data'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-900">Active Requests</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3 hidden sm:table-cell">People</th>
                <th className="px-6 py-3 hidden md:table-cell">Volunteer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 hidden lg:table-cell">Time</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {requests.map((req, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">
                    REQ-{String(index + 1).padStart(3, '0')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 capitalize">
                    {req.request_type}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge urgency={req.priority.charAt(0).toUpperCase() + req.priority.slice(1)} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 hidden sm:table-cell">
                    {req.people ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 hidden md:table-cell">
                    {req.assigned_volunteer}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">
                    {formatTime(req.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {requests.length === 0 && (
          <div className="px-6 py-12 text-center text-slate-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-medium">No active requests</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;