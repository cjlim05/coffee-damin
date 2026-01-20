const STATUS_OPTIONS = [
  { value: 'PENDING', label: '대기' },
  { value: 'PAID', label: '결제완료' },
  { value: 'SHIPPING', label: '배송중' },
  { value: 'COMPLETED', label: '완료' },
  { value: 'CANCELLED', label: '취소' },
]

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

export default function OrderDetail({ order, onStatusChange, onClose }) {
  return (
    <div className="card order-detail">
      <div className="card-header">
        <h2>주문 상세 #{order.orderId}</h2>
        <button className="btn btn-ghost" onClick={onClose}>닫기</button>
      </div>

      <div className="detail-content">
        <section className="detail-section">
          <h3>주문 상태</h3>
          <select
            className="form-select status-select"
            value={order.status}
            onChange={e => onStatusChange(order.orderId, e.target.value)}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </section>

        <section className="detail-section">
          <h3>회원 정보</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">이름</span>
              <span className="value">{order.member?.name || '-'}</span>
            </div>
            <div className="info-item">
              <span className="label">이메일</span>
              <span className="value">{order.member?.email || '-'}</span>
            </div>
            <div className="info-item">
              <span className="label">연락처</span>
              <span className="value">{order.member?.phone || '-'}</span>
            </div>
          </div>
        </section>

        <section className="detail-section">
          <h3>배송 정보</h3>
          <p className="shipping-address">{order.shippingAddress || '주소 없음'}</p>
        </section>

        <section className="detail-section">
          <h3>주문 상품</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>상품명</th>
                <th>옵션</th>
                <th>수량</th>
                <th>단가</th>
                <th>소계</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map(item => (
                <tr key={item.orderItemId}>
                  <td>{item.productName}</td>
                  <td>{item.optionValue}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.unitPrice)}원</td>
                  <td>{formatPrice(item.subtotal)}원</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4">총 금액</td>
                <td><strong>{formatPrice(order.totalAmount)}원</strong></td>
              </tr>
            </tfoot>
          </table>
        </section>

        <section className="detail-section">
          <h3>주문 일시</h3>
          <p>{formatDate(order.orderDate)}</p>
        </section>
      </div>
    </div>
  )
}
