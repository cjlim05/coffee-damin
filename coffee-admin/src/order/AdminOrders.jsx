import { useState } from 'react'
import { useOrders } from './useOrders'
import OrderForm from './OrderForm'
import OrderList from './OrderList'
import OrderDetail from './OrderDetail'
import './order.css'

export default function AdminOrders() {
  const { orders, members, products, loading, message, showMessage, createOrder, updateOrderStatus, deleteOrder } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showForm, setShowForm] = useState(false)

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

      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1>주문 관리</h1>
            <p className="page-desc">주문 내역을 조회하고 상태를 관리합니다.</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setShowForm(true); setSelectedOrder(null); }}
          >
            + 새 주문 등록
          </button>
        </div>
      </div>

      <div className="content-grid">
        <section className="list-section">
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
            />
          ) : (
            <div className="card">
              <div className="empty-state">
                <p>주문을 선택하거나 새 주문을 등록해주세요.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
