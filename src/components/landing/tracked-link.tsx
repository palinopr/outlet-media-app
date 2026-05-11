"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { trackLandingEvent, type LandingEventPayload } from "./analytics";

type LandingTrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName?: string;
  eventPayload?: LandingEventPayload;
};

export function LandingTrackedLink({
  children,
  eventName = "LandingCtaClicked",
  eventPayload = {},
  onClick,
  ...props
}: LandingTrackedLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackLandingEvent(eventName, eventPayload);
    onClick?.(event);
  }

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
