"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onClose?: () => void;
};

function Calendar2({
  className,
  classNames,
  showOutsideDays = true,
  onClose,
  ...props
}: CalendarProps) {
  const today = new Date();
  const calendarRef = React.useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={calendarRef}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-4 bg-white rounded-xl shadow-lg", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-6 sm:space-x-8 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-2 relative items-center",
          caption_label: "text-lg font-semibold text-gray-800",
          nav: "space-x-2 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-10 w-10 rounded-full bg-white border-gray-200 p-0 hover:bg-gray-50 hover:border-gray-300",
            "flex items-center justify-center"
          ),
          nav_button_previous: "absolute left-2",
          nav_button_next: "absolute right-2",
          table: "w-full border-collapse space-y-2",
          head_row: "flex",
          head_cell: "text-gray-500 rounded-md w-12 font-medium text-sm",
          row: "flex w-full mt-3 gap-1",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
            "[&:has([aria-selected])]:bg-gray-100",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full"
              : "[&:has([aria-selected])]:rounded-full"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-12 w-12 p-0 font-normal text-gray-800 text-lg",
            "hover:bg-gray-100 hover:text-gray-900",
            "transition-colors duration-200 ease-in-out"
          ),
          day_range_start:
            "day-range-start bg-blue-600 text-white hover:bg-blue-700",
          day_range_end:
            "day-range-end bg-blue-600 text-white hover:bg-blue-700",
          day_selected:
            "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
          day_today: "border-2 border-blue-400 text-gray-900",
          day_outside:
            "text-gray-400 aria-selected:bg-gray-100 aria-selected:text-gray-400",
          day_disabled: "text-gray-300 cursor-not-allowed",
          day_range_middle:
            "aria-selected:bg-gray-100 aria-selected:text-gray-900",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => (
            <ChevronLeft className="h-5 w-5 text-gray-600" {...props} />
          ),
          IconRight: ({ ...props }) => (
            <ChevronRight className="h-5 w-5 text-gray-600" {...props} />
          ),
        }}
        disabled={{
          before: today,
        }}
        modifiersClassNames={{
          today: "font-bold",
          selected: "font-semibold",
        }}
        modifiersStyles={{
          today: { borderColor: "#60a5fa" },
        }}
        {...props}
      />
    </div>
  );
}
Calendar2.displayName = "Calendar";

export { Calendar2 };
