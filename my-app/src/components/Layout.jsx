import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, LayoutDashboard, HeartPulse } from 'lucide-react';

function Layout({ children }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-[100svh] flex flex-col">
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'var(--bg)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-[1126px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div
                className="p-2 rounded-lg transition-all duration-200 group-hover:opacity-90"
                style={{ background: 'var(--accent)' }}
              >
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-xl font-medium tracking-tight"
                style={{
                  fontFamily: 'var(--heading)',
                  color: 'var(--text-h)',
                }}
              >
                Rescue<span style={{ color: 'var(--accent)' }}>Sync</span>
              </span>
            </Link>

            <div className="flex gap-1 sm:gap-2">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
                    : 'hover:bg-[var(--code-bg)]'
                }`}
                style={!isActive('/') ? { color: 'var(--text)' } : {}}
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Submit Request</span>
              </Link>

              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/admin')
                    ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
                    : 'hover:bg-[var(--code-bg)]'
                }`}
                style={!isActive('/admin') ? { color: 'var(--text)' } : {}}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1126px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;