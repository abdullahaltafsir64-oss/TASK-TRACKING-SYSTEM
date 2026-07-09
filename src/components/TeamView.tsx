import React from "react";
import { Member, Task, Meeting, LogEntry } from "../types";

interface TeamViewProps {
  members: Member[];
  tasks: Task[];
  meetings: Meeting[];
  logs: LogEntry[];
}

export default function TeamView({
  members,
  tasks,
  meetings,
  logs,
}: TeamViewProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-5 mb-6">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-thread mb-1.5 block font-bold">
            Apparel Ops Global
          </span>
          <h1 className="font-display font-bold text-[26px] text-ink leading-tight">
            Team
          </h1>
          <p className="text-kraft text-[13.5px] mt-1.5 max-w-[60ch]">
            Everyone contributing to the course launch, with their current workload and cumulative participation totals.
          </p>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {members.map((m) => {
          // Calculate specific member stats
          const memberTasks = tasks.filter((t) => (t.collaborators || []).includes(m.id));
          const doneCount = memberTasks.filter((t) => t.status === "Done").length;
          const totalHours = logs
            .filter((l) => l.member === m.id)
            .reduce((acc, current) => acc + (Number(current.hours) || 0), 0);
          const meetingsLed = meetings.filter((mt) => mt.leader === m.id).length;

          return (
            <div
              key={m.id}
              className="bg-white border border-line rounded-[3px] p-[18px] text-center select-none shadow-[0_1px_2px_rgba(18,24,27,0.04)]"
            >
              {/* Large Avatar */}
              <span
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-[17px] text-white font-mono font-bold mx-auto mb-2.5 shadow-sm border border-white"
                style={{ backgroundColor: m.color }}
              >
                {m.initials}
              </span>

              <div className="font-display font-bold text-[16.5px] text-ink">
                {m.name}
              </div>
              <div className="font-mono text-[10.5px] text-kraft uppercase tracking-wider mt-0.5 font-bold">
                {memberTasks.length} active task{memberTasks.length !== 1 ? "s" : ""}
              </div>

              {/* Stat Pillars */}
              <div className="flex justify-center gap-[18px] mt-3.5 pt-3.5 border-t border-line">
                <div>
                  <div className="font-display font-bold text-[17px] text-ink leading-none">
                    {doneCount}/{memberTasks.length}
                  </div>
                  <div className="font-mono text-[9.5px] text-kraft uppercase tracking-wider mt-1 font-bold">
                    Done
                  </div>
                </div>

                <div>
                  <div className="font-display font-bold text-[17px] text-ink leading-none">
                    {totalHours}h
                  </div>
                  <div className="font-mono text-[9.5px] text-kraft uppercase tracking-wider mt-1 font-bold">
                    Logged
                  </div>
                </div>

                <div>
                  <div className="font-display font-bold text-[17px] text-ink leading-none">
                    {meetingsLed}
                  </div>
                  <div className="font-mono text-[9.5px] text-kraft uppercase tracking-wider mt-1 font-bold">
                    Led Syncs
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
