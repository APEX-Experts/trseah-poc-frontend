"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface OnboardingFooterProps {
  children: ReactNode;
}

export function OnboardingFooter({ children }: OnboardingFooterProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const container = document.getElementById("onboarding-footer");

  if (!container) return null;

  return createPortal(
    <div className="w-full flex items-center justify-between z-0">{children}</div>,
    container,
  );
}
