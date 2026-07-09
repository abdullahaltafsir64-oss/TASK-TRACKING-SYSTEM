import React from "react";
import { Member, Phase, Task } from "../types";

interface TimelineViewProps {
  members: Member[];
  phases: Phase[];
  tasks: Task[];
  onSelectTask: (id: string) => void;
}

export default function TimelineView({
  members,
  phases,
  tasks,
  onSelectTask,
}: TimelineViewProps) {
  if (!tasks.length) {
    return (
      <div>
        <div className="flex items-start justify-between gap-5 mb-6">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-thread mb-1.5 block font-bold">
              Launch Plan
            </span>
            <h1 className="font-display font-bold text-[26px] text-ink leading-tight">
              Timeline
            </h1>
          </div>
        </div>
        <div className="text-center py-12 border-1.5 border-dashed border-line-strong rounded-[3px] bg-white">
          <div className="font-display font-bold text-[15px] mb-1">No tasks yet</div>
          <div className="text-[13px] text-kraft max-w-[36ch] mx-auto">
            Add tasks on the Task Board to visualize them on the Gantt timeline.
          </div>
        </div>
      </div>
    );
  }

  // Helper: Snap to Monday of the week
  const mondayOf = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);
    return d;
  };

  // 1. Calculate general date boundaries from existing tasks
  const allStarts = tasks.map((t) => new Date(t.start + "T00:00:00").getTime());
  const allEnds = tasks.map((t) => new Date(t.end + "T00:00:00").getTime());
  const minTime = Math.min(...allStarts);
  const maxTime = Math.max(...allEnds);

  let rangeStart = mondayOf(new Date(minTime));
  let rangeEnd = new Date(maxTime + 7 * 86400000); // Pad with one week

  const totalDays = Math.round((rangeEnd.getTime() - rangeStart.getTime()) / 86400000);

  // 2. Compute weeks
  const weeks: Date[] = [];
  let cursor = new Date(rangeStart);
  while (cursor < rangeEnd) {
    weeks.push(new Date(cursor));
    cursor = new Date(cursor.getTime() + 7 * 86400000);
  }

  // Sort tasks by start date
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime() || a.phase - b.phase
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-5 mb-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-thread mb-1.5 block font-bold">
            Launch Plan
          </span>
          <h1 className="font-display font-bold text-[26px] text-ink leading-tight">
            Timeline
          </h1>
          <p className="text-kraft text-[13.5px] mt-1.5 max-w-[60ch]">
            Week-by-week view of every task, color-coded by phase — bars are drawn live from each task's actual start and end dates.
          </p>
        </div>
      </div>

      {/* Phase Legenda */}
      <div className="flex items-center gap-3.5 flex-wrap mb-4 py-1">
        {phases.map((p) => (
          <span key={p.id} className="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
            <span
              className="w-2.5 h-2.5 rounded-[2px] block"
              style={{ backgroundColor: p.color }}
            />
            {p.name.replace(/^Phase \d+: /, "")}
          </span>
        ))}
      </div>

      {/* Gantt Wrap */}
      <div className="overflow-x-auto border border-line rounded-[3px] bg-white shadow-[0_1px_2px_rgba(18,24,27,0.06)]">
        <div className="min-w-[960px] select-none">
          {/* Header Row */}
          <div className="grid grid-cols-[260px_1fr] border-b border-line items-stretch bg-ink text-paper font-mono text-[10px] uppercase tracking-wider font-bold">
            <div className="px-3 py-3 border-r border-white/15 flex items-center">
              Task description
            </div>
            <div className="flex">
              {weeks.map((w, idx) => (
                <div
                  key={idx}
                  className="flex-1 text-center py-3 border-l border-white/10 first:border-l-0 text-white/70"
                >
                  {w.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          {sortedTasks.map((t) => {
            const phase = phases.find((p) => p.id === t.phase);
            const taskStart = new Date(t.start + "T00:00:00");
            const taskEnd = new Date(t.end + "T00:00:00");
            const offsetDays = Math.round((taskStart.getTime() - rangeStart.getTime()) / 86400000);
            const durationDays = Math.max(1, Math.round((taskEnd.getTime() - taskStart.getTime()) / 86400000) + 1);

            const leftPct = (offsetDays / totalDays) * 100;
            const widthPct = Math.max((durationDays / totalDays) * 100, 1.2);

            return (
              <div
                key={t.id}
                className="grid grid-cols-[260px_1fr] border-b border-line last:border-b-0 items-stretch"
              >
                {/* Title cell */}
                <div className="px-3 py-2 border-r border-line flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: phase?.color || "#999" }}
                  />
                  <span
                    className="text-[12px] font-semibold text-ink truncate"
                    title={t.title}
                  >
                    {t.title}
                  </span>
                </div>

                {/* Track/Bar cell */}
                <div
                  onClick={() => onSelectTask(t.id)}
                  className="relative p-1.5 min-h-[38px] flex items-center hover:bg-paper/20 cursor-pointer"
                >
                  {/* Grid Lines background */}
                  <div className="absolute inset-0 px-3 flex">
                    {weeks.map((_, idx) => (
                      <div
                        key={idx}
                        className="flex-1 border-l border-paper-dim first:border-l-0"
                      />
                    ))}
                  </div>

                  {/* Active Bar */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-5 rounded-[3px] flex items-center px-2 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.15)] bg-repeat-linear"
                    style={{
                      left: `calc(${leftPct}% + 12px)`,
                      width: `calc(${widthPct}% - 24px)`,
                      backgroundColor: phase?.color || "#999",
                      backgroundImage:
                        "repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 2px, transparent 2px, transparent 6px)",
                    }}
                  >
                    {widthPct > 6 && (
                      <span className="font-mono text-[9px] text-white font-bold whitespace-nowrap">
                        {t.duration}d
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
