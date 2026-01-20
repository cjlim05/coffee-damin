import { useState } from 'react'
import './App.css'
import AdminProducts from './product/AdminProducts'
import AdminMembers from './member/AdminMembers'
import AdminOrders from './order/AdminOrders'

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: '/' },
  { id: 'products', label: '상품 관리', icon: '/' },
  { id: 'members', label: '회원 관리', icon: '/' },
  { id: 'orders', label: '주문 관리', icon: '/' },
]

function App() {
  const [view, setView] = useState('home')

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">Coffee Admin</h1>
        </div>

        <nav className="sidebar-nav">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>v1.0.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {view === 'home' && (
          <div className="home-page">
            <div className="welcome-card">
              <h2>Coffee Admin Dashboard</h2>
              <p>원두 판매 관리자 페이지에 오신 것을 환영합니다.</p>
              <p className="hint">왼쪽 메뉴에서 '상품 관리'를 선택하여 상품을 등록/수정/삭제하세요.</p>

              <div className="quick-actions">
                <button
                  className="action-card"
                  onClick={() => setView('products')}
                >
                  <span className="action-title">상품 관리</span>
                  <span className="action-desc">원두 상품 등록 및 관리</span>
                </button>

                <button
                  className="action-card"
                  onClick={() => setView('members')}
                >
                  <span className="action-title">회원 관리</span>
                  <span className="action-desc">회원 정보 등록 및 관리</span>
                </button>

                <button
                  className="action-card"
                  onClick={() => setView('orders')}
                >
                  <span className="action-title">주문 관리</span>
                  <span className="action-desc">주문 내역 조회 및 상태 관리</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'products' && <AdminProducts />}
        {view === 'members' && <AdminMembers />}
        {view === 'orders' && <AdminOrders />}
      </main>
    </div>
  )
}

export default App
