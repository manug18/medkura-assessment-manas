import  type { TimelineEvent } from '../types/patient';

interface Props {
  events: TimelineEvent[];
}

export default function NotificationPanel({ events }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Recent Updates
      </h3>

      <div className="space-y-3">
        {events.map((event, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
            <div>
              <p className="text-sm text-gray-700">{event.description}</p>
              <p className="text-xs text-gray-400">{event.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}