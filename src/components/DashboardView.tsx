import React from "react";
import { Plus, Clock, AlertCircle } from "lucide-react";
import { Member, Phase, Task, Meeting, LogEntry } from "../types";

interface DashboardViewProps {
  members: Member[];
  phases: Phase[];
  tasks: Task[];
  meetings: Meeting[];
  logs: LogEntry[];
  onAddTask: () => void;
  onSelectTask: (id: string) => void;
  onSelectMeeting: (id: string) => void;
  onNavigateToPhase: (phaseId: number) => void;
}

export default function DashboardView({
  members,
  phases,
  tasks,
  meetings,
  logs,
  onAddTask,
  onSelectTask,
  onSelectMeeting,
  onNavigateToPhase,
}: DashboardViewProps) {
  // Helpers
  const getMember = (id: string) => members.find((m) => m.id === id);

  const fmtDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const statusClass = (status: string) => {
    return "status-" + String(status || "notstarted").toLowerCase().replace(/\s+/g, "");
  };

  const getPhaseProgress = (phaseId: number) => {
    const phaseTasks = tasks.filter((t) => t.phase === phaseId);
    if (!phaseTasks.length) return 0;
    const weight: Record<string, number> = {
      "Done": 1,
      "Ongoing": 0.5,
      "Not Started": 0,
      "Blocked": 0,
    };
    const sum = phaseTasks.reduce((acc, t) => acc + (weight[t.status] ?? 0), 0);
    return Math.round((sum / phaseTasks.length) * 100);
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "Done").length;
  const ongoingTasks = tasks.filter((t) => t.status === "Ongoing").length;
  const openMeetings = meetings.filter((m) => m.status === "Open" || m.status === "Continuous").length;
  const totalHours = logs.reduce((acc, l) => acc + (Number(l.hours) || 0), 0);
  const overallProgress = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Upcoming tasks (not Done, sorted by start date)
  const upcoming = [...tasks]
    .filter((t) => t.status !== "Done")
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  // Recent logs
  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  // Open meeting action items
  const openActions = meetings
    .filter((m) => m.status === "Open" && m.actionItem)
    .slice(0, 4);

  const getMemberInitials = (id: string) => {
    const m = getMember(id);
    return m ? m.initials : "??";
  };

  const getMemberColor = (id: string) => {
    const m = getMember(id);
    return m ? m.color : "#999";
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-5 mb-6 flex-wrap">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-thread mb-1.5 block font-bold">
            Course Launch — Live Hub
          </span>
          <h1 className="font-display font-bold text-[26px] text-ink leading-tight">
            Dashboard
          </h1>
          <p className="text-kraft text-[13.5px] mt-1.5 max-w-[60ch]">
            Everything the team is working on — tasks, meetings, and daily activity — in one connected view.
          </p>
        </div>
        <div>
          <button
            onClick={onAddTask}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 border border-thread rounded-[3px] text-[13px] font-semibold bg-thread hover:bg-[#A9531F] hover:border-[#A9531F] text-white transition-all shadow-[0_1px_2px_rgba(18,24,27,0.06)] cursor-pointer"
          >
            <Plus size={14} className="stroke-[2.5]" /> New task
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        <div className="bg-white border border-line rounded-[3px] p-3.5 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-spool">
          <div className="font-display text-[26px] font-bold text-ink leading-none">
            {overallProgress}%
          </div>
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-kraft mt-1.5 font-bold">
            Overall Progress · {doneTasks}/{totalTasks} done
          </div>
        </div>

        <div className="bg-white border border-line rounded-[3px] p-3.5 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-thread">
          <div className="font-display text-[26px] font-bold text-ink leading-none">
            {ongoingTasks}
          </div>
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-kraft mt-1.5 font-bold">
            Ongoing Tasks
          </div>
        </div>

        <div className="bg-white border border-line rounded-[3px] p-3.5 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-alert">
          <div className="font-display text-[26px] font-bold text-ink leading-none">
            {openMeetings}
          </div>
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-kraft mt-1.5 font-bold">
            Open Sync Actions
          </div>
        </div>

        <div className="bg-white border border-line rounded-[3px] p-3.5 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-kraft">
          <div className="font-display text-[26px] font-bold text-ink leading-none">
            {totalHours}h
          </div>
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-kraft mt-1.5 font-bold">
            Labor Hours Logged
          </div>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-5">
        {/* Left Side: Phases and Recent Labor Log */}
        <div className="flex flex-col gap-6">
          {/* Phase progress list */}
          <div>
            <h3 className="font-display font-bold text-[14px] uppercase tracking-wider text-ink mb-3">
              Phase progress
            </h3>
            <div className="flex flex-col gap-2">
              {phases.map((p) => {
                const pct = getPhaseProgress(p.id);
                const count = tasks.filter((t) => t.phase === p.id).length;
                return (
                  <button
                    key={p.id}
                    onClick={() => onNavigateToPhase(p.id)}
                    className="flex items-center gap-2.5 p-2.5 bg-white border border-line rounded-[3px] cursor-pointer hover:border-line-strong transition-colors text-left w-full"
                  >
                    <span
                      className="font-mono text-[10.5px] font-semibold text-white px-2 py-0.5 rounded-[2px] tracking-wide shrink-0"
                      style={{ backgroundColor: p.color }}
                    >
                      P{p.id}
                    </span>
                    <span className="text-[12.5px] font-semibold text-ink truncate max-w-[150px] sm:max-w-[280px]">
                      {p.name.replace(/^Phase \d+: /, "")}
                    </span>
                    <div className="flex-1 h-[5px] bg-paper-dim rounded-[3px] overflow-hidden min-w-[60px] mx-1">
                      <div
                        className="h-full rounded-[3px] transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: p.color }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-kraft shrink-0">
                      {count} tasks · {pct}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent labor / upload activities */}
          <div>
            <h3 className="font-display font-bold text-[14px] uppercase tracking-wider text-ink mb-3">
              Recent activity
            </h3>
            <div className="border border-line rounded-[3px] overflow-hidden bg-white">
              <table className="w-full border-collapse">
                <tbody>
                  {recentLogs.length ? (
                    recentLogs.map((l) => (
                      <tr
                        key={l.id}
                        className="border-b border-line last:border-b-0 hover:bg-paper-dim transition-colors"
                      >
                        <td className="font-mono text-[11.5px] text-kraft px-3 py-2.5 w-[90px] whitespace-nowrap">
                          {fmtDate(l.date)}
                        </td>
                        <td className="px-3 py-2.5 w-[140px]">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[8.5px] text-white font-mono font-bold shrink-0"
                              style={{ backgroundColor: getMemberColor(l.member) }}
                            >
                              {getMemberInitials(l.member)}
                            </span>
                            <span className="text-[12.5px] font-semibold text-ink truncate">
                              {getMember(l.member)?.name || l.member}
                            </span>
                          </div>
                        </td>
                        <td className="text-[12.5px] text-ink-soft px-3 py-2.5">
                          {l.task}
                        </td>
                        <td className="font-mono text-[12px] font-semibold text-ink px-3 py-2.5 text-right w-[60px] whitespace-nowrap">
                          {l.hours}h
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-5 text-center text-kraft text-[13px]">
                        No activity logged yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Up Next and Meeting Actions */}
        <div className="flex flex-col gap-6">
          {/* Up Next List */}
          <div>
            <h3 className="font-display font-bold text-[14px] uppercase tracking-wider text-ink mb-3">
              Up next
            </h3>
            <div className="flex flex-col gap-2">
              {upcoming.length ? (
                upcoming.map((t) => {
                  const phase = phases.find((p) => p.id === t.phase);
                  return (
                    <div
                      key={t.id}
                      onClick={() => onSelectTask(t.id)}
                      className="bg-white border border-line rounded-[3px] p-3.5 relative transition-all hover:border-line-strong hover:shadow-[0_1px_2px_rgba(18,24,27,0.06)] hover:-translate-y-[1px] cursor-pointer select-none"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span
                          className="font-mono text-[9.5px] text-white px-1.5 py-0.5 rounded-[2px] tracking-wide shrink-0"
                          style={{ backgroundColor: phase?.color || "#999" }}
                        >
                          P{t.phase}
                        </span>
                        <span className={`status-chip ${statusClass(t.status)}`}>
                          <span className="dot" />
                          {t.status}
                        </span>
                      </div>
                      <div className="text-[13.5px] font-semibold text-ink leading-snug mb-2.5">
                        {t.title}
                      </div>
                      <div className="flex items-center justify-between gap-2 text-kraft text-[10.5px] font-mono">
                        <span>
                          {fmtDate(t.start)} → {fmtDate(t.end)}
                        </span>
                        <div className="flex items-center">
                          <span className="text-white/40 text-[9px] mr-1">Collab:</span>
                          <div className="flex items-center">
                            {t.collaborators && t.collaborators.length ? (
                              t.collaborators.map((cId, idx) => (
                                <span
                                  key={cId}
                                  className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[7px] text-white font-mono font-bold border border-white -ml-1.5 first:ml-0"
                                  style={{ backgroundColor: getMemberColor(cId) }}
                                  title={getMember(cId)?.name}
                                >
                                  {getMemberInitials(cId)}
                                </span>
                              ))
                            ) : (
                              <span className="text-line-strong">—</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-kraft text-[12.5px] border-1.5 border-dashed border-line-strong rounded-[3px] bg-white">
                  Nothing scheduled.
                </div>
              )}
            </div>
          </div>

          {/* Open Meeting Action Items */}
          <div>
            <h3 className="font-display font-bold text-[14px] uppercase tracking-wider text-ink mb-3">
              Open action items
            </h3>
            <div className="flex flex-col gap-2">
              {openActions.length ? (
                openActions.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onSelectMeeting(m.id)}
                    className="bg-white border border-line rounded-[3px] p-3.5 transition-all hover:border-line-strong hover:shadow-[0_1px_2px_rgba(18,24,27,0.06)] cursor-pointer"
                  >
                    <div className="text-[13.5px] font-semibold text-ink leading-snug mb-2">
                      {m.actionItem}
                    </div>
                    <div className="flex items-center justify-between gap-2 text-kraft text-[10.5px] font-mono">
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> Due {fmtDate(m.deadline)}
                      </span>
                      {m.leader && (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[7px] text-white font-mono font-bold"
                            style={{ backgroundColor: getMemberColor(m.leader) }}
                          >
                            {getMemberInitials(m.leader)}
                          </span>
                          <span className="text-[11px] font-semibold text-ink">
                            {getMember(m.leader)?.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-kraft text-[12.5px] border-1.5 border-dashed border-line-strong rounded-[3px] bg-white">
                  No open action items — nice.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
