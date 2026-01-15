import { useEffect, useState } from 'react'
import './admin-products.css'

const API = 'http://localhost:8080/api/products'

const NATIONALITIES = [
  '브라질','콜롬비아','에티오피아','케냐','과테말라','코스타리카',
  '온두라스','멕시코','엘살바도르','인도네시아','베트남','인도',
  '탄자니아','르완다','파나마','페루','니카라과','볼리비아',
]

const PROCESS_TYPES = [
  '워시드','내추럴','허니','화이트 허니','옐로우 허니',
  '레드 허니','블랙 허니','애너로빅','카보닉 매서레이션',
]

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    price: '',
    nationality: '',
    type: '',
    thumbnailFile: null,
    thumbnailPreview: '',
    detailFiles: [],
    detailPreviews: [],
    options: [{ optionValue: '200g', extraPrice: 0, stock: 0 }],
  })

  /* ===================== 목록 ===================== */
  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(setProducts)
  }, [])

  /* ===================== 기본 입력 ===================== */
  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  /* ===================== 썸네일 ===================== */
  function changeThumbnail(file) {
    setForm({
      ...form,
      thumbnailFile: file,
      thumbnailPreview: file ? URL.createObjectURL(file) : form.thumbnailPreview,
    })
  }

  /* ===================== 상세 이미지 ===================== */
  function addDetailFiles(files) {
    const arr = Array.from(files)
    setForm({
      ...form,
      detailFiles: [...form.detailFiles, ...arr],
      detailPreviews: [...form.detailPreviews, ...arr.map(f => URL.createObjectURL(f))],
    })
  }

  function removeDetail(i) {
    setForm({
      ...form,
      detailFiles: form.detailFiles.filter((_, idx) => idx !== i),
      detailPreviews: form.detailPreviews.filter((_, idx) => idx !== i),
    })
  }

  function moveDetail(from, to) {
    if (to < 0 || to >= form.detailFiles.length) return

    const files = [...form.detailFiles]
    const previews = [...form.detailPreviews]

    ;[files[from], files[to]] = [files[to], files[from]]
    ;[previews[from], previews[to]] = [previews[to], previews[from]]

    setForm({ ...form, detailFiles: files, detailPreviews: previews })
  }

  /* ===================== 옵션 ===================== */
  function changeOption(i, key, value) {
    const next = [...form.options]
    next[i][key] = value
    setForm({ ...form, options: next })
  }

  function addOption() {
    if (form.options.length >= 3) return
    setForm({
      ...form,
      options: [...form.options, { optionValue: '300g', extraPrice: 0, stock: 0 }],
    })
  }

  function removeOption(i) {
    if (i === 0) return
    setForm({
      ...form,
      options: form.options.filter((_, idx) => idx !== i),
    })
  }

  /* ===================== 저장 ===================== */
  function submit(e) {
    e.preventDefault()

    const fd = new FormData()
    fd.append('productName', form.name)
    fd.append('basePrice', Number(form.price || 0))
    fd.append('nationality', form.nationality)
    fd.append('type', form.type)

    if (form.thumbnailFile) {
      fd.append('thumbnail', form.thumbnailFile)
    }

    form.detailFiles.forEach((file, index) => {
      fd.append('detailImages', file)
      fd.append('detailOrders', index)
    })

    fd.append(
      'options',
      JSON.stringify(
        form.options.map(o => ({
          optionValue: o.optionValue,
          extraPrice: Number(o.extraPrice),
          stock: Number(o.stock),
        }))
      )
    )

    fetch(editingId ? `${API}/${editingId}` : API, {
      method: editingId ? 'PUT' : 'POST',
      body: fd,
    })
      .then(res => res.json())
      .then(saved => {
        setProducts(p =>
          editingId
            ? p.map(it => it.productId === saved.productId ? saved : it)
            : [saved, ...p]
        )
        reset()
      })
  }

  /* ===================== 수정 ===================== */
  function edit(p) {
    setEditingId(p.productId)
    setForm({
      name: p.productName,
      price: p.basePrice,
      nationality: p.nationality || '',
      type: p.type || '',
      thumbnailFile: null,
      thumbnailPreview: p.thumbnailImg
        ? p.thumbnailImg.startsWith('http')
          ? p.thumbnailImg
          : `http://localhost:8080/uploads/${p.thumbnailImg}`
        : '',
      detailFiles: [],
      detailPreviews: (p.detailImages || []).map(
        img => img.startsWith('http') ? img : `http://localhost:8080/uploads/${img}`
      ),
      options: p.options || [{ optionValue: '200g', extraPrice: 0, stock: 0 }],
    })
  }

  /* ===================== 삭제 ===================== */
  function remove(id) {
    if (!confirm('삭제하시겠습니까?')) return
    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(() => setProducts(p => p.filter(it => it.productId !== id)))
  }

  function reset() {
    setEditingId(null)
    setForm({
      name: '',
      price: '',
      nationality: '',
      type: '',
      thumbnailFile: null,
      thumbnailPreview: '',
      detailFiles: [],
      detailPreviews: [],
      options: [{ optionValue: '200g', extraPrice: 0, stock: 0 }],
    })
  }

  /* ===================== UI ===================== */
  return (
    <div className="wrap">
      <h1>상품 관리</h1>

      {/* ===== 등록 / 수정 ===== */}
      <form className="box" onSubmit={submit}>
        <h3>{editingId ? '상품 수정' : '상품 등록'}</h3>

        <input name="name" placeholder="상품명" value={form.name} onChange={change} />
        <input name="price" type="number" placeholder="가격" value={form.price} onChange={change} />

        <select name="nationality" value={form.nationality} onChange={change}>
          <option value="">원산지</option>
          {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
        </select>

        <select name="type" value={form.type} onChange={change}>
          <option value="">가공 방식</option>
          {PROCESS_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>

        <label>썸네일
          <input type="file" accept="image/*" onChange={e => changeThumbnail(e.target.files[0])} />
          {form.thumbnailPreview && <img src={form.thumbnailPreview} width="100" />}
        </label>

        <label>상세 이미지 여러 장
          <input type="file" multiple accept="image/*" onChange={e => addDetailFiles(e.target.files)} />
        </label>

        <div className="detail-images">
          {form.detailPreviews.map((src, i) => (
            <div key={i} className="detail-item">
              <div className="detail-label">{i + 1}번</div>
              <img src={src} width="140" />
              <div className="detail-buttons">
                <button type="button" onClick={() => moveDetail(i, i - 1)}>◀</button>
                <button type="button" onClick={() => moveDetail(i, i + 1)}>▶</button>
                <button type="button" onClick={() => removeDetail(i)}>삭제</button>
              </div>
            </div>
          ))}
        </div>

        {/* ===== 옵션 ===== */}
        <h4>옵션</h4>
        <div className="option-header">
          <div>옵션 수량</div>
          <div>추가금액</div>
          <div>재고</div>
          <div></div>
        </div>
        {form.options.map((o, i) => (
          <div key={i} className="option-row">
            <select value={o.optionValue} disabled={i === 0}
              onChange={e => changeOption(i, 'optionValue', e.target.value)}>
              {i === 0 ? <option>200g</option> : <>
                <option>300g</option>
                <option>500g</option>
              </>}
            </select>
            <input type="number" value={o.extraPrice}
              onChange={e => changeOption(i, 'extraPrice', e.target.value)} />
            <input type="number" value={o.stock}
              onChange={e => changeOption(i, 'stock', e.target.value)} />
            {i !== 0 && <button type="button" onClick={() => removeOption(i)}>삭제</button>}
          </div>
        ))}
        <button type="button" onClick={addOption}>옵션 추가</button>

        <div className="btns">
          <button type="submit">{editingId ? '수정' : '등록'}</button>
          {editingId && <button type="button" onClick={reset}>취소</button>}
        </div>
      </form>

      {/* ===== 목록 ===== */}
      <div className="box">
        <h3>상품 목록</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>가격</th>
              <th>원산지</th>
              <th>가공</th>
              <th>썸네일</th>
              <th>상세</th>
              <th>옵션</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr><td colSpan="9">상품 없음</td></tr>
            )}
            {products.map(p => (
              <tr key={p.productId}>
                <td>{p.productId}</td>
                <td>{p.productName}</td>
                <td>{p.basePrice}</td>
                <td>{p.nationality}</td>
                <td>{p.type}</td>
                <td>
                  {p.thumbnailImg && (
                    <img
                      src={p.thumbnailImg.startsWith('http')
                        ? p.thumbnailImg
                        : `http://localhost:8080/uploads/${p.thumbnailImg}`}
                      width="50"
                    />
                  )}
                </td>
                <td>{p.detailImages?.length ? `${p.detailImages.length}장` : '-'}</td>
                <td>
                  {p.options.map((o, i) => (
                    <div key={i}>{o.optionValue} / +{o.extraPrice} / {o.stock}</div>
                  ))}
                </td>
                <td>
                  <button onClick={() => edit(p)}>수정</button>
                  <button onClick={() => remove(p.productId)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
