import { FormEvent, useEffect, useState } from 'react';
import { api } from './lib/api';

type ThemeMode = 'light' | 'dark';

type Announcement = {
  id: number;
  title: string;
  date: string;
  text: string;
  badge: string;
};

type NavKey =
  | 'dashboard'
  | 'tickets'
  | 'reports'
  | 'downloadables'
  | 'utilities'
  | 'change-password'
  | 'logout';

const announcements: Announcement[] = [
  {
    id: 1,
    title: 'Weekend service update',
    date: 'Today • 08:30 AM',
    text: 'Gate 2 will be temporarily closed for maintenance. Please use Gate 4 during peak hours.',
    badge: 'Maintenance',
  },
  {
    id: 2,
    title: 'New payment terminals',
    date: 'Yesterday',
    text: 'Two new contactless payment kiosks are live across Terminal 1 and Terminal 3.',
    badge: 'Operations',
  },
  {
    id: 3,
    title: 'Security reminder',
    date: 'Mon • 02:00 PM',
    text: 'Please verify passenger identifiers before boarding assistance requests are processed.',
    badge: 'Security',
  },
];

const navItems: { key: NavKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '◫' },
  { key: 'tickets', label: 'Tickets', icon: '▣' },
  { key: 'reports', label: 'Reports', icon: '◌' },
  { key: 'downloadables', label: 'Downloadables', icon: '↓' },
  { key: 'utilities', label: 'Utilities', icon: '⚙' },
  { key: 'change-password', label: 'Change Password', icon: '◐' },
  { key: 'logout', label: 'Log out', icon: '⇠' },
];

const stats = [
  { label: 'Open Tickets', value: '246', trend: '+12.4%', tone: 'primary' },
  { label: 'Resolved Today', value: '91', trend: '+8.1%', tone: 'success' },
  { label: 'Avg. Resolution', value: '4.8h', trend: '-0.7h', tone: 'warning' },
  { label: 'Escalations', value: '17', trend: '-3.2%', tone: 'danger' },
];

const ticketRows = [
  { id: 'TCK-2048', title: 'eNGAS interface error', owner: 'A. Dela Cruz', status: 'In Progress', priority: 'High' },
  { id: 'TCK-2049', title: 'Budget file sync failed', owner: 'R. Santos', status: 'Pending', priority: 'Medium' },
  { id: 'TCK-2050', title: 'User access reset request', owner: 'M. Lopez', status: 'Resolved', priority: 'Low' },
  { id: 'TCK-2051', title: 'Report generation timeout', owner: 'J. Ramos', status: 'Escalated', priority: 'High' },
];

const reportCards = [
  { title: 'Ticket volume by office', value: '38%', detail: 'Compared to last week' },
  { title: 'Resolved across agencies', value: '94.2%', detail: 'within SLA target' },
  { title: 'System downtime', value: '00:23h', detail: 'This month' },
];

const downloads = [
  { name: 'COA eTicketing User Manual.pdf', type: 'Guide' },
  { name: 'SLA Summary Report.xlsx', type: 'Report' },
  { name: 'Issue Log Template.docx', type: 'Template' },
];

const utilities = [
  'System health check',
  'Clear stale tickets',
  'User role sync',
  'Database backup monitor',
];

