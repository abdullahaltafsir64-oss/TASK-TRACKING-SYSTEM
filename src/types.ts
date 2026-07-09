export interface Member {
  id: string;
  name: string;
  color: string;
  initials: string;
}

export interface Phase {
  id: number;
  name: string;
  color: string;
}

export type TaskStatus = "Not Started" | "Ongoing" | "Done" | "Blocked";

export interface Task {
  id: string;
  phase: number;
  title: string;
  owner: string;
  start: string;
  end: string;
  duration: number;
  status: TaskStatus;
  collaborators: string[];
}

export type MeetingStatus = "Open" | "Continuous" | "Closed";

export interface Meeting {
  id: string;
  date: string;
  agenda: string;
  discussed: string;
  actionItem: string;
  leader: string;
  members: string[];
  deadline: string;
  status: MeetingStatus;
}

export type LogStatus = "Completed" | "In Progress" | "Blocked";

export interface LogEntry {
  id: string;
  date: string;
  member: string;
  hours: number;
  uploads: number;
  task: string;
  status: LogStatus;
}

export interface AppState {
  members: Member[];
  phases: Phase[];
  tasks: Task[];
  meetings: Meeting[];
  logs: LogEntry[];
}
