"use client";

import React, { useState, useRef, useEffect, useMemo, useId } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import type {
  OptionItem,
  LocalityGroup,
  ServiceCategoryGroup,
} from "@/types/registration";

export interface SearchableSelectProps {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  groups?: Array<LocalityGroup | ServiceCategoryGroup>;
  options?: OptionItem[];
  fallbackOption?: string;
}

interface NormalizedItem {
  value: string;
  label: string;
}

interface NormalizedGroup {
  title: string;
  items: NormalizedItem[];
}

export function SearchableSelect({
  id,
  name,
  label,
  required = false,
  placeholder = "Select an option",
  searchPlaceholder = "Type to search...",
  value,
  onChange,
  error,
  disabled = false,
  groups,
  options,
  fallbackOption,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const listboxId = useId();

  // Normalize groups into unified { title, items: [{ value, label }] }
  const normalizedGroups: NormalizedGroup[] = useMemo(() => {
    if (!groups) return [];
    return groups.map((g) => {
      const title = ("group" in g ? g.group : g.zone) || "";
      const rawItems = "items" in g ? g.items : g.areas;
      const items: NormalizedItem[] = rawItems.map((item) =>
        typeof item === "string" ? { value: item, label: item } : item
      );
      return { title, items };
    });
  }, [groups]);

  // Find human-readable label for selected value
  const selectedLabel = useMemo(() => {
    if (!value) return "";
    if (options) {
      const match = options.find((opt) => opt.value === value);
      if (match) return match.label;
    }
    if (normalizedGroups.length > 0) {
      for (const group of normalizedGroups) {
        const match = group.items.find((item) => item.value === value);
        if (match) return match.label;
      }
    }
    return value;
  }, [value, options, normalizedGroups]);

  // Filter grouped options (Hyderabad Localities or Service Trade Groups)
  const filteredGroups = useMemo(() => {
    if (!normalizedGroups.length) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return normalizedGroups;

    return normalizedGroups
      .map((group) => {
        const titleMatches = group.title.toLowerCase().includes(query);
        const matchingItems = titleMatches
          ? group.items
          : group.items.filter(
              (item) =>
                item.label.toLowerCase().includes(query) ||
                item.value.toLowerCase().includes(query)
            );

        return {
          title: group.title,
          items: matchingItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [normalizedGroups, searchQuery]);

  // Filter flat options
  const filteredOptions = useMemo(() => {
    if (!options) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return options;

    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // Flattened list of selectable items for keyboard navigation and count
  const flattenedItems = useMemo(() => {
    if (normalizedGroups.length > 0) {
      const items = filteredGroups.flatMap((g) => g.items.map((i) => i.value));
      const query = searchQuery.trim().toLowerCase();
      // Include fallback option if query is empty OR if query matches fallbackOption
      if (
        fallbackOption &&
        !items.includes(fallbackOption) &&
        (!query || fallbackOption.toLowerCase().includes(query))
      ) {
        items.push(fallbackOption);
      }
      return items;
    }
    return filteredOptions.map((opt) => opt.value);
  }, [normalizedGroups, filteredGroups, filteredOptions, fallbackOption, searchQuery]);

  // Open handler
  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
    setSearchQuery("");
    setHighlightedIndex(-1);
  };

  // Close handler
  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
    triggerRef.current?.focus();
  };

  // Selection handler
  const handleSelect = (val: string) => {
    onChange(val);
    handleClose();
  };

  // Clear handler
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
  };

  // Focus input on dropdown open
  useEffect(() => {
    if (isOpen) {
      // Short delay for rendering and smooth mobile keyboard opening
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-scroll highlighted item into view in listbox
  useEffect(() => {
    if (highlightedIndex >= 0 && listboxRef.current) {
      const activeEl = listboxRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  // Lock body scroll on mobile view when sheet is open
  useEffect(() => {
    if (!isOpen) return;
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Outside click handler
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("pointerdown", handlePointerDown);
      return () => document.removeEventListener("pointerdown", handlePointerDown);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpen();
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < flattenedItems.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : flattenedItems.length - 1
      );
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < flattenedItems.length) {
        handleSelect(flattenedItems[highlightedIndex]);
      } else if (flattenedItems.length === 1) {
        handleSelect(flattenedItems[0]);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${isOpen ? "z-30" : "z-10"}`}>
      <label
        id={`${id}-label`}
        htmlFor={id}
        className="block text-sm font-bold text-navy mb-2"
      >
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>

      {/* Hidden input for standard form submission fallback */}
      <input type="hidden" name={name} value={value} />

      {/* Combobox Trigger Button */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={`${id}-label`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        disabled={disabled}
        onClick={() => (isOpen ? handleClose() : handleOpen())}
        onKeyDown={handleKeyDown}
        className={`w-full px-4 py-3.5 rounded-lg border text-left flex items-center justify-between text-navy bg-cream-light transition-colors select-none ${
          disabled
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer hover:border-orange/60"
        } ${
          error
            ? "border-error focus:border-error focus:ring-0 outline-none bg-error-light/10"
            : isOpen
            ? "border-orange focus:border-orange focus:ring-0 outline-none shadow-xs"
            : "border-cream-border focus:border-orange focus:ring-0 outline-none"
        }`}
      >
        <span
          className={`block truncate text-sm sm:text-base ${
            selectedLabel ? "font-medium text-navy" : "text-charcoal-muted"
          }`}
        >
          {selectedLabel || placeholder}
        </span>

        <span className="flex items-center gap-1.5 shrink-0 ml-2">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear selection"
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange("");
                }
              }}
              className="p-1 rounded-full text-charcoal-muted hover:text-navy hover:bg-cream-dark transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </span>
          )}
          <ChevronDown
            className={`size-4 text-charcoal-muted transition-transform duration-200 ${
              isOpen ? "rotate-180 text-orange" : ""
            }`}
          />
        </span>
      </button>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-error font-medium">
          {error}
        </p>
      )}

      {/* Dropdown Backdrop for Mobile */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={handleClose}
          className="fixed inset-0 bg-navy/60 backdrop-blur-xs z-40 sm:hidden animate-fade-in"
        />
      )}

      {/* Dropdown Popover (Responsive: Bottom Sheet on Mobile, Anchored on Desktop) */}
      {isOpen && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] rounded-t-2xl border-t border-cream-border bg-white shadow-2xl flex flex-col sm:absolute sm:inset-x-0 sm:bottom-auto sm:top-full sm:mt-1.5 sm:max-h-84 sm:rounded-xl sm:border sm:border-cream-border sm:shadow-xl sm:animate-fade-in"
          onKeyDown={handleKeyDown}
        >
          {/* Mobile Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-cream-border/60 sm:hidden bg-cream-light/60">
            <span className="text-sm font-bold text-navy truncate">{label}</span>
            <button
              type="button"
              onClick={handleClose}
              className="text-xs font-bold text-navy bg-cream px-3 py-1.5 rounded-lg border border-cream-border hover:bg-orange hover:text-white transition-colors"
            >
              Done
            </button>
          </div>

          {/* Sticky Search Header */}
          <div className="p-3 border-b border-cream-border/70 bg-white sticky top-0 z-10 shrink-0">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-charcoal-muted pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                // text-base (16px) strictly prevents iOS Safari auto-zoom
                className="w-full pl-10 pr-9 py-2.5 text-base sm:text-sm rounded-lg border border-cream-border bg-cream-light text-navy placeholder:text-charcoal-muted focus:border-orange focus:outline-none focus:ring-0 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-charcoal-muted hover:text-navy rounded-full hover:bg-cream-dark transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Results counter badge */}
            <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-charcoal-muted px-1">
              <span>
                {flattenedItems.length} {flattenedItems.length === 1 ? "match" : "matches"} found
              </span>
              {searchQuery && (
                <span className="text-orange truncate max-w-[150px]">
                  Filtering: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>
          </div>

          {/* Scrollable Options Listbox */}
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="flex-1 overflow-y-auto overscroll-contain py-1 focus:outline-none divide-y divide-cream-border/20 text-navy"
          >
            {/* GROUPED OPTIONS (e.g. Hyderabad Zones or Service Trade Groups) */}
            {normalizedGroups.length > 0 && filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <li key={group.title} role="presentation" className="py-1">
                  <div className="sticky top-0 z-5 bg-cream/95 backdrop-blur-xs px-4 py-2 text-xs font-bold uppercase tracking-wider text-charcoal border-y border-cream-border/60 flex items-center justify-between">
                    <span>{group.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-cream-border text-navy">
                      {group.items.length}
                    </span>
                  </div>
                  <ul role="group" aria-label={group.title}>
                    {group.items.map((item) => {
                      const isSelected = value === item.value;
                      const globalIndex = flattenedItems.indexOf(item.value);
                      const isHighlighted = highlightedIndex === globalIndex;

                      return (
                        <li
                          key={item.value}
                          role="option"
                          data-index={globalIndex}
                          aria-selected={isSelected}
                          onClick={() => handleSelect(item.value)}
                          onMouseEnter={() => setHighlightedIndex(globalIndex)}
                          className={`min-h-[44px] px-4 sm:px-5 py-2.5 flex items-center justify-between text-sm cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-orange-light text-navy font-bold border-l-4 border-orange"
                              : isHighlighted
                              ? "bg-cream-light text-navy font-medium"
                              : "text-navy hover:bg-cream-light"
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {isSelected && (
                            <Check className="size-4 text-orange shrink-0 ml-2" />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))
            ) : null}

            {/* FLAT OPTIONS (e.g. Experience) */}
            {options && filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = value === opt.value;
                const globalIndex = flattenedItems.indexOf(opt.value);
                const isHighlighted = highlightedIndex === globalIndex;

                return (
                  <li
                    key={opt.value}
                    role="option"
                    data-index={globalIndex}
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(globalIndex)}
                    className={`min-h-[46px] px-4 sm:px-5 py-3 flex items-center justify-between text-sm cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-orange-light text-navy font-bold border-l-4 border-orange"
                        : isHighlighted
                        ? "bg-cream-light text-navy font-medium"
                        : "text-navy hover:bg-cream-light"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check className="size-4 text-orange shrink-0 ml-2" />
                    )}
                  </li>
                );
              })
            ) : null}

            {/* Optional Fallback Option */}
            {fallbackOption &&
              (!searchQuery.trim() ||
                fallbackOption
                  .toLowerCase()
                  .includes(searchQuery.trim().toLowerCase())) && (
                <li
                  key={fallbackOption}
                  role="option"
                  data-index={flattenedItems.indexOf(fallbackOption)}
                  aria-selected={value === fallbackOption}
                  onClick={() => handleSelect(fallbackOption)}
                  className={`min-h-[46px] px-4 sm:px-5 py-3 flex items-center justify-between text-sm cursor-pointer transition-colors border-t border-cream-border/60 ${
                    value === fallbackOption
                      ? "bg-orange-light text-navy font-bold border-l-4 border-orange"
                      : "bg-cream-light/60 hover:bg-cream text-navy font-medium"
                  }`}
                >
                  <span className="truncate italic text-charcoal">
                    + {fallbackOption}
                  </span>
                  {value === fallbackOption && (
                    <Check className="size-4 text-orange shrink-0 ml-2" />
                  )}
                </li>
              )}

            {/* EMPTY STATE */}
            {flattenedItems.length === 0 && (
              <li className="p-6 text-center">
                <p className="text-sm font-semibold text-navy">
                  No matching options found
                </p>
                <p className="text-xs text-charcoal-muted mt-1">
                  Try typing a different keyword or trade name.
                </p>
                {fallbackOption && (
                  <button
                    type="button"
                    onClick={() => handleSelect(fallbackOption)}
                    className="mt-4 px-4 py-2 rounded-lg bg-orange text-white text-xs font-bold hover:bg-orange-hover transition-colors shadow-xs cursor-pointer"
                  >
                    Select &ldquo;{fallbackOption}&rdquo;
                  </button>
                )}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
