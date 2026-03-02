import { CASE_STAGES } from "../constants/stages";

interface Props {
  currentStage: number;
}


export default function ProgressStepper({ currentStage }: Props) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[520px] flex items-start justify-between relative pt-2">
        {/* Progress line: track with offset to circle centers */}
        <div className="absolute top-6 left-10 right-10 h-1 bg-gray-200 rounded">
          {/* filled portion inside the track, percentage relative to track width */}
          <div
            className="h-1 bg-blue-500 rounded transition-all"
            style={{
              width: `${((currentStage - 1) / (CASE_STAGES.length - 1)) * 100}%`,
            }}
          />
        </div>

        {CASE_STAGES.map((stage, index) => {
          const step = index + 1;
          const isActive = step === currentStage;
          const isCompleted = step < currentStage;

          return (
            <div
              key={stage}
              className="flex flex-col items-center relative z-10 w-20 text-center"
            >
              {/* Circle */}
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold
                ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isActive
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>

              {/* Label */}
              <p className="mt-2 text-[10px] leading-tight text-gray-600">
                {stage}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}