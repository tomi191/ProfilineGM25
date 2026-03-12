type Status = 'new' | 'contacted' | 'closed';

const statusStyles: Record<Status, string> = {
  new: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  contacted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const statusLabels: Record<Status, string> = {
  new: 'New',
  contacted: 'Contacted',
  closed: 'Closed',
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
