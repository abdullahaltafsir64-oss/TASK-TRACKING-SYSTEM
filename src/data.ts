import { Member, Phase, Task, Meeting, LogEntry } from "./types";

export const SEED_MEMBERS: Member[] = [
  { id: "muslim",  name: "Muslim",  color: "#C4622D", initials: "MU" },
  { id: "kollol",  name: "Kollol",  color: "#2D5F4C", initials: "KO" },
  { id: "tafsir",  name: "Tafsir",  color: "#3E5C76", initials: "TA" },
  { id: "saklain", name: "Saklain", color: "#8B5E3C", initials: "SA" },
  { id: "parvez",  name: "Parvez",  color: "#6B4C7A", initials: "PA" },
];

export const SEED_PHASES: Phase[] = [
  { id: 0, name: "Phase 0: Foundation & Branding",   color: "#8B7355" },
  { id: 1, name: "Phase 1: Digital Presence Setup",  color: "#3E5C76" },
  { id: 2, name: "Phase 2: Content & Platform Production", color: "#C4622D" },
  { id: 3, name: "Phase 3: Pre-Launch Marketing",    color: "#2D5F4C" },
  { id: 4, name: "Phase 4: Launch",                  color: "#B0413E" },
  { id: 5, name: "Phase 5: Post-Launch",              color: "#6B4C7A" },
];

export const SEED_TASKS: Task[] = [
  { id: "T1",  phase: 0, title: "Finalize brand identity (logo, colors, tagline usage)", owner: "Founder", start: "2026-07-06", end: "2026-07-08", duration: 3, status: "Not Started", collaborators: ["muslim","kollol","saklain"] },
  { id: "T2",  phase: 0, title: "Register trade license / business (TIN, bank account)", owner: "Founder", start: "2026-07-06", end: "2026-07-17", duration: 12, status: "Not Started", collaborators: ["saklain"] },
  { id: "T3",  phase: 0, title: "Buy domain name + matching social handles", owner: "Founder", start: "2026-07-06", end: "2026-07-06", duration: 1, status: "Not Started", collaborators: ["muslim","tafsir"] },
  { id: "T4",  phase: 0, title: "Set up professional email (Google Workspace)", owner: "Founder", start: "2026-07-07", end: "2026-07-07", duration: 1, status: "Not Started", collaborators: ["muslim","tafsir"] },
  { id: "T5",  phase: 0, title: "Finalize curriculum outline, pricing & batch size", owner: "Founder", start: "2026-07-06", end: "2026-07-12", duration: 7, status: "Ongoing", collaborators: [] },
  { id: "T6",  phase: 1, title: "Create Facebook Page", owner: "Marketing", start: "2026-07-13", end: "2026-07-13", duration: 1, status: "Done", collaborators: ["muslim"] },
  { id: "T7",  phase: 1, title: "Create LinkedIn Company Page", owner: "Marketing", start: "2026-07-13", end: "2026-07-13", duration: 1, status: "Done", collaborators: ["muslim"] },
  { id: "T8",  phase: 1, title: "Create YouTube channel + Instagram (optional)", owner: "Marketing", start: "2026-07-14", end: "2026-07-14", duration: 1, status: "Done", collaborators: ["muslim"] },
  { id: "T9",  phase: 1, title: "Set up WhatsApp Business number", owner: "Marketing", start: "2026-07-14", end: "2026-07-14", duration: 1, status: "Not Started", collaborators: ["saklain"] },
  { id: "T10", phase: 1, title: "Build landing page / simple website", owner: "Web", start: "2026-07-13", end: "2026-08-02", duration: 21, status: "Not Started", collaborators: ["tafsir"] },
  { id: "T11", phase: 2, title: "Choose LMS platform (Classroom / Teachable)", owner: "Founder", start: "2026-07-20", end: "2026-07-22", duration: 3, status: "Not Started", collaborators: ["tafsir"] },
  { id: "T12", phase: 2, title: "Set up payment gateway (bKash / Nagad / SSLCommerz)", owner: "Founder", start: "2026-07-20", end: "2026-07-26", duration: 7, status: "Not Started", collaborators: [] },
  { id: "T13", phase: 2, title: "Record Modules 1-3 (Work Study, Lean, TPM)", owner: "Instructor", start: "2026-07-20", end: "2026-08-02", duration: 14, status: "Not Started", collaborators: ["saklain","tafsir"] },
  { id: "T14", phase: 2, title: "Record Modules 4-7 (DMAIC, Costing, Digital, Compliance)", owner: "Instructor", start: "2026-08-03", end: "2026-08-16", duration: 14, status: "Not Started", collaborators: ["saklain","tafsir"] },
  { id: "T15", phase: 2, title: "Create slides, workbooks & quizzes", owner: "Instructor", start: "2026-07-20", end: "2026-08-16", duration: 28, status: "Not Started", collaborators: ["saklain","tafsir"] },
  { id: "T16", phase: 2, title: "QA / test full course platform end-to-end", owner: "Founder", start: "2026-08-17", end: "2026-08-19", duration: 3, status: "Not Started", collaborators: ["tafsir"] },
  { id: "T17", phase: 3, title: "Start organic content posting (2-3x/week)", owner: "Marketing", start: "2026-07-13", end: "2026-08-23", duration: 42, status: "Not Started", collaborators: [] },
  { id: "T18", phase: 3, title: "Build waitlist (form + WhatsApp/email capture)", owner: "Marketing", start: "2026-07-27", end: "2026-08-23", duration: 28, status: "Not Started", collaborators: [] },
  { id: "T19", phase: 3, title: "Produce teaser / trailer video", owner: "Marketing", start: "2026-08-10", end: "2026-08-16", duration: 7, status: "Not Started", collaborators: [] },
  { id: "T20", phase: 3, title: "Open early-bird registration", owner: "Marketing", start: "2026-08-17", end: "2026-08-23", duration: 7, status: "Not Started", collaborators: [] },
  { id: "T21", phase: 3, title: "Outreach to factories/HR for referrals & partnerships", owner: "Founder", start: "2026-08-03", end: "2026-08-23", duration: 21, status: "Not Started", collaborators: [] },
  { id: "T22", phase: 4, title: "Official launch campaign (paid ads + announcement)", owner: "Marketing", start: "2026-08-24", end: "2026-08-27", duration: 4, status: "Not Started", collaborators: ["tafsir"] },
  { id: "T23", phase: 4, title: "Open full enrollment", owner: "Marketing", start: "2026-08-24", end: "2026-08-30", duration: 7, status: "Not Started", collaborators: [] },
  { id: "T24", phase: 4, title: "First live batch starts", owner: "Instructor", start: "2026-08-31", end: "2026-08-31", duration: 1, status: "Not Started", collaborators: [] },
  { id: "T25", phase: 5, title: "Collect feedback & testimonials mid-course", owner: "Founder", start: "2026-09-07", end: "2026-09-13", duration: 7, status: "Not Started", collaborators: ["saklain"] },
  { id: "T26", phase: 5, title: "Iterate curriculum/content based on feedback", owner: "Instructor", start: "2026-09-14", end: "2026-09-20", duration: 7, status: "Not Started", collaborators: [] },
  { id: "T27", phase: 5, title: "Plan Batch 2 marketing & pricing review", owner: "Founder", start: "2026-09-21", end: "2026-09-27", duration: 7, status: "Not Started", collaborators: ["saklain"] },
];

