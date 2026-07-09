import React from "react";
import { Search, ChevronDown, ChevronRight, Inbox, Plus } from "lucide-react";
import { Member, Phase, Task, TaskStatus } from "../types";

interface TasksViewProps {
  members: Member[];
  phases: Phase[];
  tasks: Task[];
  onSelectTask: (id: string) => void;
  onAddTask: () => void;
  taskSearch: string;
  setTaskSearch: (q: string) => void;
  taskPhaseFilter: string;
  setTaskPhaseFilter: (val: string) => void;
  taskStatusFilter: string;
  setTaskStatusFilter: (val: string) => void;
  taskOwnerFilter: string;
  setTaskOwnerFilter: (val: string) => void;
  collapsedPhases: Record<number, boolean>;
  onTogglePhase: (id: number) => void;
}

export default function TasksView({
  members,
  phases,
  tasks,
  onSelectTask,
  onAddTask,
  taskSearch,
  setTaskSearch,
  taskPhaseFilter,
  setTaskPhaseFilter,
  taskStatusFilter,
  setTaskStatusFilter,
  taskOwnerFilter,
  setTaskOwnerFilter,
  collapsedPhases,
  onTogglePhase,
}: TasksViewProps) {
  // Helpers
  const getMember = (id: string) => members.find((m) => m.id === id);

  const getMemberInitials = (id: string) => {
    const m = getMember(id);
    return m ? m.initials : "??";
  };

  const getMemberColor = (id: string) => {
    const m = getMember(id);
    return m ? m.color : "#999";
  };

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

  // Filter logic
  const filtered = tasks.filter((t) => {
    if (taskPhaseFilter !== "all" && String(t.phase) !== taskPhaseFilter) return false;
    if (taskStatusFilter !== "all" && t.status !== taskStatusFilter) return false;
    if (taskOwnerFilter !== "all" && !(t.collaborators || []).includes(taskOwnerFilter)) return false;
    if (taskSearch) {
      const q = taskSearch.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.owner.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setTaskSearch("");
    setTaskPhaseFilter("all");
    setTaskStatusFilter("all");
    setTaskOwnerFilter("all");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-5 mb-6 flex-wrap">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-thread mb-1.5 block font-bold">
            Launch Plan
          </span>
          <h1 className="font-display font-bold text-[26px] text-ink leading-tight">
            Task Board
          </h1>
          <p className="text-kraft text-[13.5px] mt-1.5 max-w-[60ch]">
            All launch tasks, grouped by phase — from foundation & branding through post-launch iteration.
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

      {/* Toolbar */}
      <div className="flex items-center gap-2.5 flex-wrap mb-5 pb-4 border-b border-line">
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-white border border-line rounded-[3px] px-2.5 py-1.5 min-w-[200px] flex-1 max-w-[280px]">
          <Search size={14} className="text-kraft shrink-0 stroke-[2.2]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={taskSearch}
            onChange={(e) => setTaskSearch(e.target.value)}
            className="border-none bg-transparent outline-none text-[13px] w-full text-ink"
          />
        </div>

        {/* Phase Select */}
        <select
          value={taskPhaseFilter}
          onChange={(e) => setTaskPhaseFilter(e.target.value)}
          className="px-2.5 py-1.5 border border-line rounded-[3px] bg-white text-[12.5px] font-semibold text-ink outline-none cursor-pointer hover:border-line-strong"
        >
          <option value="all">All phases</option>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Status Select */}
        <select
          value={taskStatusFilter}
          onChange={(e) => setTaskStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 border border-line rounded-[3px] bg-white text-[12.5px] font-semibold text-ink outline-none cursor-pointer hover:border-line-strong"
        >
          <option value="all">All statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Done">Done</option>
          <option value="Blocked">Blocked</option>
        </select>

        {/* Collaborator Select */}
        <select
          value={taskOwnerFilter}
          onChange={(e) => setTaskOwnerFilter(e.target.value)}
          className="px-2.5 py-1.5 border border-line rounded-[3px] bg-white text-[12.5px] font-semibold text-ink outline-none cursor-pointer hover:border-line-strong"
        >
          <option value="all">Everyone</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <div className="flex-1" />
        <span className="font-mono text-[11.5px] text-kraft">
          {filtered.length} of {tasks.length} tasks
        </span>
      </div>

      {/* Main Task List Accordion */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 border-1.5 border-dashed border-line-strong rounded-[3px] bg-white">
          <Inbox size={36} className="text-line-strong mx-auto mb-3 stroke-[1.5]" />
          <div className="font-display font-bold text-[15px] mb-1">No tasks match your filters</div>
          <div className="text-[13px] text-kraft max-w-[36ch] mx-auto mb-4">
            Try clearing the search or filters, or create a new task.
          </div>
          <button
            onClick={clearFilters}
            className="px-3.5 py-2 border border-line-strong rounded-[3px] text-[13px] font-semibold bg-white hover:bg-paper-dim text-ink transition-all cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        phases.map((p) => {
          const phaseTasks = filtered.filter((t) => t.phase === p.id);
          const isCollapsed = collapsedPhases[p.id];
          const pct = getPhaseProgress(p.id);

          // Skip phase block if filters hide all tasks, EXCEPT if filter-by-phase is specifically set
          if (phaseTasks.length === 0 && taskPhaseFilter === "all" && (taskStatusFilter !== "all" || taskOwnerFilter !== "all" || taskSearch)) {
            return null;
          }

          return (
            <div key={p.id} className="mb-7 last:mb-0">
              <div
                onClick={() => onTogglePhase(p.id)}
                className="flex items-center gap-2.5 mb-3 cursor-pointer select-none"
              >
                {isCollapsed ? (
                  <ChevronRight size={14} className="text-kraft shrink-0" />
                ) : (
                  <ChevronDown size={14} className="text-kraft shrink-0" />
                )}
                <span
                  className="font-mono text-[10.5px] font-semibold text-white px-2 py-0.5 rounded-[2px] tracking-wide shrink-0"
                  style={{ backgroundColor: p.color }}
                >
                  P{p.id}
                </span>
                <span className="font-display font-bold text-[15.5px] text-ink">
                  {p.name.replace(/^Phase \d+: /, "")}
                </span>
                <div className="flex-1 max-w-[160px] h-[5px] bg-paper-dim rounded-[3px] overflow-hidden min-w-[60px]">
                  <div
                    className="h-full rounded-[3px]"
                    style={{ width: `${pct}%`, backgroundColor: p.color }}
                  />
                </div>
                <span className="font-mono text-[11px] text-kraft shrink-0">
                  {phaseTasks.length} tasks · {pct}%
                </span>
              </div>

              {!isCollapsed && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {phaseTasks.length ? (
                    phaseTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onSelectTask(t.id)}
                        className="bg-white border border-line rounded-[3px] p-3.5 relative transition-all hover:border-line-strong hover:shadow-[0_1px_2px_rgba(18,24,27,0.06)] hover:-translate-y-[1px] cursor-pointer select-none before:content-[''] before:absolute before:-left-[5px] before:top-1/2 before:-translate-y-1/2 before:w-2.5 before:h-2.5 before:bg-paper before:border before:border-line before:rounded-full"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2 pl-2">
                          <span className="font-mono text-[10.5px] text-kraft font-semibold">
                            {t.id} · {t.owner}
                          </span>
                          <span className={`status-chip ${statusClass(t.status)}`}>
                            <span className="dot" />
                            {t.status}
                          </span>
                        </div>
                        <div className="text-[13.5px] font-semibold text-ink leading-snug mb-3.5 pl-2">
                          {t.title}
                        </div>
                        <div className="flex items-center justify-between gap-2 pl-2">
                          <span className="font-mono text-[10.5px] text-kraft">
                            {fmtDate(t.start)} → {fmtDate(t.end)}{" "}
                            <span className="opacity-60">({t.duration}d)</span>
                          </span>
                          <div className="flex items-center">
                            {t.collaborators && t.collaborators.length > 0 ? (
                              t.collaborators.map((cId) => (
                                <span
                                  key={cId}
                                  className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[8.5px] text-white font-mono font-bold border border-white -ml-1.5 first:ml-0 shadow-[0_0_0_1.5px_rgba(255,255,255,1)]"
                                  style={{ backgroundColor: getMemberColor(cId) }}
                                  title={getMember(cId)?.name}
                                >
                                  {getMemberInitials(cId)}
                                </span>
                              ))
                            ) : (
                              <span className="text-kraft/40 text-[10.5px] font-mono">unassigned</span>
                            )}
                          </div>
                        </div>
                        {/* Tear line simulation */}
                        <div className="absolute bottom-[-1px] left-2.5 right-2.5 h-[1px] bg-[linear-gradient(to_right,var(--color-line)_50%,transparent_50%)] bg-[length:6px_1px]" />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full p-4 text-center text-kraft text-[12.5px] border-1.5 border-dashed border-line-strong rounded-[3px] bg-white">
                      No tasks in this phase.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
