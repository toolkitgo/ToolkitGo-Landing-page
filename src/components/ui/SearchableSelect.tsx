"use client";

import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PickerOption, PickerPosition, SearchableSelectProps } from "@/types/registration";

/** Account for browser chrome and the soft keyboard without changing document layout. */
function getPickerPosition(trigger: HTMLButtonElement | null, count: number): PickerPosition {
  const viewport = window.visualViewport;
  const viewHeight = viewport?.height ?? window.innerHeight;
  const viewTop = viewport?.offsetTop ?? 0;
  const viewWidth = document.documentElement.clientWidth;
  const desiredHeight = Math.min(560, 180 + Math.min(count, 7) * 56);
  if (viewWidth < 640) {
    const height = Math.min(desiredHeight, viewHeight - 24);
    return { top: viewTop + viewHeight - height - 12, left: 12, width: viewWidth - 24, height };
  }
  const rect = trigger?.getBoundingClientRect();
  const width = Math.min(Math.max(rect?.width ?? 360, 320), viewWidth - 32);
  const height = Math.min(440, desiredHeight, viewHeight - 32);
  const below = viewTop + viewHeight - (rect?.bottom ?? viewTop) - 16;
  const top = below >= height ? (rect?.bottom ?? viewTop) + 8 : Math.max(viewTop + 16, (rect?.top ?? viewTop + height) - height - 8);
  return { top, left: Math.min(Math.max(16, rect?.left ?? 16), viewWidth - width - 16), width, height };
}

