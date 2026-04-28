function StatusBadge({ urgency }) {
  const styles = {
    High: {
      bg: 'rgba(239, 68, 68, 0.12)',
      text: '#dc2626',
      border: 'rgba(239, 68, 68, 0.3)',
    },
    Medium: {
      bg: 'rgba(245, 158, 11, 0.12)',
      text: '#d97706',
      border: 'rgba(245, 158, 11, 0.3)',
    },
    Low: {
      bg: 'rgba(16, 185, 129, 0.12)',
      text: '#059669',
      border: 'rgba(16, 185, 129, 0.3)',
    },
  };

  const labels = {
    High: 'High Priority',
    Medium: 'Medium Priority',
    Low: 'Low Priority',
  };

  const style = styles[urgency] || styles.Low;

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {labels[urgency] || urgency}
    </span>
  );
}

export default StatusBadge;