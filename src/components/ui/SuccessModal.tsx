"use client";

import { useEffect, useRef } from "react";
import type { SuccessModalProps } from "@/types/ui";

/** Native modal semantics provide focus containment, Escape dismissal and focus restoration. */
export function SuccessModal({ registrationId, onClose, returnFocusRef }: SuccessModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const focusTarget = returnFocusRef.current ?? previousFocus;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (focusTarget instanceof HTMLElement) focusTarget.focus();
    };
  }, [returnFocusRef]);

  return (
    <dialog ref={dialogRef} aria-labelledby="modal-title" aria-describedby="modal-description"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        // This dialog has one action: keep both Tab directions on that action.
        if (event.key === "Tab") {
          event.preventDefault();
          dialogRef.current?.querySelector("button")?.focus();
        }
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-xl border border-cream-border bg-white p-7 text-center text-navy sm:p-9">
      <div aria-hidden="true" className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-orange-subtle text-2xl">&#10003;</div>
      <h2 id="modal-title" className="text-2xl font-bold">You&apos;re on the priority list!</h2>
      <p id="modal-description" className="mt-3 text-sm leading-relaxed text-charcoal">
        Your pre-registration has been recorded. Our team will reach out to you before the city launch.
      </p>
      <div className="mt-6 rounded-lg border border-cream-border bg-cream p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal">Priority partner ID</p>
        <p className="mt-2 break-all font-mono text-lg font-bold text-navy">{registrationId}</p>
      </div>
      <button type="button" autoFocus onClick={onClose} className="button-primary mt-6 w-full cursor-pointer">Got it, thanks!</button>
    </dialog>
  );
}
