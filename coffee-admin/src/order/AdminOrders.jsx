import { useState, useMemo } from 'react'
import { useOrders } from './useOrders'
import OrderForm from './OrderForm'
import OrderList from './OrderList'
import OrderDetail from './OrderDetail'
import './order.css'

function formatPrice(price) {
  return new Intl.NumberFormat('ko-KR').format(price)
}

export default function AdminOrders() {
  const { orders, members, products, loading, message, showMessage, createOrder, updateOrderStatus, deleteOrder } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const pendingRevenue = orders
      .filter(o => o.status === 'PENDING' || o.status === 'PAID')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    const today = new Date().toDateString()
    const todayOrders = orders.filter(o =>
      new Date(o.orderDate).toDateString() === today
    ).length
    return { totalOrders, pendingRevenue, todayOrders }
  }, [orders])

  function handleCreateOrder(data) {
    createOrder(data)
      .then(() => setShowForm(false))
      .catch(() => {})
  }

  function handleStatusChange(orderId, newStatus) {
    updateOrderStatus(orderId, newStatus)
      .then(updated => {
        if (selectedOrder?.orderId === orderId) {
          setSelectedOrder(updated)
        }
      })
      .catch(() => {})
  }

  function handleDelete(id) {
    deleteOrder(id).then(deleted => {
      if (deleted && selectedOrder?.orderId === id) {
        setSelectedOrder(null)
      }
    })
  }

  function handleViewDetail(order) {
    setSelectedOrder(order)
    setShowForm(false)
  }

  return (
    <div className="admin-orders">
      {message.text && (
        <div className={`toast toast-${message.type}`}>{message.text}</div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="order-stats">
        <div className="order-stat-card">
          <div className="order-stat-info">
            <h3>Total Orders</h3>
            <p className="order-stat-value">{formatPrice(stats.totalOrders)}</p>
            <div className="order-stat-trend up">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              </svg>
              +12% from last month
            </div>
          </div>
          <div className="order-stat-icon orders">🛒</div>
        </div>
        <div className="order-stat-card">
          <div className="order-stat-info">
            <h3>Pending Revenue</h3>
            <p className="order-stat-value">₩{formatPrice(stats.pendingRevenue)}</p>
            <div className="order-stat-trend up">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              </svg>
              +5% from last week
            </div>
          </div>
          <div className="order-stat-icon revenue">💰</div>
        </div>
        <div className="order-stat-card">
          <div className="order-stat-info">
            <h3>Today's Volume</h3>
            <p className="order-stat-value">{stats.todayOrders}</p>
            <div className="order-stat-trend down">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              </svg>
              -2% since yesterday
            </div>
          </div>
          <div className="order-stat-icon today">⚡</div>
        </div>
      </div>

      <div className="content-grid">
        <section className="list-section">
          <div className="card-header" style={{ background: 'white', borderRadius: '12px 12px 0 0', marginBottom: '-1px' }}>
            <div className="card-title-group">
              <h2>Order Management</h2>
              <p>Manage and track all customer coffee bean orders.</p>
            </div>
            <div className="card-actions">
              <button className="btn btn-outline">
                Export CSV
              </button>
              <button
                className="btn btn-primary"
                onClick={() => { setShowForm(true); setSelectedOrder(null); }}
              >
                + Create Order
              </button>
            </div>
          </div>
          <OrderList
            orders={orders}
            selectedOrderId={selectedOrder?.orderId}
            onViewDetail={handleViewDetail}
            onDelete={handleDelete}
          />
        </section>

        <section className="detail-section">
          {showForm ? (
            <OrderForm
              members={members}
              products={products}
              onSave={handleCreateOrder}
              onCancel={() => setShowForm(false)}
              showMessage={showMessage}
            />
          ) : selectedOrder ? (
            <OrderDetail
              order={selectedOrder}
              onStatusChange={handleStatusChange}
              onClose={() => setSelectedOrder(null)}
              onDelete={handleDelete}
            />
          ) : (
            <div className="card order-detail">
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <p>Select an order to view details</p>
                <p className="hint">Or create a new order</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
