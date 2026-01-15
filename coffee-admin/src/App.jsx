import { useState } from 'react'
import './App.css'
import AdminProducts from './pages/AdminProducts'

function App() {
  const [view, setView] = useState('home')

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Coffee Admin</h1>
        <nav>
          <button onClick={() => setView('home')}>Home</button>
          <button onClick={() => setView('products')}>상품 관리</button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'home' && (
          <div>
            <h2>Welcome</h2>
            <p>관리자 페이지에 오신 것을 환영합니다. '상품 관리'를 눌러 상품을 등록/수정/삭제하세요.</p>
          </div>
        )}

        {view === 'products' && <AdminProducts />}
      </main>
    </div>
  )
}

export default App
