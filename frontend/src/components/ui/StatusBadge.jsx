function StatusBadge({ children, variant = "completed" }) {
  return <span className={`status ${variant}`}>{children}</span>;
}

export default StatusBadge;