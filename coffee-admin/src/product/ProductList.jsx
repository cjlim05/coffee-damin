import { useState, useMemo } from 'react'

const UPLOAD_BASE = import.meta.env.VITE_API_URL + '/uploads/'

function getImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return UPLOAD_BASE + path
}

function formatPrice(price) {
  return new Intl.NumberFormat('ko-KR').format(price)
}

function getProcessClass(type) {
  if (!type) return ''
  const lower = type.toLowerCase()
  if (lower.includes('내추럴') || lower.includes('natural')) return 'natural'
  if (lower.includes('허니') || lower.includes('honey')) return 'honey'
  return ''
}

function getTotalStock(options) {
  if (!options || options.length === 0) return 0
  return options.reduce((sum, o) => sum + (o.stock || 0), 0)
}

function getStockStatus(totalStock) {
  if (totalStock === 0) return { class: 'out-of-stock', text: 'OUT OF STOCK' }
  if (totalStock <= 10) return { class: 'low-stock', text: 'LOW STOCK' }
  return { class: 'in-stock', text: 'IN STOCK' }
}

export default function ProductList({ products, editingId, onEdit, onDelete }) {
  const [search, setSearch] = useState('')

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products
    const term = search.toLowerCase()
    return products.filter(p =>
      p.productName?.toLowerCase().includes(term) ||
      p.nationality?.toLowerCase().includes(term) ||
      p.type?.toLowerCase().includes(term)
    )
  }, [products, search])

  const lowStockCount = useMemo(() => {
    return products.filter(p => {
      const total = getTotalStock(p.options)
      return total > 0 && total <= 10
    }).length
  }, [products])

  return (
    <div className="card">
      <div className="list-header">
        <div className="list-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search products by name, region, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="list-badges">
          <span className="stat-badge">
            TOTAL <strong>{products.length}</strong>
          </span>
          {lowStockCount > 0 && (
            <span className="stat-badge warning">
              LOW STOCK <strong>{lowStockCount}</strong>
            </span>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">☕</div>
          <p>등록된 상품이 없습니다.</p>
          <p className="hint">왼쪽 폼에서 새 상품을 등록해보세요.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(p => {
            const totalStock = getTotalStock(p.options)
            const stockStatus = getStockStatus(totalStock)

            return (
              <div
                key={p.productId}
                className={`product-card ${editingId === p.productId ? 'editing' : ''}`}
              >
                <div className="product-card-image">
                  {p.thumbnailImg ? (
                    <img src={getImageUrl(p.thumbnailImg)} alt={p.productName} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  <div className="product-card-tags">
                    {p.nationality && (
                      <span className="product-tag origin">{p.nationality}</span>
                    )}
                    {p.type && (
                      <span className={`product-tag process ${getProcessClass(p.type)}`}>
                        {p.type}
                      </span>
                    )}
                  </div>
                </div>

                <div className="product-card-info">
                  <h3 className="product-card-name">{p.productName}</h3>
                  <div className="product-card-price">
                    ₩{formatPrice(p.basePrice)} <span>base price</span>
                  </div>
                  <div className="product-card-stock">
                    <span className={`stock-status ${stockStatus.class}`}>
                      {stockStatus.text}
                    </span>
                    <span className="stock-count">({totalStock})</span>
                  </div>
                </div>

                <div className="product-card-actions">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => onEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      if (confirm(`'${p.productName}' 상품을 삭제하시겠습니까?`)) {
                        onDelete(p.productId)
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
