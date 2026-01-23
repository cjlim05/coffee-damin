import { useState, useMemo } from 'react'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(index) {
  const colors = ['blue', 'purple', 'green', 'yellow', 'red']
  return colors[index % colors.length]
}

const ITEMS_PER_PAGE = 5

export default function MemberList({ members, editingId, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredMembers = useMemo(() => {
    if (!search.trim()) return members
    const term = search.toLowerCase()
    return members.filter(m =>
      m.name?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.phone?.includes(term)
    )
  }, [members, search])

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <h2>Member Directory</h2>
        </div>
        <div className="list-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <p>등록된 회원이 없습니다.</p>
          <p className="hint">왼쪽 폼에서 새 회원을 등록해보세요.</p>
        </div>
      ) : (
        <>
          <div className="member-table-wrapper">
            <table className="member-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Contact</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((m, idx) => (
                  <tr
                    key={m.memberId}
                    className={editingId === m.memberId ? 'editing' : ''}
                  >
                    <td>
                      <div className="member-cell">
                        <div className={`member-avatar ${getAvatarColor(startIndex + idx)}`}>
                          {getInitials(m.name)}
                        </div>
                        <div className="member-name-group">
                          <span className="member-name">{m.name}</span>
                          <span className="member-email">{m.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="member-contact">{m.phone || '-'}</span>
                    </td>
                    <td>
                      <span className="member-date">{formatDate(m.createdAt)}</span>
                    </td>
                    <td>
                      <div className="member-actions">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => onEdit(m)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (confirm(`'${m.name}' 회원을 삭제하시겠습니까?`)) {
                              onDelete(m.memberId)
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span className="table-info">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredMembers.length)} of {filteredMembers.length} entries
            </span>
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                let pageNum
                if (totalPages <= 3) {
                  pageNum = i + 1
                } else if (currentPage === 1) {
                  pageNum = i + 1
                } else if (currentPage === totalPages) {
                  pageNum = totalPages - 2 + i
                } else {
                  pageNum = currentPage - 1 + i
                }
                return (
                  <button
                    key={pageNum}
                    className={currentPage === pageNum ? 'active' : ''}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
