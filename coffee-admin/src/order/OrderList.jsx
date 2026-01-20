const STATUS_COLORS = {
  PENDING: '#d97706',
  PAID: '#2563eb',
  SHIPPING: '#7c3aed',
  COMPLETED: '#16a34a',
  CANCELLED: '#dc2626',
}

function formatPrice(price) {
  return new Intl.NumberFormat('ko-KR').format(price)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrderList({ orders, selectedOrderId, onViewDetail, onDelete }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>주문 목록</h2>
        <span className="badge">{orders.length}건</span>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>등록된 주문이 없습니다.</p>
        </div>
      ) : (
        <div className="order-list">
          {orders.map(o => (
            <div
              key={o.orderId}
              className={`order-item ${selectedOrderId === o.orderId ? 'selected' : ''}`}
              onClick={() => onViewDetail(o)}
            >
              <div className="order-header">
                <span className="order-id">#{o.orderId}</span>
                <span
                  className="order-status"
                  style={{ backgroundColor: STATUS_COLORS[o.status] }}
                >
                  {o.statusDisplayName}
                </span>
              </div>

              <div className="order-info">
                <div className="order-member">{o.member?.name || '회원정보 없음'}</div>
                <div className="order-amount">{formatPrice(o.totalAmount)}원</div>
                <div className="order-date">{formatDate(o.orderDate)}</div>
              </div>

              <div className="order-actions" onClick={e => e.stopPropagation()}>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(o.orderId)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