export default function App() {
  const [error, setError] = useState<string | null>(null);
  const [connectionMessage, setConnectionMessage] = useState<string>('');
  const [username, setUsername] = useState('admin@ticketflow');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<NavKey>('dashboard');
  const [theme, setTheme] = useState<ThemeMode>('light');

  const testDatabaseConnection = async () => {
    try {
      const response = await api.get<string>('/health', { responseType: 'text' });
      setConnectionMessage(response.data);
      setError(null);
    } catch (err: any) {
      const message = typeof err?.response?.data === 'string'
        ? err.response.data
        : err?.response?.data?.message || err?.message || 'Could not connect to the database';
      setConnectionMessage('');
      setError(message);
    }
  };

  useEffect(() => {
    testDatabaseConnection();
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView('dashboard');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'tickets':
        return (
          <section className="content-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Queue</p>
                <h2>Tickets</h2>
              </div>
              <button className="primary-button small">New Ticket</button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Title</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.title}</td>
                      <td>{row.owner}</td>
                      <td><span className={`pill status-${row.status.toLowerCase().replace(/\s+/g, '-')}`}>{row.status}</span></td>
                      <td><span className={`pill priority-${row.priority.toLowerCase()}`}>{row.priority}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      case 'reports':
        return (
          <section className="content-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Insights</p>
                <h2>Reports</h2>
              </div>
            </div>

            <div className="metric-grid">
              {reportCards.map((card) => (
                <article key={card.title} className="mini-card">
                  <p>{card.title}</p>
                  <h3>{card.value}</h3>
                  <small>{card.detail}</small>
                </article>
              ))}
            </div>
          </section>
        );
      case 'downloadables':
        return (
          <section className="content-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Resources</p>
                <h2>Downloadables</h2>
              </div>
            </div>

            <div className="download-list">
              {downloads.map((item) => (
                <div key={item.name} className="download-item">
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.type}</small>
                  </div>
                  <button className="ghost-button">Download</button>
                </div>
              ))}
            </div>
          </section>
        );
      case 'utilities':
        return (
          <section className="content-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Admin Tools</p>
                <h2>Utilities</h2>
              </div>
            </div>

            <div className="utility-grid">
              {utilities.map((tool) => (
                <button key={tool} className="utility-card">{tool}</button>
              ))}
            </div>
          </section>
        );
      case 'change-password':
        return (
          <section className="content-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Account</p>
                <h2>Change Password</h2>
              </div>
            </div>

            <form className="form-card">
              <label>
                <span>Current password</span>
                <input type="password" placeholder="Enter current password" />
              </label>
              <label>
                <span>New password</span>
                <input type="password" placeholder="Enter new password" />
              </label>
              <label>
                <span>Confirm password</span>
                <input type="password" placeholder="Re-enter new password" />
              </label>
              <button className="primary-button small" type="button">Update Password</button>
            </form>
          </section>
        );
      case 'logout':
        handleLogout();
        return null;
      default:
        return (
          <section className="content-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Overview</p>
                <h2>Dashboard</h2>
              </div>
              <button className="primary-button small">Generate Report</button>
            </div>

            <div className="metric-grid">
              {stats.map((stat) => (
                <article key={stat.label} className={`stat-card ${stat.tone}`}>
                  <p>{stat.label}</p>
                  <h3>{stat.value}</h3>
                  <span>{stat.trend}</span>
                </article>
              ))}
            </div>

            <div className="chart-grid">
              <div className="chart-card large">
                <h3>Ticket trend</h3>
                <div className="chart-bars" aria-label="Ticket trend chart">
                  <span style={{ height: '40%' }} />
                  <span style={{ height: '58%' }} />
                  <span style={{ height: '44%' }} />
                  <span style={{ height: '75%' }} />
                  <span style={{ height: '60%' }} />
                  <span style={{ height: '84%' }} />
                  <span style={{ height: '92%' }} />
                </div>
              </div>

              <div className="chart-card">
                <h3>Priority mix</h3>
                <ul className="legend-list">
                  <li><span className="dot blue" />High 38%</li>
                  <li><span className="dot gold" />Medium 42%</li>
                  <li><span className="dot green" />Low 20%</li>
                </ul>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Office</th>
                    <th>Assigned</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>TCK-2048</td>
                    <td>COA Central Office</td>
                    <td>A. Dela Cruz</td>
                    <td><span className="pill status-in-progress">In Progress</span></td>
                  </tr>
                  <tr>
                    <td>TCK-2015</td>
                    <td>Regional Office IV-A</td>
                    <td>R. Santos</td>
                    <td><span className="pill status-pending">Pending</span></td>
                  </tr>
                  <tr>
                    <td>TCK-2008</td>
                    <td>COA Region IX</td>
                    <td>M. Lopez</td>
                    <td><span className="pill status-resolved">Resolved</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        );
    }
  };

  const themeClass = theme === 'dark' ? 'theme-dark' : 'theme-light';

  if (!isLoggedIn) {
    return (
      <main className={`login-page ${themeClass}`}>
        <div className="login-shell">
          <section className="login-panel">
            <div className="brand-row">
              <div className="brand-mark">T</div>
              <div>
                <p className="brand-name">TicketFlow</p>
                <small>eTicketing System</small>
              </div>
            </div>

            <div className="welcome-block">
              <p className="eyebrow">Welcome back</p>
              <h1>Secure agent access</h1>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <label>
                <span>Email or username</span>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="admin@ticketflow"
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                />
              </label>

              <div className="form-row">
                <label className="checkbox-row">
                  <input type="checkbox" defaultChecked />
                  <span>Remember me</span>
                </label>
                <a href="#">Forgot password?</a>
              </div>

              <button type="submit" className="primary-button">Sign in</button>
            </form>

            <div className="status-box">
              {error ? (
                <span className="error-text">{error}</span>
              ) : connectionMessage ? (
                <strong className="success-text">{connectionMessage}</strong>
              ) : (
                <small>Checking API connection...</small>
              )}

              <button type="button" className="ghost-button small" onClick={testDatabaseConnection}>
                Test database connection
              </button>
            </div>
          </section>

          <aside className="announcement-panel">
            <div className="announcement-header">
              <div>
                <p className="eyebrow">Announcements</p>
                <h2>Operations board</h2>
              </div>
              <div className="header-actions">
                <button
                  type="button"
                  className="theme-toggle"
                  onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? '☀' : '☾'}
                </button>
                <span className="live-pill">Live</span>
              </div>
            </div>

            <div className="announcement-list">
              {announcements.map((item) => (
                <article key={item.id} className="announcement-card">
                  <div className="announcement-topline">
                    <span className="badge">{item.badge}</span>
                    <time>{item.date}</time>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </main>
    );
  }

  return (
    <div className={`app-shell ${themeClass}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">T</div>
          <div>
            <strong>TicketFlow</strong>
            <small>COA eTicketing</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={activeView === item.key ? 'nav-item active' : 'nav-item'}
              onClick={() => {
                if (item.key === 'logout') {
                  handleLogout();
                  return;
                }
                setActiveView(item.key);
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operations</p>
            <h1>COA eTicketing Center</h1>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>

            <div className="user-panel">
              <div className="user-avatar">AD</div>
              <div>
                <strong>Alicia Dela Cruz</strong>
                <small>System Officer</small>
              </div>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
