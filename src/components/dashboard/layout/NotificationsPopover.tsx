"use client";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

// Static placeholder notifications using translation keys
const INITIAL_NOTIFICATIONS = [
  {
    id: "1",
    titleKey: "featureTitle",
    descKey: "featureDesc",
    timeKey: "timeAgo2m",
    unread: true,
  },
  {
    id: "2",
    titleKey: "projectTitle",
    descKey: "projectDesc",
    timeKey: "timeAgo1h",
    unread: true,
  },
  {
    id: "3",
    titleKey: "billingTitle",
    descKey: "billingDesc",
    timeKey: "timeAgo5h",
    unread: false,
  },
];

export function NotificationsPopover() {
  const t = useTranslations("Notifications");
  const [data, setData] = useState(INITIAL_NOTIFICATIONS);
  const [open, setOpen] = useState(false);

  const locale = useLocale();
  // This will be replaced by a react-query hook later
  const unreadCount = data.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setData((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Mark as read when the popover opens
  useEffect(() => {
    if (open && unreadCount > 0) {
      // Small delay to let the user see the unread state briefly before it fades
      const timer = setTimeout(() => {
        markAllAsRead();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [open, unreadCount]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full transition-transform active:scale-95"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">{t("title")}</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {unreadCount} {t("newBadge")}
              </Badge>
            )}
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="grid gap-1 p-1" dir={locale === "ar" ? "rtl" : "ltr"}>
            {data.length > 0 ? (
              data.map((notification) => (
                <button
                  key={notification.id}
                  className={cn(
                    "group flex flex-col items-start gap-1 rounded-md p-3 text-start text-sm transition-all hover:bg-accent",
                    notification.unread && "bg-accent/40",
                  )}
                  onClick={() => {
                    setData((prev) =>
                      prev.map((n) => (n.id === notification.id ? { ...n, unread: false } : n)),
                    );
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={cn(
                        "font-medium transition-colors",
                        notification.unread ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {t(notification.titleKey)}
                    </span>
                    {notification.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p
                    className={cn(
                      "text-xs line-clamp-2 transition-colors",
                      notification.unread ? "text-foreground/80" : "text-muted-foreground/70",
                    )}
                  >
                    {t(notification.descKey)}
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-1 group-hover:text-foreground/50 transition-colors">
                    {t(notification.timeKey)}
                  </span>
                </button>
              ))
            ) : (
              <div className="flex h-32 flex-col items-center justify-center gap-1 text-center">
                <Bell className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">{t("noNotifications")}</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-center text-xs font-medium h-8"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            {t("markAllRead")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
