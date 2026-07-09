import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Member, Phase, Task, Meeting, LogEntry, AppState } from "./types";
import {
  SEED_MEMBERS,
  SEED_PHASES,
  SEED_TASKS,
  SEED_MEETINGS,
  SEED_LOGS,
} from "./data";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import TasksView from "./components/TasksView";
import TimelineView from "./components/TimelineView";
import MeetingsView from "./components/MeetingsView";
import LogsView from "./components/LogsView";
import TeamView from "./components/TeamView";
import Modal from "./components/Modal";

const STORAGE_KEY = "aog_hub_v1";

// Helper: Calculate duration between dates
const calculateDuration = (start: string, end: string) => {
  if (!start) return 1;
  const d1 = new Date(start + "T00:00:00");
  const d2 = new Date((end || start) + "T00:00:00");
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 1;
  const diff = Math.round((d2.getTime() - d1.getTime()) / 86400000);
  return Math.max(1, diff + 1);
};

export default function App() {
  // 1. Core State
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS);
  const [phases, setPhases] = useState<Phase[]>(SEED_PHASES);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // 2. UI State
  const [currentRoute, setCurrentRoute] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Filters State
  const [taskSearch, setTaskSearch] = useState("");
  const [taskPhaseFilter, setTaskPhaseFilter] = useState("all");
  const [taskStatusFilter, setTaskStatusFilter] = useState("all");
  const [taskOwnerFilter, setTaskOwnerFilter] = useState("all");
  const [collapsedPhases, setCollapsedPhases] = useState<Record<number, boolean>>({});

  // Modal State
  const [modalType, setModalType] = useState<"task" | "meeting" | "log" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 3. Load state on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        if (parsed.tasks && parsed.meetings && parsed.logs) {
          setMembers(parsed.members || SEED_MEMBERS);
          setPhases(parsed.phases || SEED_PHASES);
          setTasks(parsed.tasks);
          setMeetings(parsed.meetings);
          setLogs(parsed.logs);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not parse saved storage state. Using seeds.", e);
    }
    // Fallback to seed data
    setTasks(SEED_TASKS);
    setMeetings(SEED_MEETINGS);
    setLogs(SEED_LOGS);
  }, []);

  // 4. Save state helper
  const saveToLocalStorage = (
    updatedTasks: Task[],
    updatedMeetings: Meeting[],
    updatedLogs: LogEntry[]
  ) => {
    const payload: AppState = {
      members,
      phases,
      tasks: updatedTasks,
      meetings: updatedMeetings,
      logs: updatedLogs,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  // Helper to trigger toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // 5. Actions / Handlers
  const handleSaveModalData = (data: any) => {
    if (modalType === "task") {
      let updated: Task[];
      if (editingId) {
        // Edit
        updated = tasks.map((t) =>
          t.id === editingId
            ? {
                ...t,
                ...data,
                duration: calculateDuration(data.start, data.end),
              }
            : t
        );
        triggerToast("Task updated successfully");
      } else {
        // New
        const newId = "T-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        const newTask: Task = {
          ...data,
          id: newId,
          duration: calculateDuration(data.start, data.end),
        };
        updated = [...tasks, newTask];
        triggerToast("New task created");
      }
      setTasks(updated);
      saveToLocalStorage(updated, meetings, logs);
    } else if (modalType === "meeting") {
      let updated: Meeting[];
      if (editingId) {
        updated = meetings.map((m) => (m.id === editingId ? { ...m, ...data } : m));
        triggerToast("Meeting item updated");
      } else {
        const newId = "M-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        const newMeeting: Meeting = {
          ...data,
          id: newId,
        };
        updated = [...meetings, newMeeting];
        triggerToast("Meeting item logged");
      }
      setMeetings(updated);
      saveToLocalStorage(tasks, updated, logs);
    } else if (modalType === "log") {
      let updated: LogEntry[];
      if (editingId) {
        updated = logs.map((l) => (l.id === editingId ? { ...l, ...data } : l));
        triggerToast("Activity log updated");
      } else {
        const newId = "L-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        const newLog: LogEntry = {
          ...data,
          id: newId,
        };
        updated = [...logs, newLog];
        triggerToast("Daily activity logged");
      }
      setLogs(updated);
      saveToLocalStorage(tasks, meetings, updated);
    }

    setModalType(null);
    setEditingId(null);
  };

  const handleDeleteItem = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item? This action is irreversible.")) {
      return;
    }

    if (modalType === "task") {
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      saveToLocalStorage(updated, meetings, logs);
      triggerToast("Task deleted");
    } else if (modalType === "meeting") {
      const updated = meetings.filter((m) => m.id !== id);
      setMeetings(updated);
      saveToLocalStorage(tasks, updated, logs);
      triggerToast("Meeting item deleted");
    } else if (modalType === "log") {
      const updated = logs.filter((l) => l.id !== id);
      setLogs(updated);
      saveToLocalStorage(tasks, meetings, updated);
      triggerToast("Activity log deleted");
    }

    setModalType(null);
    setEditingId(null);
  };

  // Toggle phase collapse helper
  const handleTogglePhase = (phaseId: number) => {
    setCollapsedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  // Navigate to pre-filtered phase
  const handleNavigateToPhase = (phaseId: number) => {
    setTaskPhaseFilter(String(phaseId));
    setCurrentRoute("tasks");
  };

  return (
    <div className="bg-paper min-h-screen text-ink antialiased selection:bg-thread selection:text-paper">
      {/* Mobile Topbar */}
      <div className="flex md:hidden items-center justify-between bg-ink p-3.5 sticky top-0 z-40 shadow-md">
        <button
          onClick={() => setMobileNavOpen(true)}
          className="text-paper hover:text-thread transition-colors"
        >
          <Menu size={22} />
        </button>
        <span className="font-display font-bold text-[15.5px] text-paper">
          Apparel Ops Global — Hub
        </span>
        <div className="w-5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-screen">
        {/* Sidebar */}
        <Sidebar
          currentRoute={currentRoute}
          onNavigate={setCurrentRoute}
          tasks={tasks}
          meetings={meetings}
          logs={logs}
          members={members}
          isOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />

        {/* Main Workspace Area */}
        <main className="p-4 sm:p-7 lg:p-9 max-w-[1280px] w-full mx-auto overflow-hidden">
          {currentRoute === "dashboard" && (
            <DashboardView
              members={members}
              phases={phases}
              tasks={tasks}
              meetings={meetings}
              logs={logs}
              onAddTask={() => {
                setModalType("task");
                setEditingId(null);
              }}
              onSelectTask={(id) => {
                setModalType("task");
                setEditingId(id);
              }}
              onSelectMeeting={(id) => {
                setModalType("meeting");
                setEditingId(id);
              }}
              onNavigateToPhase={handleNavigateToPhase}
            />
          )}

          {currentRoute === "tasks" && (
            <TasksView
              members={members}
              phases={phases}
              tasks={tasks}
              onSelectTask={(id) => {
                setModalType("task");
                setEditingId(id);
              }}
              onAddTask={() => {
                setModalType("task");
                setEditingId(null);
              }}
              taskSearch={taskSearch}
              setTaskSearch={setTaskSearch}
              taskPhaseFilter={taskPhaseFilter}
              setTaskPhaseFilter={setTaskPhaseFilter}
              taskStatusFilter={taskStatusFilter}
              setTaskStatusFilter={setTaskStatusFilter}
              taskOwnerFilter={taskOwnerFilter}
              setTaskOwnerFilter={setTaskOwnerFilter}
              collapsedPhases={collapsedPhases}
              onTogglePhase={handleTogglePhase}
            />
          )}

          {currentRoute === "gantt" && (
            <TimelineView
              members={members}
              phases={phases}
              tasks={tasks}
              onSelectTask={(id) => {
                setModalType("task");
                setEditingId(id);
              }}
            />
          )}

          {currentRoute === "meetings" && (
            <MeetingsView
              members={members}
              meetings={meetings}
              onSelectMeeting={(id) => {
                setModalType("meeting");
                setEditingId(id);
              }}
              onAddMeeting={() => {
                setModalType("meeting");
                setEditingId(null);
              }}
            />
          )}

          {currentRoute === "logs" && (
            <LogsView
              members={members}
              logs={logs}
              onSelectLog={(id) => {
                setModalType("log");
                setEditingId(id);
              }}
              onAddLog={() => {
                setModalType("log");
                setEditingId(null);
              }}
            />
          )}

          {currentRoute === "team" && (
            <TeamView members={members} tasks={tasks} meetings={meetings} logs={logs} />
          )}
        </main>
      </div>

      {/* Persistent Overlay Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-ink text-paper px-4.5 py-3.5 rounded-[3px] text-[13px] font-semibold flex items-center gap-2 shadow-[0_8px_24px_rgba(18,24,27,0.14)] z-200 animate-[toastIn_0.2s_ease]">
          <span className="w-1.5 h-1.5 rounded-full bg-spool" />
          {toastMessage}
        </div>
      )}

      {/* Task, Meeting or Log Modal */}
      {modalType && (
        <Modal
          type={modalType}
          editingId={editingId}
          tasks={tasks}
          meetings={meetings}
          logs={logs}
          members={members}
          phases={phases}
          onClose={() => {
            setModalType(null);
            setEditingId(null);
          }}
          onSave={handleSaveModalData}
          onDelete={handleDeleteItem}
        />
      )}
    </div>
  );
}
