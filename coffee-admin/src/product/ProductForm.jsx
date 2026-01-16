import { useState } from 'react'

const UPLOAD_BASE = 'http://localhost:8080/uploads/'

const CONTINENT_COUNTRIES = {
  '아프리카': ['에티오피아', '케냐', '탄자니아', '르완다'],
  '중남미': ['브라질', '콜롬비아', '과테말라', '코스타리카', '온두라스', '멕시코', '엘살바도르', '파나마', '페루', '니카라과', '볼리비아'],
  '아시아': ['인도네시아', '베트남', '인도'],
}

const CONTINENTS = Object.keys(CONTINENT_COUNTRIES)

const PROCESS_TYPES = [
  '워시드', '내추럴', '허니', '화이트 허니', '옐로우 허니',
  '레드 허니', '블랙 허니', '애너로빅', '카보닉 매서레이션',
]

const WEIGHT_OPTIONS = ['200g', '300g', '500g', '1kg']

function getImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return UPLOAD_BASE + path
}

const initialForm = {
  name: '',
  price: '',
  continent: '',
  nationality: '',
  type: '',
  thumbnailFile: null,
  thumbnailPreview: '',
  detailFiles: [],
  detailPreviews: [],
  options: [{ optionValue: '200g', extraPrice: 0, stock: 0 }],
}

