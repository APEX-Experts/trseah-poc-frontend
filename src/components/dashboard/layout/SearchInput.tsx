import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { navConfig } from "@/config/nav-config";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

// 1. The stateless trigger button
export function SearchTrigger({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
  shortcut?: string;
}) {
  const t = useTranslations("Search");

  return (
    <Button
      variant="outline"
      className={cn(
        "w-full relative p-0 max-sm:h-8 max-sm:w-8 sm:px-3 justify-center md:justify-start rounded-full sm:rounded-lg bg-background text-sm font-normal text-muted-foreground shadow-none transition-all hover:bg-neutral-100",
        className,
      )}
      onClick={onClick}
    >
      <Search className="h-4 w-4 md:me-2" />
      <span className="hidden md:inline-flex">{t("placeholderShort")}</span>
    </Button>
  );
}

// 2. The modal and keyboard listener
export function SearchDialog({
  open,
  setOpen,
  shortcut = "k",
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shortcut?: string;
}) {
  const t = useTranslations("Search");
  const tSidebar = useTranslations("AppSidebar");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === shortcut.toLowerCase() && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [shortcut, setOpen]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t("placeholder")} />
      <CommandList>
        <CommandEmpty>{t("noResults")}</CommandEmpty>
        <CommandGroup heading={t("navigationHeading")}>
          {navConfig.sidebarNav.map((item) => (
            <CommandItem
              key={item.href}
              value={tSidebar(item.label)}
              onSelect={() => {
                runCommand(() => router.push(item.href));
              }}
            >
              <item.icon className="me-2 h-4 w-4" />
              <span>{tSidebar(item.label)}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
