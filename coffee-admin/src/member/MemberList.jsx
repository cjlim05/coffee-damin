function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

export default function MemberList({ members, editingId, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>등록된 회원</h2>
        <span className="badge">{members.length}명</span>
      </div>

      {members.length === 0 ? (
        <div className="empty-state">
          <p>등록된 회원이 없습니다.</p>
          <p className="hint">왼쪽 폼에서 새 회원을 등록해보세요.</p>
        </div>
      ) : (
        <div className="member-list">
          {members.map(m => (
            <div
              key={m.memberId}
              className={`member-item ${editingId === m.memberId ? 'editing' : ''}`}
            >
              <div className="member-info">
                <h3 className="member-name">{m.name}</h3>
                <div className="member-email">{m.email}</div>
                <div className="member-meta">
                  {m.phone && <span className="tag">{m.phone}</span>}
                  <span className="tag">가입일: {formatDate(m.createdAt)}</span>
                </div>
                {m.address && <div className="member-address">{m.address}</div>}
              </div>

              <div className="member-actions">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onEdit(m)}
                >
                  수정
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(m.memberId)}
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
