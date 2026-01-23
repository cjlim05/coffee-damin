const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', color: 'pending' },
  { value: 'PAID', label: 'Paid', color: 'paid' },
  { value: 'SHIPPING', label: 'Shipping', color: 'shipping' },
  { value: 'COMPLETED', label: 'Completed', color: 'completed' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'cancelled' },
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

export default function OrderDetail({ order, onStatusChange, onClose, onDelete }) {
  return (
    <div className="card order-detail">
      <div className="card-header">
        <div className="card-title-group">
          <h2>Order #{String(order.orderId).padStart(4, '0')}</h2>
          <p>{formatDate(order.orderDate)}</p>
        </div>
        <button className="btn btn-ghost" onClick={onClose}>✕</button>
      </div>

      <div className="detail-content">
        <section className="detail-section">
          <h3 className="detail-section-title">Order Status</h3>
          <div className="status-select-wrapper">
            <select
              className="form-select status-select"
              value={order.status}
              onChange={e => onStatusChange(order.orderId, e.target.value)}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="detail-section">
          <h3 className="detail-section-title">Customer Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Name</span>
              <span className="value">{order.member?.name || '-'}</span>
            </div>
            <div className="info-item">
              <span className="label">Email</span>
              <span className="value">{order.member?.email || '-'}</span>
            </div>
            <div className="info-item">
              <span className="label">Phone</span>
              <span className="value">{order.member?.phone || '-'}</span>
            </div>
          </div>
        </section>

        <section className="detail-section">
          <h3 className="detail-section-title">Shipping Address</h3>
          <p className="shipping-address">{order.shippingAddress || 'No address provided'}</p>
        </section>

        <section className="detail-section">
          <h3 className="detail-section-title">Order Items</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Option</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map(item => (
                <tr key={item.orderItemId}>
                  <td>{item.productName}</td>
                  <td>{item.optionValue}</td>
                  <td>{item.quantity}</td>
                  <td>₩{formatPrice(item.unitPrice)}</td>
                  <td>₩{formatPrice(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4">Total Amount</td>
                <td>₩{formatPrice(order.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        <div className="form-actions">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (confirm('이 주문을 삭제하시겠습니까?')) {
                onDelete(order.orderId)
              }
            }}
          >
            Delete Order
          </button>
        </div>
      </div>
    </div>
  )
}
