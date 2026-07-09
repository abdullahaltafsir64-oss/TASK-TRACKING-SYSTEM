import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { Member, Phase, Task, Meeting, LogEntry, TaskStatus, MeetingStatus, LogStatus } from "../types";

interface ModalProps {
  type: "task" | "meeting" | "log";
  editingId: string | null;
  tasks: Task[];
  meetings: Meeting[];
  logs: LogEntry[];
  members: Member[];
  phases: Phase[];
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete: (id: string) => void;
}

export default function Modal({
  type,
  editingId,
  tasks,
  meetings,
  logs,
  members,
  phases,
  onClose,
  onSave,
  onDelete,
}: ModalProps) {
  // Task state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPhase, setTaskPhase] = useState(0);
  const [taskOwner, setTaskOwner] = useState("");
  const [taskStart, setTaskStart] = useState("");
  const [taskEnd, setTaskEnd] = useState("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("Not Started");
  const [taskCollab, setTaskCollab] = useState<string[]>([]);

  // Meeting state
  const [meetDate, setMeetDate] = useState("");
  const [meetStatus, setMeetStatus] = useState<MeetingStatus>("Open");
  const [meetAgenda, setMeetAgenda] = useState("");
  const [meetDiscussed, setMeetDiscussed] = useState("");
  const [meetAction, setMeetAction] = useState("");
  const [meetLeader, setMeetLeader] = useState("");
  const [meetDeadline, setMeetDeadline] = useState("");
  const [meetMembers, setMeetMembers] = useState<string[]>([]);

  // Log state
  const [logDate, setLogDate] = useState("");
  const [logMember, setLogMember] = useState("");
  const [logTask, setLogTask] = useState("");
  const [logHours, setLogHours] = useState<number | "">("");
  const [logUploads, setLogUploads] = useState<number>(0);
  const [logStatus, setLogStatus] = useState<LogStatus>("Completed");

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    if (type === "task") {
      if (editingId) {
        const t = tasks.find((item) => item.id === editingId);
        if (t) {
          setTaskTitle(t.title);
          setTaskPhase(t.phase);
          setTaskOwner(t.owner);
          setTaskStart(t.start);
          setTaskEnd(t.end);
          setTaskStatus(t.status);
          setTaskCollab(t.collaborators || []);
        }
      } else {
        setTaskTitle("");
        setTaskPhase(0);
        setTaskOwner("");
        setTaskStart(today);
        setTaskEnd(today);
        setTaskStatus("Not Started");
        setTaskCollab([]);
      }
    } else if (type === "meeting") {
      if (editingId) {
        const m = meetings.find((item) => item.id === editingId);
        if (m) {
          setMeetDate(m.date);
          setMeetStatus(m.status);
          setMeetAgenda(m.agenda);
          setMeetDiscussed(m.discussed);
          setMeetAction(m.actionItem);
          setMeetLeader(m.leader);
          setMeetDeadline(m.deadline);
          setMeetMembers(m.members || []);
        }
      } else {
        setMeetDate(today);
        setMeetStatus("Open");
        setMeetAgenda("");
        setMeetDiscussed("");
        setMeetAction("");
        setMeetLeader("");
        setMeetDeadline("");
        setMeetMembers([]);
      }
    } else if (type === "log") {
      if (editingId) {
        const l = logs.find((item) => item.id === editingId);
        if (l) {
          setLogDate(l.date);
          setLogMember(l.member);
          setLogTask(l.task);
          setLogHours(l.hours);
          setLogUploads(l.uploads);
          setLogStatus(l.status);
        }
      } else {
        setLogDate(today);
        setLogMember(members[0]?.id || "");
        setLogTask("");
        setLogHours("");
        setLogUploads(0);
        setLogStatus("Completed");
      }
    }
  }, [type, editingId, tasks, meetings, logs, members]);

  const handleSave = () => {
    if (type === "task") {
      if (!taskTitle.trim()) return alert("Task title is required");
      onSave({
        id: editingId || undefined,
        title: taskTitle.trim(),
        phase: Number(taskPhase),
        owner: taskOwner.trim() || "Unassigned",
        start: taskStart,
        end: taskEnd || taskStart,
        status: taskStatus,
        collaborators: taskCollab,
      });
    } else if (type === "meeting") {
      if (!meetAgenda.trim()) return alert("Agenda is required");
      onSave({
        id: editingId || undefined,
        date: meetDate,
        agenda: meetAgenda.trim(),
        discussed: meetDiscussed.trim(),
        actionItem: meetAction.trim(),
        leader: meetLeader,
        deadline: meetDeadline,
        members: meetMembers,
        status: meetStatus,
      });
    } else if (type === "log") {
      if (!logTask.trim()) return alert("Task description is required");
      onSave({
        id: editingId || undefined,
        date: logDate,
        member: logMember,
        task: logTask.trim(),
        hours: Number(logHours) || 0,
        uploads: Number(logUploads) || 0,
        status: logStatus,
      });
    }
  };

  const toggleCollaborator = (memberId: string) => {
    setTaskCollab((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const toggleMeetingMember = (memberId: string) => {
    setMeetMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-100 overflow-y-auto animate-[fadeIn_0.15s_ease]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[5px] w-full max-w-[560px] shadow-[0_8px_24px_rgba(18,24,27,0.14),0_2px_6px_rgba(18,24,27,0.08)] animate-[modalPop_0.16s_ease] mb-10">
        {/* Header */}
        <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-line">
          <h3 className="font-display font-bold text-[17px] text-ink">
            {editingId ? "Edit" : "New"}{" "}
            {type === "task" ? "Task" : type === "meeting" ? "Meeting Item" : "Activity Log"}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 grid place-items-center rounded-full text-kraft hover:bg-paper-dim hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-[22px] flex flex-col gap-3.5">
          {type === "task" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                  Task title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Record Module 3 walkthrough"
                  className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                    Phase
                  </label>
                  <select
                    value={taskPhase}
                    onChange={(e) => setTaskPhase(Number(e.target.value))}
                    className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                  >
                    {phases.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                    Owner / Role
                  </label>
                  <input
                    type="text"
                    value={taskOwner}
                    onChange={(e) => setTaskOwner(e.target.value)}
                    placeholder="e.g. Marketing, Founder"
                    className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={taskStart}
                    onChange={(e) => setTaskStart(e.target.value)}
                    className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                    End date
                  </label>
                  <input
                    type="date"
                    value={taskEnd}
                    onChange={(e) => setTaskEnd(e.target.value)}
                    className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                  Status
                </label>
                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                  className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Done">Done</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                  Assign Team Members
                </label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {members.map((m) => {
                    const isSelected = taskCollab.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleCollaborator(m.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-ink text-white border-ink"
                            : "bg-white text-kraft border-line hover:border-line-strong"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] text-white font-mono font-bold"
                          style={{ backgroundColor: m.color }}
                        >
                          {m.initials}
                        </span>
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {type === "meeting" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                    Date
                  </label>
                  <input
                    type="date"
                    value={meetDate}
                    onChange={(e) => setMeetDate(e.target.value)}
                    className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                    Status
                  </label>
                  <select
                    value={meetStatus}
                    onChange={(e) => setMeetStatus(e.target.value as MeetingStatus)}
                    className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                  >
                    <option value="Open">Open</option>
                    <option value="Continuous">Continuous</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                  Agenda
                </label>
                <input
                  type="text"
                  value={meetAgenda}
                  onChange={(e) => setMeetAgenda(e.target.value)}
                  placeholder="e.g. Platform selection"
                  className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                  Discussed points
                </label>
                <textarea
                  value={meetDiscussed}
                  onChange={(e) => setMeetDiscussed(e.target.value)}
                  placeholder="What was discussed..."
                  className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread min-height-[60px]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                  Action item
                </label>
                <textarea
                  value={meetAction}
                  onChange={(e) => setMeetAction(e.target.value)}
                  placeholder="What needs to happen next..."
                  className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread min-height-[60px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                    Task Leader
                  </label>
                  <select
                    value={meetLeader}
                    onChange={(e) => setMeetLeader(e.target.value)}
                    className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                  >
                    <option value="">— none —</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={meetDeadline}
                    onChange={(e) => setMeetDeadline(e.target.value)}
                    className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                  Team Members Involved
                </label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {members.map((m) => {
                    const isSelected = meetMembers.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleMeetingMember(m.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-ink text-white border-ink"
                            : "bg-white text-kraft border-line hover:border-line-strong"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] text-white font-mono font-bold"
                          style={{ backgroundColor: m.color }}
                        >
                          {m.initials}
                        </span>
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {type === "log" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                    Date
                  </label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                    Team Member
                  </label>
                  <select
                    value={logMember}
                    onChange={(e) => setLogMember(e.target.value)}
                    className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                  Task description
                </label>
                <textarea
                  value={logTask}
                  onChange={(e) => setLogTask(e.target.value)}
                  placeholder="What did they work on..."
                  className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread min-height-[60px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                    Hours contributed
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={logHours}
                    onChange={(e) => setLogHours(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="1.5"
                    className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                    Videos / Shorts Uploaded
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={logUploads}
                    onChange={(e) => setLogUploads(Number(e.target.value))}
                    placeholder="0"
                    className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10.5px] uppercase tracking-wider text-kraft font-semibold">
                  Status
                </label>
                <select
                  value={logStatus}
                  onChange={(e) => setLogStatus(e.target.value as LogStatus)}
                  className="px-2.5 py-2 border border-line rounded-[3px] text-[13.5px] text-ink bg-white outline-none focus:border-thread"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-[22px] py-4 border-t border-line">
          {editingId && (
            <button
              onClick={() => onDelete(editingId)}
              className="flex items-center gap-1.5 text-xs text-alert font-bold hover:underline py-1 px-2 mr-auto"
            >
              <Trash2 size={13} /> Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-line-strong rounded-[3px] text-[13px] font-semibold bg-white hover:bg-paper-dim text-ink transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-thread rounded-[3px] text-[13px] font-semibold bg-thread hover:bg-[#A9531F] hover:border-[#A9531F] text-white transition-all"
          >
            {editingId ? "Save changes" : type === "task" ? "Create task" : type === "meeting" ? "Log item" : "Log activity"}
          </button>
        </div>
      </div>
    </div>
  );
}
