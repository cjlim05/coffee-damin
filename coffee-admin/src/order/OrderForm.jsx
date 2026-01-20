import { useState } from 'react'

export default function OrderForm({ members, products, onSave, onCancel, showMessage }) {
  const [form, setForm] = useState({
    memberId: '',
    shippingAddress: '',
    items: [{ productId: '', optionId: '', quantity: 1 }],
  })

  function changeMember(e) {
    const memberId = e.target.value
    const member = members.find(m => m.memberId === Number(memberId))
    setForm({
      ...form,
      memberId,
      shippingAddress: member?.address || form.shippingAddress,
    })
  }

  function changeItem(index, field, value) {
    const items = [...form.items]
    items[index][field] = value
    if (field === 'productId') {
      items[index].optionId = ''
    }
    setForm({ ...form, items })
  }

  function addItem() {
    setForm({
      ...form,
      items: [...form.items, { productId: '', optionId: '', quantity: 1 }],
    })
  }

  function removeItem(index) {
    if (form.items.length <= 1) {
      showMessage('warning', '최소 1개의 상품이 필요합니다.')
      return
    }
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    })
  }

  function getProductOptions(productId) {
    const product = products.find(p => p.productId === Number(productId))
    return product?.options || []
  }

  function validateForm() {
    if (!form.memberId) {
      showMessage('error', '회원을 선택해주세요.')
      return false
    }
    if (form.items.some(it => !it.productId || !it.optionId)) {
      showMessage('error', '상품과 옵션을 모두 선택해주세요.')
      return false
    }
    return true
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validateForm()) return

    // Find variantId from product options
    const itemsWithVariant = form.items.map(it => {
      const product = products.find(p => p.productId === Number(it.productId))
      const option = product?.options?.find(o => o.optionId === Number(it.optionId))
      return {
        variantId: option?.variantId,
        quantity: Number(it.quantity),
      }
    })

    onSave({
      memberId: Number(form.memberId),
      shippingAddress: form.shippingAddress,
      items: itemsWithVariant,
    })
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>새 주문 등록</h2>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          취소
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label required">회원 선택</label>
          <select
            className="form-select"
            value={form.memberId}
            onChange={changeMember}
          >
            <option value="">회원을 선택하세요</option>
            {members.map(m => (
              <option key={m.memberId} value={m.memberId}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">배송 주소</label>
          <input
            className="form-input"
            value={form.shippingAddress}
            onChange={e => setForm({ ...form, shippingAddress: e.target.value })}
            placeholder="배송 주소 입력"
          />
        </div>

        <div className="form-group">
          <div className="form-label-row">
            <label className="form-label required">주문 상품</label>
            <button type="button" className="btn btn-sm btn-outline" onClick={addItem}>
              + 상품 추가
            </button>
          </div>

          <div className="order-items">
            {form.items.map((item, i) => (
              <div key={i} className="order-item-row">
                <select
                  className="form-select"
                  value={item.productId}
                  onChange={e => changeItem(i, 'productId', e.target.value)}
                >
                  <option value="">상품 선택</option>
                  {products.map(p => (
                    <option key={p.productId} value={p.productId}>
                      {p.productName}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select"
                  value={item.optionId}
                  onChange={e => changeItem(i, 'optionId', e.target.value)}
                  disabled={!item.productId}
                >
                  <option value="">옵션 선택</option>
                  {getProductOptions(item.productId).map(opt => (
                    <option key={opt.optionId} value={opt.optionId}>
                      {opt.optionValue} {opt.extraPrice > 0 && `(+${opt.extraPrice.toLocaleString()}원)`}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="form-input quantity-input"
                  min="1"
                  value={item.quantity}
                  onChange={e => changeItem(i, 'quantity', e.target.value)}
                />

                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeItem(i)}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg">
            주문 등록
          </button>
        </div>
      </form>
    </div>
  )
}
