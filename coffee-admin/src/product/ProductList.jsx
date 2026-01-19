const UPLOAD_BASE = import.meta.env.VITE_API_URL + '/uploads/'

function getImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return UPLOAD_BASE + path
}

function formatPrice(price) {
  return new Intl.NumberFormat('ko-KR').format(price)
}

export default function ProductList({ products, editingId, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>등록된 상품</h2>
        <span className="badge">{products.length}개</span>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <p>등록된 상품이 없습니다.</p>
          <p className="hint">왼쪽 폼에서 새 상품을 등록해보세요.</p>
        </div>
      ) : (
        <div className="product-list">
          {products.map(p => (
            <div
              key={p.productId}
              className={`product-item ${editingId === p.productId ? 'editing' : ''}`}
            >
              <div className="product-thumbnail">
                {p.thumbnailImg ? (
                  <img src={getImageUrl(p.thumbnailImg)} alt={p.productName} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{p.productName}</h3>
                <div className="product-meta">
                  {p.nationality && <span className="tag">{p.nationality}</span>}
                  {p.type && <span className="tag">{p.type}</span>}
                </div>
                <div className="product-price">{formatPrice(p.basePrice)}원</div>

                {p.options?.length > 0 && (
                  <div className="product-options">
                    {p.options.map((o, i) => (
                      <span key={i} className="option-badge">
                        {o.optionValue}
                        {o.extraPrice > 0 && ` (+${formatPrice(o.extraPrice)})`}
                        <span className="stock">재고: {o.stock}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="product-actions">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onEdit(p)}
                >
                  수정
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(p.productId)}
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