/** Flat searchable choices with a native modal boundary and keyboard navigation. */
export function SearchableSelect({
  id, name, label, description, required = false, placeholder = "Select an option",
  searchPlaceholder = "Search options", value, onChange, error, disabled = false,
  groups, options, fallbackOption,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState<PickerPosition>();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Keep group names as search keywords while removing group headings from the UI.
  const allOptions = useMemo(() => {
    const items: PickerOption[] = (options ?? []).map((item) => ({ ...item, keywords: "" }));
    for (const group of groups ?? []) {
      if ("areas" in group) {
        items.push(...group.areas.map((area) => ({ value: area, label: area, keywords: group.zone })));
      } else {
        items.push(...group.items.map((item) => ({ ...item, keywords: group.group })));
      }
    }
    const unique = Array.from(new Map(items.map((item) => [item.value, item])).values());
    if (groups?.some((group) => "areas" in group)) unique.sort((a, b) => a.label.localeCompare(b.label));
    if (fallbackOption && !unique.some((item) => item.value === fallbackOption)) {
      unique.push({ value: fallbackOption, label: fallbackOption, keywords: "other" });
    }
    return unique;
  }, [groups, options, fallbackOption]);

  const selectedLabel = allOptions.find((item) => item.value === value)?.label ?? value;
  const filtered = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return allOptions.filter((item) => {
      const text = `${item.label} ${item.value.replaceAll("_", " ")} ${item.keywords}`.toLowerCase();
      return words.every((word) => text.includes(word));
    });
  }, [allOptions, query]);
  const activeId = activeIndex >= 0 && activeIndex < filtered.length ? `${id}-option-${activeIndex}` : undefined;

  const open = () => {
    if (disabled) return;
    setQuery("");
    setActiveIndex(allOptions.findIndex((item) => item.value === value));
    setPosition(getPickerPosition(triggerRef.current, allOptions.length));
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);
  const select = (selected: string) => { onChange(selected); close(); };

  // Position, lock scrolling, and focus before paint so opening never flashes an empty panel.
  useLayoutEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    searchRef.current?.focus({ preventScroll: true });
    const resize = () => setPosition(getPickerPosition(trigger, allOptions.length));
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("scroll", resize);
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("scroll", resize);
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen, allOptions.length]);

  useLayoutEffect(() => {
    if (!isOpen || !activeId) return;
    const list = listRef.current;
    const option = document.getElementById(activeId);
    if (!list || !option) return;
    // Scroll only the choices; scrollIntoView can also move the page behind the modal.
    const listRect = list.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();
    if (optionRect.top < listRect.top) list.scrollTop += optionRect.top - listRect.top;
    else if (optionRect.bottom > listRect.bottom) list.scrollTop += optionRect.bottom - listRect.bottom;
  }, [isOpen, activeId]);

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!filtered.length) return;
      const next = event.key === "Home" ? 0 : event.key === "End" ? filtered.length - 1
        : event.key === "ArrowDown" ? (activeIndex + 1) % filtered.length
        : (activeIndex <= 0 ? filtered.length : activeIndex) - 1;
      setActiveIndex(next);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = filtered[activeIndex] ?? (filtered.length === 1 ? filtered[0] : undefined);
      if (item) select(item.value);
    }
  };

  return (
    <div className="min-w-0" data-invalid={!!error}>
      <label id={`${id}-label`} htmlFor={id} className="mb-2 block text-sm font-semibold text-navy">
        {label}{required && <span aria-hidden="true" className="ml-0.5 text-error">*</span>}
      </label>
      {description && <p id={`${id}-hint`} className="mb-2 text-xs leading-relaxed text-charcoal-muted">{description}</p>}
      <input type="hidden" name={name} value={value} disabled={disabled} />
      <div className="relative">
        <button ref={triggerRef} id={id} type="button" role="combobox" aria-haspopup="dialog"
          aria-expanded={isOpen} aria-controls={isOpen ? `${id}-picker` : undefined}
          aria-labelledby={`${id}-label ${id}-value`} aria-required={required} aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : description ? `${id}-hint` : undefined}
          disabled={disabled} onClick={open}
          onKeyDown={(event) => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); open(); } }}
          className={cn("registration-control flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border bg-cream-light px-4 py-3 text-left text-base text-navy disabled:cursor-not-allowed disabled:opacity-60", error ? "border-error" : "border-cream-border")}
        >
          <span id={`${id}-value`} className={cn("min-w-0 flex-1 break-words leading-snug", value ? "pr-11 font-medium" : "text-charcoal-muted")}>{selectedLabel || placeholder}</span>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-charcoal-muted" />
        </button>
        {value && !disabled && <button type="button" aria-label={`Clear ${label.toLowerCase()}`} onClick={() => { onChange(""); triggerRef.current?.focus(); }} className="absolute right-9 top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-charcoal-muted hover:bg-cream-dark"><X aria-hidden="true" className="size-4" /></button>}
      </div>
      {error && <p id={`${id}-error`} className="mt-2 text-sm text-error">{error}</p>}

      <dialog ref={dialogRef} id={`${id}-picker`} aria-labelledby={`${id}-picker-title`}
        className="registration-picker fixed m-0 overflow-hidden rounded-2xl border border-cream-border bg-white p-0 text-navy shadow-nav" style={position}
        onCancel={(event) => { event.preventDefault(); close(); }}
        onPointerDown={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([type="hidden"])');
          if (!focusable?.length) return;
          const first = focusable[0], last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }}
      >
        {isOpen && <>
          <div className="shrink-0 px-4 pb-3 pt-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 id={`${id}-picker-title`} className="text-base font-semibold">{label}</h3>
              <button type="button" aria-label={`Close ${label.toLowerCase()} picker`} onClick={close} className="flex size-11 cursor-pointer items-center justify-center rounded-xl text-charcoal-muted hover:bg-cream-light"><X aria-hidden="true" className="size-5" /></button>
            </div>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-charcoal-muted" />
              <input ref={searchRef} type="search" role="combobox" aria-label={`Search ${label.toLowerCase()}`}
                aria-expanded="true" aria-controls={`${id}-listbox`} aria-autocomplete="list" aria-activedescendant={activeId}
                autoComplete="off" enterKeyHint="done" value={query}
                onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); listRef.current?.scrollTo(0, 0); }}
                onKeyDown={onSearchKeyDown} placeholder={searchPlaceholder}
                className="registration-control min-h-12 w-full rounded-xl border border-cream-border bg-cream-light py-3 pl-10 pr-10 text-base text-navy placeholder:text-charcoal-muted"
              />
              {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setActiveIndex(-1); searchRef.current?.focus(); }} className="absolute right-0 top-0 flex size-12 items-center justify-center"><X aria-hidden="true" className="size-4" /></button>}
            </div>
          </div>
          <ul ref={listRef} id={`${id}-listbox`} role="listbox" aria-label={label} className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-cream-border px-2 py-2">
            {filtered.map((item, index) => <li key={item.value} id={`${id}-option-${index}`} role="option" aria-selected={value === item.value}
              onClick={() => select(item.value)} onPointerMove={() => setActiveIndex(index)}
              className={cn("flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-3 text-base leading-snug", activeIndex === index && "bg-cream-light", value === item.value && "bg-orange-subtle font-semibold")}
            >
              <span className="min-w-0 break-words">{item.label}</span>
              {value === item.value && <Check aria-hidden="true" className="size-5 shrink-0 text-navy" />}
            </li>)}
            {!filtered.length && <li role="presentation" className="px-4 py-6 text-center text-sm text-charcoal-muted">
              <p className="font-semibold text-navy">No matches found</p><p className="mt-2">Try another spelling or choose a different keyword.</p>
              {fallbackOption && <button type="button" onClick={() => select(fallbackOption)} className="button-secondary mt-4 w-full text-left">{fallbackOption}</button>}
            </li>}
          </ul>
          <div aria-live="polite" aria-atomic="true" className="shrink-0 border-t border-cream-border px-5 py-3 text-xs text-charcoal-muted">{filtered.length} {filtered.length === 1 ? "option" : "options"}{query ? " found" : " available"}</div>
        </>}
      </dialog>
    </div>
  );
}