export default function ProductForm({ editingId, editData, onSave, onCancel, showMessage }) {
  const [form, setForm] = useState(() => {
    if (editData) {
      const existingPreviews = (editData.detailImages || []).map(img => ({
        imageId: img.imageId,
        preview: getImageUrl(img.imageUrl),
        isNew: false,
      }))

      return {
        name: editData.productName,
        price: editData.basePrice,
        continent: editData.continent || '',
        nationality: editData.nationality || '',
        type: editData.type || '',
        thumbnailFile: null,
        thumbnailPreview: getImageUrl(editData.thumbnailImg),
        detailFiles: [],
        detailPreviews: existingPreviews,
        options:
          editData.options?.length > 0
            ? editData.options.map(o => ({
                optionValue: o.optionValue,
                extraPrice: o.extraPrice,
                stock: o.stock,
              }))
            : [{ optionValue: '200g', extraPrice: 0, stock: 0 }],
      }
    }
    return initialForm
  })

  // 기본 입력
  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 썸네일
  function changeThumbnail(file) {
    if (!file) return
    setForm({
      ...form,
      thumbnailFile: file,
      thumbnailPreview: URL.createObjectURL(file),
    })
  }

  // 상세 이미지 추가
  function addDetailFiles(files) {
    const arr = Array.from(files)
    const newPreviews = arr.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      isNew: true,
    }))
    setForm({
      ...form,
      detailFiles: [...form.detailFiles, ...arr],
      detailPreviews: [...form.detailPreviews, ...newPreviews],
    })
  }

  // 상세 이미지 삭제
  function removeDetail(index) {
    const newFiles = form.detailFiles.filter((_, i) => {
      const previewItem = form.detailPreviews[index]
      if (previewItem?.isNew) {
        const newFileIndex = form.detailPreviews
          .slice(0, index)
          .filter(p => p.isNew).length
        return i !== newFileIndex
      }
      return true
    })

    setForm({
      ...form,
      detailFiles: form.detailPreviews[index]?.isNew ? newFiles : form.detailFiles,
      detailPreviews: form.detailPreviews.filter((_, i) => i !== index),
    })
  }

  // 상세 이미지 순서 변경
  function moveDetail(from, to) {
    if (to < 0 || to >= form.detailPreviews.length) return
    const previews = [...form.detailPreviews]
    ;[previews[from], previews[to]] = [previews[to], previews[from]]
    setForm({ ...form, detailPreviews: previews })
  }

  // 옵션 변경
  function changeOption(index, key, value) {
    const next = [...form.options]
    next[index][key] = value
    setForm({ ...form, options: next })
  }

  // 옵션 추가
  function addOption() {
    if (form.options.length >= 4) {
      showMessage('warning', '옵션은 최대 4개까지 추가할 수 있습니다.')
      return
    }
    const usedOptions = form.options.map(o => o.optionValue)
    const nextOption = WEIGHT_OPTIONS.find(w => !usedOptions.includes(w)) || '300g'
    setForm({
      ...form,
      options: [...form.options, { optionValue: nextOption, extraPrice: 0, stock: 0 }],
    })
  }

  // 옵션 삭제
  function removeOption(index) {
    if (form.options.length <= 1) {
      showMessage('warning', '최소 1개의 옵션이 필요합니다.')
      return
    }
    setForm({
      ...form,
      options: form.options.filter((_, i) => i !== index),
    })
  }

  // 폼 검증
  function validateForm() {
    if (!form.name.trim()) {
      showMessage('error', '상품명을 입력해주세요.')
      return false
    }
    if (!form.price || form.price <= 0) {
      showMessage('error', '가격을 입력해주세요.')
      return false
    }
    if (!editingId && !form.thumbnailFile && !form.thumbnailPreview) {
      showMessage('error', '썸네일 이미지를 등록해주세요.')
      return false
    }
    return true
  }

  // 제출
  function handleSubmit(e) {
    e.preventDefault()
    if (!validateForm()) return

    const fd = new FormData()
    fd.append('productName', form.name)
    fd.append('basePrice', Number(form.price || 0))
    fd.append('continent', form.continent)
    fd.append('nationality', form.nationality)
    fd.append('type', form.type)

    if (form.thumbnailFile) {
      fd.append('thumbnail', form.thumbnailFile)
    }

    form.detailPreviews.forEach((item) => {
      if (item.isNew && item.file) {
        fd.append('detailImages', item.file)
      }
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

    onSave(fd)
  }

  // 취소/초기화
  function handleCancel() {
    setForm(initialForm)
    onCancel()
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{editingId ? '상품 수정' : '새 상품 등록'}</h2>
        {editingId && (
          <button type="button" className="btn btn-ghost" onClick={handleCancel}>
            취소
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* 기본 정보 */}
        <div className="form-group">
          <label className="form-label required">상품명</label>
          <input
            name="name"
            className="form-input"
            placeholder="예: 에티오피아 예가체프"
            value={form.name}
            onChange={change}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">기본 가격</label>
            <div className="input-with-unit">
              <input
                name="price"
                type="number"
                className="form-input"
                placeholder="0"
                value={form.price}
                onChange={change}
              />
              <span className="unit">원</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">대륙</label>
            <select
              name="continent"
              className="form-select"
              value={form.continent}
              onChange={(e) => {
                setForm({ ...form, continent: e.target.value, nationality: '' })
              }}
            >
              <option value="">선택하세요</option>
              {CONTINENTS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">원산지</label>
            <select
              name="nationality"
              className="form-select"
              value={form.nationality}
              onChange={change}
              disabled={!form.continent}
            >
              <option value="">선택하세요</option>
              {form.continent && CONTINENT_COUNTRIES[form.continent]?.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">가공 방식</label>
            <select
              name="type"
              className="form-select"
              value={form.type}
              onChange={change}
            >
              <option value="">선택하세요</option>
              {PROCESS_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 썸네일 */}
        <div className="form-group">
          <label className="form-label required">썸네일 이미지</label>
          <div className="thumbnail-upload">
            {form.thumbnailPreview ? (
              <div className="thumbnail-preview">
                <img src={form.thumbnailPreview} alt="썸네일" />
                <button
                  type="button"
                  className="btn-remove-thumbnail"
                  onClick={() => setForm({ ...form, thumbnailFile: null, thumbnailPreview: '' })}
                >
                  X
                </button>
              </div>
            ) : (
              <label className="upload-placeholder">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => changeThumbnail(e.target.files[0])}
                />
                <span className="upload-icon">+</span>
                <span>이미지 선택</span>
              </label>
            )}
          </div>
        </div>

        {/* 상세 이미지 */}
        <div className="form-group">
          <label className="form-label">상세 이미지</label>
          <p className="form-hint">여러 장의 상세 이미지를 등록할 수 있습니다.</p>

          <div className="detail-images-grid">
            {form.detailPreviews.map((item, i) => (
              <div key={i} className="detail-image-item">
                <span className="image-order">{i + 1}</span>
                <img src={item.preview} alt={`상세 ${i + 1}`} />
                <div className="image-actions">
                  <button type="button" onClick={() => moveDetail(i, i - 1)} disabled={i === 0}>
                    ←
                  </button>
                  <button type="button" onClick={() => moveDetail(i, i + 1)} disabled={i === form.detailPreviews.length - 1}>
                    →
                  </button>
                  <button type="button" className="btn-delete" onClick={() => removeDetail(i)}>
                    삭제
                  </button>
                </div>
              </div>
            ))}

            <label className="detail-upload-placeholder">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={e => addDetailFiles(e.target.files)}
              />
              <span className="upload-icon">+</span>
              <span>추가</span>
            </label>
          </div>
        </div>

        {/* 옵션 */}
        <div className="form-group">
          <div className="form-label-row">
            <label className="form-label">옵션 (용량별 가격/재고)</label>
            <button type="button" className="btn btn-sm btn-outline" onClick={addOption}>
              + 옵션 추가
            </button>
          </div>

          <div className="options-table">
            <div className="options-header">
              <span>용량</span>
              <span>추가금액</span>
              <span>재고</span>
              <span></span>
            </div>
            {form.options.map((o, i) => (
              <div key={i} className="option-row">
                <select
                  value={o.optionValue}
                  onChange={e => changeOption(i, 'optionValue', e.target.value)}
                >
                  {WEIGHT_OPTIONS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={o.extraPrice}
                    onChange={e => changeOption(i, 'extraPrice', e.target.value)}
                  />
                  <span className="unit">원</span>
                </div>
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={o.stock}
                    onChange={e => changeOption(i, 'stock', e.target.value)}
                  />
                  <span className="unit">개</span>
                </div>
                <button
                  type="button"
                  className="btn-icon btn-delete"
                  onClick={() => removeOption(i)}
                  disabled={form.options.length <= 1}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg">
            {editingId ? '수정 완료' : '상품 등록'}
          </button>
        </div>
      </form>
    </div>
  )
}
