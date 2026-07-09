import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarRange,
  Video,
  Clock,
  Users
} from "lucide-react";
import { Member, Task, Meeting, LogEntry } from "../types";

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  tasks: Task[];
  meetings: Meeting[];
  logs: LogEntry[];
  members: Member[];
  isOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  currentRoute,
  onNavigate,
  tasks,
  meetings,
  logs,
  members,
  isOpen,
  onCloseMobile,
}: SidebarProps) {
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, count: null },
    { key: "tasks", label: "Task Board", icon: CheckSquare, count: tasks.length },
    { key: "gantt", label: "Timeline", icon: CalendarRange, count: null },
    { key: "meetings", label: "Meetings", icon: Video, count: meetings.length },
    { key: "logs", label: "Activity Log", icon: Clock, count: logs.length },
    { key: "team", label: "Team", icon: Users, count: members.length },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay if open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 bg-ink text-paper p-[22px] flex flex-col gap-7 z-50 w-[240px] transform transition-transform duration-200 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-[34px] h-[34px] bg-thread rounded-[3px] grid place-items-center text-ink font-display font-bold text-[15px] relative shrink-0">
            AO
            <div className="absolute inset-[4px] border border-dashed border-ink/35 rounded-[2px]" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display font-bold text-[15.5px] text-paper">
              Apparel Ops Global
            </span>
            <span className="font-mono text-[10px] text-kraft uppercase tracking-[0.08em] mt-0.5">
              Ops Hub
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 px-2.5 py-1.5 font-bold">
            Workspace
          </span>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentRoute === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  onCloseMobile();
                }}
                className={`flex items-center gap-2.5 p-2.5 rounded-[3px] text-[13.5px] font-semibold text-left transition-all w-full relative ${
                  isActive
                    ? "bg-thread/15 text-paper font-semibold"
                    : "bg-transparent text-white/75 hover:bg-white/5 hover:text-paper"
                }`}
              >
                {isActive && (
                  <div className="absolute left-[-22px] top-2 bottom-2 w-[3px] bg-thread rounded-r-[2px]" />
                )}
                <IconComponent size={16} className="opacity-90 shrink-0" />
                <span>{item.label}</span>
                {item.count !== null && (
                  <span className="ml-auto font-mono text-[10.5px] text-white/45 bg-white/8 px-1.5 py-0.5 rounded-[8px]">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-2">
          <div className="font-mono text-[10.5px] text-white/50 flex items-center gap-2 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-spool shrink-0 animate-pulse" />
            <span>Local Database Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}