export const SEED_MEETINGS: Meeting[] = [
  { id: "M1", date: "2026-07-07", agenda: "Google Meet/ Teams/ Zoom", discussed: "User friendliness, cost", actionItem: "Through a perfect analysis select the best platform for us", leader: "tafsir", members: [], deadline: "2026-07-10", status: "Open" },
  { id: "M2", date: "2026-07-07", agenda: "Two platform", discussed: "", actionItem: "AI analysis on keeping AOG", leader: "kollol", members: [], deadline: "2026-07-10", status: "Open" },
  { id: "M3", date: "2026-07-07", agenda: "Engagement Consistency", discussed: "", actionItem: "Everyone will follow it", leader: "", members: ["muslim","kollol","tafsir","saklain","parvez"], deadline: "", status: "Continuous" },
  { id: "M4", date: "2026-07-07", agenda: "Free Content Creation", discussed: "Submit idea from everyone which will be filtered by Muslim & Kollol", actionItem: "", leader: "muslim", members: ["muslim","kollol","tafsir","saklain","parvez"], deadline: "2026-07-11", status: "Open" },
  { id: "M5", date: "2026-07-07", agenda: "Apparel_Ops_Global_Launch_Plan", discussed: "Put your name and comment if required for every task", actionItem: "", leader: "", members: ["muslim","kollol","tafsir","saklain","parvez"], deadline: "2026-07-09", status: "Open" },
  { id: "M6", date: "2026-07-07", agenda: "Course launch", discussed: "For fresh and officer level", actionItem: "", leader: "", members: [], deadline: "2026-07-14", status: "Open" },
  { id: "M7", date: "2026-07-07", agenda: "Weekly meeting", discussed: "Tuesday from 10:00 pm to 11:30 pm", actionItem: "", leader: "", members: [], deadline: "", status: "Continuous" },
];

export const SEED_LOGS: LogEntry[] = [
  { id: "L1", date: "2026-07-06", member: "muslim", hours: 1.5, uploads: 0, task: "Reviewed documents from team mates, misc communication and prepared the engagement tracker.", status: "Completed" },
  { id: "L2", date: "2026-07-07", member: "muslim", hours: 1.5, uploads: 0, task: "Common meeting", status: "Completed" },
  { id: "L3", date: "2026-07-07", member: "kollol", hours: 1.5, uploads: 0, task: "Common meeting", status: "Completed" },
  { id: "L4", date: "2026-07-07", member: "tafsir", hours: 1.5, uploads: 0, task: "Common meeting", status: "Completed" },
  { id: "L5", date: "2026-07-07", member: "saklain", hours: 1.5, uploads: 0, task: "Common meeting", status: "Completed" },
  { id: "L6", date: "2026-07-07", member: "parvez", hours: 1.5, uploads: 0, task: "Common meeting", status: "Completed" },
  { id: "L7", date: "2026-07-08", member: "muslim", hours: 0.5, uploads: 1, task: "Uploading content in The SmartIE Edge, YT, FB, LI, WA", status: "In Progress" },
  { id: "L8", date: "2026-07-08", member: "tafsir", hours: 1, uploads: 0, task: "Online platform selection analysis for live classes", status: "Completed" },
  { id: "L9", date: "2026-07-08", member: "tafsir", hours: 1.5, uploads: 0, task: "Brainstorm & try to create a course outline for online posting", status: "Completed" },
];
