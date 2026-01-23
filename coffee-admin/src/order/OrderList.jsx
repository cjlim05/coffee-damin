import { useState, useMemo } from 'react'

const STATUS_TABS = [
  { key: 'ALL', label: 'All Orders' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'PAID', label: 'Paid' },
  { key: 'SHIPPING', label: 'Shipping' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
]

function formatPrice(price) {
  return new Intl.NumberFormat('ko-KR').format(price)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getStatusClass(status) {
  return status?.toLowerCase() || 'pending'
}

const ITEMS_PER_PAGE = 5

export default function OrderList({ orders, selectedOrderId, onViewDetail, onDelete }) {
  const [activeTab, setActiveTab] = useState('ALL')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredOrders = useMemo(() => {
    let result = orders
    if (activeTab !== 'ALL') {
      result = result.filter(o => o.status === activeTab)
    }
    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(o =>
        o.member?.name?.toLowerCase().includes(term) ||
        o.member?.email?.toLowerCase().includes(term) ||
        String(o.orderId).includes(term)
      )
    }
    return result
  }, [orders, activeTab, search])

  const tabCounts = useMemo(() => {
    const counts = { ALL: orders.length }
    STATUS_TABS.slice(1).forEach(tab => {
      counts[tab.key] = orders.filter(o => o.status === tab.key).length
    })
    return counts
  }, [orders])

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="card">
      {/* Tabs */}
      <div className="order-tabs">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            className={`order-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
          >
            {tab.label}
            <span className="count">{tabCounts[tab.key]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="order-filters">
        <div className="order-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by order ID, customer name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p>주문이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="order-table-wrapper">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map(o => (
                  <tr
                    key={o.orderId}
                    className={selectedOrderId === o.orderId ? 'selected' : ''}
                    onClick={() => onViewDetail(o)}
                  >
                    <td>
                      <span className="order-id">#ORD-{String(o.orderId).padStart(4, '0')}</span>
                    </td>
                    <td>
                      <span className="order-date">{formatDate(o.orderDate)}</span>
                    </td>
                    <td>
                      <div className="order-customer">
                        <div className="order-customer-avatar">
                          {getInitials(o.member?.name)}
                        </div>
                        <div className="order-customer-info">
                          <span className="order-customer-name">{o.member?.name || '회원정보 없음'}</span>
                          <span className="order-customer-email">{o.member?.email || ''}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="order-amount">₩{formatPrice(o.totalAmount)}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(o.status)}`}>
                        {o.statusDisplayName || o.status}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="member-actions">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => onViewDetail(o)}
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span className="table-info">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} entries
            </span>
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                let pageNum
                if (totalPages <= 3) {
                  pageNum = i + 1
                } else if (currentPage === 1) {
                  pageNum = i + 1
                } else if (currentPage === totalPages) {
                  pageNum = totalPages - 2 + i
                } else {
                  pageNum = currentPage - 1 + i
                }
                return (
                  <button
                    key={pageNum}
                    className={currentPage === pageNum ? 'active' : ''}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              })}
              {totalPages > 3 && currentPage < totalPages - 1 && (
                <>
                  <span style={{ padding: '0 8px', color: '#9ca3af' }}>...</span>
                  <button onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                </>
              )}
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                ›
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
