"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  date?: Date;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: boolean;
  initialFocus?: boolean;
}

export function DatePicker({
  date,
  selected,
  onSelect,
  disabled,
  initialFocus,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(selected);

  // Update state when selected prop changes
  React.useEffect(() => {
    setSelectedDate(selected);
  }, [selected]);

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (onSelect) {
      onSelect(date);
    }
  };

  return (
    <div className="grid gap-2">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        disabled={disabled}
        initialFocus={initialFocus}
      />
    </div>
  );
}
