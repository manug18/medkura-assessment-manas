interface Props {
  urgency: "normal" | "attention" | "urgent";
  isDark: boolean;
}

export default function StatusBadge({ urgency, isDark }: Props) {
  const baseText = isDark ? 'text-white' : '';
  let className = '';
  let label = '';

  if (urgency === 'normal') {
    label = 'Normal';
    className = isDark
      ? `${baseText} bg-emerald-700 border-emerald-600`
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (urgency === 'attention') {
    label = 'Attention Needed';
    className = isDark
      ? `${baseText} bg-amber-700 border-amber-600`
      : 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (urgency === 'urgent') {
    label = 'Urgent';
    className = isDark
      ? `${baseText} bg-red-700 border-red-600`
      : 'bg-red-50 text-red-700 border-red-200';
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold border rounded-full shadow-sm ${className}`}
    >
      ● {label}
    </span>
  );
}
