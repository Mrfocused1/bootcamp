"use client";

interface TimePickerProps {
  slots: string[];
  selected: string | null;
  onSelect: (t: string) => void;
}

export function TimePicker({ slots, selected, onSelect }: TimePickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {slots.map((slot) => {
        const isSelected = slot === selected;
        return (
          <button
            key={slot}
            onClick={() => onSelect(slot)}
            aria-pressed={isSelected}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{
              backgroundColor: isSelected ? "var(--ua-blue)" : "#fff",
              color: isSelected ? "#fff" : "var(--ua-ink)",
              border: isSelected ? "none" : "1px solid rgba(20,20,20,0.15)",
            }}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
