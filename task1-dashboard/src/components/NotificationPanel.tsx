import  type { TimelineEvent } from '../types/patient';

interface Props {
  events: TimelineEvent[];
  isDark: boolean;
}

export default function NotificationPanel({ events, isDark }: Props) {
  return (
    <div
      className={`rounded-2xl shadow-sm p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
    >
      <h3
        className={`text-sm font-semibold mb-4 ${
          isDark ? 'text-gray-100' : 'text-gray-800'
        }`}
      >
        Recent Updates
      </h3>

      <div className="space-y-3">
        {events.map((event, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
            <div>
              <p className="text-sm" style={{ color: isDark ? '#E5E7EB' : '#374151' }}>
                {event.description}
              </p>
              <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                {event.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}