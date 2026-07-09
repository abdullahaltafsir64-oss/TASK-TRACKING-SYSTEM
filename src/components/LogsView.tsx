import React from "react";
import { Plus, Clock, Inbox } from "lucide-react";
import { Member, LogEntry } from "../types";

interface LogsViewProps {
  members: Member[];
  logs: LogEntry[];
  onSelectLog: (id: string) => void;
  onAddLog: () => void;
}

export default function LogsView({
  members,
  logs,
  onSelectLog,
  onAddLog,
}: LogsViewProps) {
  // Sort logs descending by date
  const sorted = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group by date
  const groups: Record<string, LogEntry[]> = {};
  sorted.forEach((l) => {
    if (!groups[l.date]) {
      groups[l.date] = [];
    }
    groups[l.date].push(l);
  });

  const uniqueDays = Object.keys(groups).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const totalHours = logs.reduce((a, l) => a + (Number(l.hours) || 0), 0);
  const totalUploads = logs.reduce((a, l) => a + (Number(l.uploads) || 0), 0);

  const getMember = (id: string) => members.find((m) => m.id === id);

  const getMemberInitials = (id: string) => {
    const m = getMember(id);
    return m ? m.initials : "??";
  };

  const getMemberColor = (id: string) => {
    const m = getMember(id);
    return m ? m.color : "#999";
  };

  const fmtDateFull = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const statusClass = (status: string) => {
    return "status-" + String(status || "completed").toLowerCase().replace(/\s+/g, "");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-5 mb-6 flex-wrap">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-thread mb-1.5 block font-bold">
            Engagement Tracker
          </span>
          <h1 className="font-display font-bold text-[26px] text-ink leading-tight">
            Activity Log
          </h1>
          <p className="text-kraft text-[13.5px] mt-1.5 max-w-[60ch]">
            Daily hours contributed and work completed by each launch team member.
          </p>
        </div>
        <div>
          <button
            onClick={onAddLog}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 border border-thread rounded-[3px] text-[13px] font-semibold bg-thread hover:bg-[#A9531F] hover:border-[#A9531F] text-white transition-all shadow-[0_1px_2px_rgba(18,24,27,0.06)] cursor-pointer"
          >
            <Plus size={14} className="stroke-[2.5]" /> Log activity
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-7">
        <div className="bg-white border border-line rounded-[3px] p-4 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-thread">
          <div className="font-display text-[26px] font-bold text-ink leading-none">
            {totalHours}h
          </div>
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-kraft mt-1.5 font-bold">
            Total Hours Contributed
          </div>
        </div>

        <div className="bg-white border border-line rounded-[3px] p-4 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-spool">
          <div className="font-display text-[26px] font-bold text-ink leading-none">
            {totalUploads}
          </div>
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-kraft mt-1.5 font-bold">
            Videos / Shorts Uploaded
          </div>
        </div>

        <div className="bg-white border border-line rounded-[3px] p-4 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-kraft">
          <div className="font-display text-[26px] font-bold text-ink leading-none">
            {logs.length}
          </div>
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-kraft mt-1.5 font-bold">
            Logged Entries
          </div>
        </div>
      </div>

      {/* Log Groups */}
      <div className="flex flex-col gap-6">
        {uniqueDays.length ? (
          uniqueDays.map((day) => {
            const dayEntries = groups[day];
            const dayHours = dayEntries.reduce((acc, current) => acc + (Number(current.hours) || 0), 0);

            return (
              <div key={day} className="border-b border-line last:border-b-0 pb-4">
                <div className="flex items-baseline gap-2.5 mb-3.5 pb-1 border-b border-line-strong">
                  <span className="font-display font-bold text-[14.5px] text-ink">
                    {fmtDateFull(day)}
                  </span>
                  <span className="font-mono text-[11px] text-kraft font-semibold">
                    {dayEntries.length} {dayEntries.length === 1 ? "entry" : "entries"} · {dayHours}h total
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {dayEntries.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => onSelectLog(l.id)}
                      className="flex items-start gap-3 p-2 border border-transparent hover:bg-paper-dim rounded-[3px] transition-colors cursor-pointer select-none"
                    >
                      <span
                        className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[8.5px] text-white font-mono font-bold shrink-0 mt-0.5"
                        style={{ backgroundColor: getMemberColor(l.member) }}
                      >
                        {getMemberInitials(l.member)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-[13px] font-semibold text-ink leading-none">
                            {getMember(l.member)?.name || l.member}
                          </span>
                          <span className={`status-chip ${statusClass(l.status)}`}>
                            <span className="dot" />
                            {l.status || "Logged"}
                          </span>
                        </div>
                        <div className="text-[13px] text-ink-soft leading-relaxed">
                          {l.task}
                        </div>
                        <div className="font-mono text-[10.5px] text-kraft mt-1 font-semibold">
                          {l.hours}h logged
                          {l.uploads > 0 && (
                            <span>
                              {" "}
                              · {l.uploads} video upload{l.uploads !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 border-1.5 border-dashed border-line-strong rounded-[3px] bg-white">
            <Inbox size={36} className="text-line-strong mx-auto mb-3 stroke-[1.5]" />
            <div className="font-display font-bold text-[15px] mb-1">No activity logged</div>
            <div className="text-[13px] text-kraft max-w-[36ch] mx-auto mb-4">
              Log the first day's contributions from the team.
            </div>
            <button
              onClick={onAddLog}
              className="px-3.5 py-2 border border-line-strong rounded-[3px] text-[13px] font-semibold bg-white hover:bg-paper-dim text-ink transition-all cursor-pointer"
            >
              Log activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
