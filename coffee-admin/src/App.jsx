import { useState, useEffect } from 'react'
import './App.css'
import AdminProducts from './product/AdminProducts'
import AdminMembers from './member/AdminMembers'
import AdminOrders from './order/AdminOrders'

// SVG Icons
const Icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  products: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  members: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  orders: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  bell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  trendUp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  trendDown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),
}

const MENU_ITEMS = [
  { id: 'home', label: 'Dashboard', icon: 'dashboard' },
  { id: 'products', label: 'Products', icon: 'products' },
  { id: 'members', label: 'Members', icon: 'members' },
  { id: 'orders', label: 'Orders', icon: 'orders' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

function App() {
  const [view, setView] = useState('home')
  const [greeting, setGreeting] = useState('Good morning')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const getPageTitle = () => {
    switch(view) {
      case 'home': return 'Dashboard'
      case 'products': return 'Product Management'
      case 'members': return 'Member Management'
      case 'orders': return 'Order Management'
      case 'settings': return 'Settings'
      default: return 'Dashboard'
    }
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21V19H4V12C4 10.1 4.63 8.42 5.88 6.97C7.13 5.52 8.7 4.63 10.5 4.33V3.5C10.5 3.09 10.64 2.73 10.92 2.43C11.2 2.14 11.56 2 12 2C12.44 2 12.8 2.14 13.08 2.43C13.36 2.73 13.5 3.09 13.5 3.5V4.33C15.3 4.63 16.87 5.52 18.12 6.97C19.37 8.42 20 10.1 20 12V19H22V21H2Z"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1 className="logo">Coffee Admin</h1>
              <span className="logo-subtitle">Bean Commerce</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <span className="nav-icon">{Icons[item.icon]}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn">
            <span className="nav-icon">{Icons.logout}</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <h2 className="page-title">{getPageTitle()}</h2>
          <div className="header-actions">
            <div className="search-box">
              {Icons.search}
              <input type="text" placeholder="Search data..." />
            </div>
            <button className="icon-btn">
              {Icons.bell}
              <span className="notification-badge"></span>
            </button>
            <div className="user-profile">
              <span className="user-name">Admin</span>
              <div className="avatar">A</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {view === 'home' && (
            <div className="dashboard-page">
              <div className="dashboard-welcome">
                <h1>{greeting}, Admin</h1>
                <p>Here's what's happening with your coffee business today.</p>
              </div>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon products">{Icons.products}</div>
                  <div className="stat-trend up">
                    {Icons.trendUp}
                    <span>2.5%</span>
                  </div>
                  <p className="stat-label">Total Products</p>
                  <h3 className="stat-value">1,240</h3>
                </div>
                <div className="stat-card">
                  <div className="stat-icon members">{Icons.members}</div>
                  <div className="stat-trend up">
                    {Icons.trendUp}
                    <span>12.4%</span>
                  </div>
                  <p className="stat-label">Total Members</p>
                  <h3 className="stat-value">8,502</h3>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orders">{Icons.orders}</div>
                  <div className="stat-trend up">
                    {Icons.trendUp}
                    <span>18%</span>
                  </div>
                  <p className="stat-label">Today's Orders</p>
                  <h3 className="stat-value">42</h3>
                </div>
                <div className="stat-card">
                  <div className="stat-icon revenue">₩</div>
                  <div className="stat-trend down">
                    {Icons.trendDown}
                    <span>3.2%</span>
                  </div>
                  <p className="stat-label">Monthly Revenue</p>
                  <h3 className="stat-value">₩12,450,000</h3>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="dashboard-section">
                <h3 className="section-title">Quick Actions</h3>
                <div className="quick-actions">
                  <button className="action-btn primary" onClick={() => setView('products')}>
                    <span>+</span> Add Product
                  </button>
                  <button className="action-btn outline" onClick={() => setView('members')}>
                    <span>{Icons.members}</span> Add Member
                  </button>
                  <button className="action-btn outline" onClick={() => setView('orders')}>
                    <span>{Icons.orders}</span> New Order
                  </button>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h3 className="section-title">Recent Orders</h3>
                  <button className="link-btn" onClick={() => setView('orders')}>View All Orders</button>
                </div>
                <div className="orders-table-wrapper">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>ORDER ID</th>
                        <th>CUSTOMER</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="order-id">#ORD-94021</td>
                        <td className="customer">
                          <div className="avatar-sm">EM</div>
                          Elena Martinez
                        </td>
                        <td>Oct 24, 2023</td>
                        <td className="amount">₩84,500</td>
                        <td><span className="status-badge shipped">Shipped</span></td>
                        <td><button className="action-dots">⋮</button></td>
                      </tr>
                      <tr>
                        <td className="order-id">#ORD-94020</td>
                        <td className="customer">
                          <div className="avatar-sm">JD</div>
                          James Dalton
                        </td>
                        <td>Oct 24, 2023</td>
                        <td className="amount">₩120,000</td>
                        <td><span className="status-badge pending">Pending</span></td>
                        <td><button className="action-dots">⋮</button></td>
                      </tr>
                      <tr>
                        <td className="order-id">#ORD-94019</td>
                        <td className="customer">
                          <div className="avatar-sm">SC</div>
                          Sarah Chen
                        </td>
                        <td>Oct 23, 2023</td>
                        <td className="amount">₩45,200</td>
                        <td><span className="status-badge shipped">Shipped</span></td>
                        <td><button className="action-dots">⋮</button></td>
                      </tr>
                      <tr>
                        <td className="order-id">#ORD-94018</td>
                        <td className="customer">
                          <div className="avatar-sm">BW</div>
                          Bill Wright
                        </td>
                        <td>Oct 23, 2023</td>
                        <td className="amount">₩210,000</td>
                        <td><span className="status-badge cancelled">Cancelled</span></td>
                        <td><button className="action-dots">⋮</button></td>
                      </tr>
                      <tr>
                        <td className="order-id">#ORD-94017</td>
                        <td className="customer">
                          <div className="avatar-sm">KK</div>
                          Kevin Kim
                        </td>
                        <td>Oct 22, 2023</td>
                        <td className="amount">₩56,000</td>
                        <td><span className="status-badge processing">Processing</span></td>
                        <td><button className="action-dots">⋮</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {view === 'products' && <AdminProducts />}
          {view === 'members' && <AdminMembers />}
          {view === 'orders' && <AdminOrders />}
          {view === 'settings' && (
            <div className="settings-page">
              <h2>Settings</h2>
              <p>설정 페이지는 준비 중입니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
