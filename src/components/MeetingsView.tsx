import React from "react";
import { Plus, Clock, Inbox } from "lucide-react";
import { Member, Meeting, MeetingStatus } from "../types";

interface MeetingsViewProps {
  members: Member[];
  meetings: Meeting[];
  onSelectMeeting: (id: string) => void;
  onAddMeeting: () => void;
}

export default function MeetingsView({
  members,
  meetings,
  onSelectMeeting,
  onAddMeeting,
}: MeetingsViewProps) {
  // Sort meetings: latest meetings first
  const sorted = [...meetings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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

  const fmtDateFull = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const statusClass = (status: string) => {
    return "status-" + String(status || "open").toLowerCase().replace(/\s+/g, "");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-5 mb-6 flex-wrap">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-thread mb-1.5 block font-bold">
            Weekly Sync — Tuesdays 10:00–11:30 PM
          </span>
          <h1 className="font-display font-bold text-[26px] text-ink leading-tight">
            Meetings
          </h1>
          <p className="text-kraft text-[13.5px] mt-1.5 max-w-[60ch]">
            Agenda items, discussion notes, and action items from weekly project checkpoints.
          </p>
        </div>
        <div>
          <button
            onClick={onAddMeeting}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 border border-thread rounded-[3px] text-[13px] font-semibold bg-thread hover:bg-[#A9531F] hover:border-[#A9531F] text-white transition-all shadow-[0_1px_2px_rgba(18,24,27,0.06)] cursor-pointer"
          >
            <Plus size={14} className="stroke-[2.5]" /> Log meeting item
          </button>
        </div>
      </div>

      {/* Meetings List */}
      <div className="flex flex-col gap-4">
        {sorted.length ? (
          sorted.map((m) => (
            <div
              key={m.id}
              onClick={() => onSelectMeeting(m.id)}
              className="bg-white border border-line border-l-3 border-l-thread rounded-[3px] p-4.5 transition-shadow hover:shadow-[0_1px_2px_rgba(18,24,27,0.06)] cursor-pointer select-none"
            >
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap sm:flex-nowrap">
                <div>
                  <div className="font-mono text-[11px] text-kraft mb-0.5 font-bold">
                    {fmtDateFull(m.date)}
                  </div>
                  <div className="font-display font-bold text-[16px] text-ink">
                    {m.agenda}
                  </div>
                </div>
                <span className={`status-chip ${statusClass(m.status)} self-start shrink-0`}>
                  <span className="dot" />
                  {m.status || "Open"}
                </span>
              </div>

              {m.discussed && (
                <div className="text-[13px] text-ink-soft leading-relaxed my-2">
                  {m.discussed}
                </div>
              )}

              {m.actionItem && (
                <div className="bg-paper-dim rounded-[2px] p-2.5 my-2 border-l-2 border-l-kraft text-[12.5px] text-ink">
                  <div className="font-mono text-[9.5px] uppercase tracking-wider text-kraft font-bold mb-0.5">
                    Action item
                  </div>
                  {m.actionItem}
                </div>
              )}

              <div className="flex items-center justify-between gap-2.5 mt-3 flex-wrap text-kraft text-[11.5px]">
                <div className="flex items-center gap-2.5">
                  {m.leader && (
                    <div className="flex items-center gap-1.5">
                      <span className="opacity-75">Leader:</span>
                      <span
                        className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[8.5px] text-white font-mono font-bold"
                        style={{ backgroundColor: getMemberColor(m.leader) }}
                      >
                        {getMemberInitials(m.leader)}
                      </span>
                      <span className="font-semibold text-ink">
                        {getMember(m.leader)?.name}
                      </span>
                    </div>
                  )}

                  {m.members && m.members.length > 0 && (
                    <div className="flex items-center gap-1.5 ml-2.5">
                      <span className="opacity-75">Team:</span>
                      <div className="flex items-center">
                        {m.members.map((cId) => (
                          <span
                            key={cId}
                            className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[8.5px] text-white font-mono font-bold border border-white -ml-1.5 first:ml-0"
                            style={{ backgroundColor: getMemberColor(cId) }}
                            title={getMember(cId)?.name}
                          >
                            {getMemberInitials(cId)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {m.deadline && (
                  <span className="flex items-center gap-1 font-mono text-[10.5px]">
                    <Clock size={12} /> Due {fmtDate(m.deadline)}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border-1.5 border-dashed border-line-strong rounded-[3px] bg-white">
            <Inbox size={36} className="text-line-strong mx-auto mb-3 stroke-[1.5]" />
            <div className="font-display font-bold text-[15px] mb-1">No meetings logged</div>
            <div className="text-[13px] text-kraft max-w-[36ch] mx-auto mb-4">
              Log your first agenda item or action from a team sync.
            </div>
            <button
              onClick={onAddMeeting}
              className="px-3.5 py-2 border border-line-strong rounded-[3px] text-[13px] font-semibold bg-white hover:bg-paper-dim text-ink transition-all cursor-pointer"
            >
              Log meeting item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
