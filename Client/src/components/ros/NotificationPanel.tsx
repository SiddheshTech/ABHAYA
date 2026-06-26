import React from "react";
import { 
  X, Bell, CheckSquare, Trash2, ShieldAlert, AlertTriangle, Info, 
  CheckCircle2, Sparkles, RefreshCw, Zap, BellRing, Eye
} from "lucide-react";
import { useOverlayStore, Notification } from "../../lib/overlayStore";
import { useToastStore } from "../../lib/store";

interface NotificationPanelProps {
  highContrast?: boolean;
}

export default function NotificationPanel({ highContrast }: NotificationPanelProps) {
  const { 
    isNotificationsOpen, 
    setNotificationsOpen, 
    notifications, 
    markNotificationRead, 
    clearAllNotifications 
  } = useOverlayStore();
  
  const { addToast } = useToastStore();

  if (!isNotificationsOpen) return null;

  const bgCard = highContrast ? "bg-stone-950 border-stone-800" : "bg-stone-900/98 border-stone-800 text-stone-100 shadow-2xl";
  const borderCol = highContrast ? "border-stone-850" : "border-stone-800/80";
  const textMuted = highContrast ? "text-stone-400" : "text-stone-400 font-mono text-[11px]";

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    addToast("Notification marked as read", "info");
  };

  const handleClearAll = () => {
    clearAllNotifications();
    addToast("All live notifications cleared to history archive", "success");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end animate-in fade-in duration-200">
      
      {/* Backdrop closer */}
      <div className="absolute inset-0 cursor-pointer" onClick={() => setNotificationsOpen(false)} />

      {/* Drawer box container */}
      <div className={`w-full max-w-md h-full border-l relative z-10 flex flex-col justify-between animate-in slide-in-from-right duration-250 ${bgCard}`}>
        
        {/* Header telemetry segment */}
        <div className="p-4 bg-stone-950 border-b border-stone-850 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 rounded-lg relative">
              <Bell className="w-4 h-4 animate-swing" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 h-2.5 w-2.5 rounded-full ring-2 ring-stone-950 animate-pulse" />
              )}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <h3 className="font-black text-xs uppercase tracking-widest text-indigo-400 font-mono">
                  LIVE TELEMETRY FEED
                </h3>
              </div>
              <p className="text-[9px] text-stone-500 font-mono uppercase mt-0.5">
                {unreadCount} UNREAD NOTIFICATIONS PENDING
              </p>
            </div>
          </div>

          <button 
            onClick={() => setNotificationsOpen(false)}
            className="p-1.5 rounded-full bg-stone-900 hover:bg-stone-850 transition-colors border border-stone-800 text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action controllers */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 bg-stone-950/60 border-b border-stone-900 flex justify-between items-center text-[10px] font-mono">
            <span className="text-stone-500">REALTIME NETWORK BROADCST</span>
            <button 
              onClick={handleClearAll}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>MARK ALL READ</span>
            </button>
          </div>
        )}

        {/* Notifications list feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 font-mono text-xs">
              <BellRing className="w-12 h-12 text-stone-800 mb-2 animate-bounce" />
              <p>Telemetry ledger is quiet</p>
              <p className="text-[10px] text-stone-600 mt-1 uppercase">No active system events registered</p>
            </div>
          ) : (
            notifications.map((not) => {
              // Custom colors based on severity
              const isCritical = not.severity === "Critical";
              const isWarning = not.severity === "Warning";
              const isSuccess = not.severity === "Success";
              
              let borderTheme = "border-stone-850 bg-stone-950/40";
              let iconTheme = <Info className="w-4 h-4 text-blue-400" />;
              let severityBadge = "bg-blue-950/40 text-blue-400 border-blue-900";
              
              if (isCritical) {
                borderTheme = "border-red-900/60 bg-red-950/10";
                iconTheme = <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />;
                severityBadge = "bg-red-950/40 text-red-400 border-red-900";
              } else if (isWarning) {
                borderTheme = "border-amber-900/60 bg-amber-950/10";
                iconTheme = <AlertTriangle className="w-4 h-4 text-amber-500" />;
                severityBadge = "bg-amber-950/40 text-amber-400 border-amber-900";
              } else if (isSuccess) {
                borderTheme = "border-emerald-900/60 bg-emerald-950/10";
                iconTheme = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
                severityBadge = "bg-emerald-950/40 text-emerald-400 border-emerald-900";
              }

              return (
                <div
                  key={not.id}
                  onClick={() => handleMarkRead(not.id)}
                  className={`p-3.5 rounded-xl border transition-all relative ${borderTheme} ${
                    !not.read ? "hover:border-stone-700 cursor-pointer" : "opacity-60"
                  }`}
                >
                  {/* Unread indicator bar */}
                  {!not.read && (
                    <span className="absolute top-3.5 left-0 w-1 h-8 rounded-r bg-indigo-500" />
                  )}

                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0">{iconTheme}</span>
                    <div className="space-y-1 w-full min-w-0">
                      
                      {/* Top bar info */}
                      <div className="flex justify-between items-center gap-2">
                        <span className={`text-[8px] font-black tracking-widest font-mono px-1.5 py-0.5 rounded border uppercase shrink-0 ${severityBadge}`}>
                          {not.severity}
                        </span>
                        <span className="text-[9px] font-mono text-stone-500 whitespace-nowrap">{not.timestamp}</span>
                      </div>

                      <h4 className="text-xs font-bold text-stone-100 font-mono tracking-tight">{not.title}</h4>
                      <p className="text-[11px] leading-relaxed text-stone-400 font-sans">{not.message}</p>
                      
                      {/* Read status block trigger */}
                      {!not.read && (
                        <div className="pt-2 border-t border-stone-900/40 flex justify-end">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleMarkRead(not.id); }}
                            className="text-[9px] font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <CheckSquare className="w-3 h-3" />
                            <span>ACKNOWLEDGE ALERT</span>
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer ledger stats info */}
        <div className="p-4 bg-stone-950 border-t border-stone-850 text-center font-mono text-[10px] text-stone-500 flex items-center justify-between">
          <span>ABHAYA BROADCAST V4.2</span>
          <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> System Synchronized
          </span>
        </div>

      </div>
    </div>
  );
}
