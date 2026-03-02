interface Props {
  urgency: "normal" | "attention" | "urgent";
}

const urgencyConfig = {
  normal: {
    label: "Normal",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  attention: {
    label: "Attention Needed",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  urgent: {
    label: "Urgent",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function StatusBadge({ urgency }: Props) {
  const config = urgencyConfig[urgency];

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold border rounded-full shadow-sm ${config.className}`}
    >
      ● {config.label}
    </span>
  );
}