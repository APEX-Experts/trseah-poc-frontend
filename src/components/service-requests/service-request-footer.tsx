"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ServiceRequestFooterProps {
  children: ReactNode;
}

export function ServiceRequestFooter({ children }: ServiceRequestFooterProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const container = document.getElementById("service-request-footer");

  if (!container) return null;

  return createPortal(
    <div className="w-full flex items-center justify-between">{children}</div>,
    container,
  );
}
