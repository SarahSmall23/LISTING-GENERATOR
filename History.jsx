function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

export default function History({ items, loading, error, activeId, onSelect, onDelete }) {
  return (
    <section className="panel history">
      <h2>Saved listings</h2>

      {loading && <p className="muted">Loading your history...</p>}
      {error && <div className="error" role="alert">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <p className="muted">Nothing saved yet. Your generated listings will show up here.</p>
      )}

      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.id === activeId ? "active" : ""}>
            <button type="button" className="history-item" onClick={() => onSelect(item)}>
              <strong>{item.product}</strong>
              <span>{item.inputs.platform} · {item.inputs.tone} · {formatDate(item.created_at)}</span>
            </button>
            <button
              type="button"
              className="delete"
              aria-label={`Delete listing for ${item.product}`}
              onClick={() => onDelete(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
