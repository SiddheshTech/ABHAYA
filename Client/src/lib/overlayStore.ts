import { create } from "zustand";

export interface Message {
  id: string;
  sender: string;
  role: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  sent?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: "Critical" | "Warning" | "Info" | "Success";
  timestamp: string;
  read: boolean;
}

interface OverlayState {
  isMailOpen: boolean;
  isNotificationsOpen: boolean;
  setMailOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  messages: Message[];
  notifications: Notification[];
  addMessage: (sender: string, role: string, subject: string, content: string) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (title: string, message: string, severity: Notification["severity"]) => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  isMailOpen: false,
  isNotificationsOpen: false,
  setMailOpen: (open) => set({ isMailOpen: open }),
  setNotificationsOpen: (open) => set({ isNotificationsOpen: open }),
  
  messages: [
    {
      id: "MSG-001",
      sender: "Ministry of Women & Child Development",
      role: "Central Admin Authority",
      subject: "National Biometric Database Re-indexing Directives",
      content: "All state-level units and Child Protection Officers are requested to re-index their active photographic caches. The Abhaya Neural Ecosystem v4.2 weight configurations have been updated. Ensure compatibility for facial matching layers by running full local index updates.",
      timestamp: "Today, 10:30 AM",
      read: false,
    },
    {
      id: "MSG-002",
      sender: "Inspector Kavita Rao",
      role: "Child Welfare Officer (CRC)",
      subject: "Transition Verification Plan for Aarav Sharma (REC-9481)",
      content: "Following the biometric match near the Indore railway sleepers corridor, Case REC-9481 (Aarav Sharma) has been safely transferred to Pune Rescue Hub. Medical status and shelter logs are fully updated on-chain in the Rakshak Ledger.",
      timestamp: "Today, 11:45 AM",
      read: false,
    },
    {
      id: "MSG-003",
      sender: "Dr. Smith Kadam",
      role: "Director of Forensic Lab",
      subject: "Neural Matching Hit Rate Optimization Complete",
      content: "Excellent news. The newly synchronized railway ticketing database has improved our facial duplicate reconstruction match threshold to 99.8%. Dynamic cluster tracking will now match missing records with significantly reduced false positive rates.",
      timestamp: "Yesterday, 04:15 PM",
      read: true,
    },
    {
      id: "MSG-004",
      sender: "National Child Protection Agency",
      role: "Compliance & Audits Team",
      subject: "Urgent Compliance Certification Review",
      content: "We have finalized our access control audit logs for NGO nodes. The Sankalp Safe Shelter Mission (ORG-308) has shown outstanding data privacy rating (100% compliance). Please review and sign off on the monthly cryptographic ledger report.",
      timestamp: "Yesterday, 02:00 PM",
      read: true,
    }
  ],

  notifications: [
    {
      id: "NOT-001",
      title: "RED ALERT: Biometric Match",
      message: "Indore junction transit sensors flagged facial matching profile for child Aarav Sharma (REC-9481) with 94.2% match rating.",
      severity: "Critical",
      timestamp: "Just now",
      read: false,
    },
    {
      id: "NOT-002",
      title: "SYSTEM UPDATE",
      message: "Neural classification pipelines retrained. Epoch 100/100 complete for Identity & Network engines.",
      severity: "Success",
      timestamp: "35 min ago",
      read: false,
    },
    {
      id: "NOT-003",
      title: "COLLABORATION TRIGGER",
      message: "New child welfare shelter node registered: Sankalp Safe Shelter Mission (Bihar-09).",
      severity: "Info",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "NOT-004",
      title: "COMPLIANCE WARNING",
      message: "National Child Protection Agency node access request pending verification.",
      severity: "Warning",
      timestamp: "4 hours ago",
      read: true,
    },
    {
      id: "NOT-005",
      title: "CASE DISPATCHED",
      message: "Special Investigation Force team dispatched to the Sankalp Transit Ring (G12 Corridor).",
      severity: "Success",
      timestamp: "5 hours ago",
      read: true,
    }
  ],

  addMessage: (sender, role, subject, content) => set((state) => ({
    messages: [
      {
        id: `MSG-${Math.floor(100 + Math.random() * 900)}`,
        sender,
        role,
        subject,
        content,
        timestamp: "Just now",
        read: false,
        sent: true,
      },
      ...state.messages
    ]
  })),

  markMessageRead: (id) => set((state) => ({
    messages: state.messages.map((msg) => msg.id === id ? { ...msg, read: true } : msg)
  })),

  deleteMessage: (id) => set((state) => ({
    messages: state.messages.filter((msg) => msg.id !== id)
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((not) => not.id === id ? { ...not, read: true } : not)
  })),

  clearAllNotifications: () => set((state) => ({
    notifications: state.notifications.map((not) => ({ ...not, read: true }))
  })),

  addNotification: (title, message, severity) => set((state) => ({
    notifications: [
      {
        id: `NOT-${Math.floor(100 + Math.random() * 900)}`,
        title,
        message,
        severity,
        timestamp: "Just now",
        read: false,
      },
      ...state.notifications
    ]
  }))
}));
