import { Calendar } from "@fluentui/react-calendar-compat";
import type { CalendarDayProps } from "@fluentui/react-calendar-compat";
import { Activity } from "types";
import React from "react";
import { CalendarEvents } from "CalendarEvents";

export interface ActivityCalendarProps {
  activities: Activity[];
}

const min = 1000 * 60;
export const hour = min * 60;
const day = hour * 24;

export default function MarkedCalendar({ activities }: ActivityCalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = React.useState<Date>(null);
  const [daysToSelectInDayView, setDaysToSelectInDayView] = React.useState(1);

  const handleDateSelected = React.useCallback((date: Date) => {
    /*if(!selectedEndDate && date.getTime() > selectedDate.getTime()) {
      setSelectedEndDate(new Date(date.getTime() + day - min));
    } else {
      setSelectedDate(date);
      setSelectedEndDate(null);
    }*/
    setSelectedDate(date);
    setSelectedEndDate(new Date(date.getTime() + day - min));
  }, [selectedDate, selectedEndDate]);

  React.useEffect(() => {
    /*if(selectedDate && selectedEndDate) {
      setDaysToSelectInDayView(((selectedEndDate.getTime() - selectedDate.getTime()) / day) + 1);
    } else {
      setDaysToSelectInDayView(1);
    }*/
    CalendarEvents.emit('markedDays', {
      startDate: selectedDate,
      endData: selectedEndDate ?? new Date(selectedDate.getTime() + day - min)
    });
  }, [selectedDate, selectedEndDate]);

  const calendarDayProps: Partial<CalendarDayProps> = {
    getMarkedDays: (startingDate, endDate) => {
      const shownActivies = activities.filter(activity => activity.start.getTime() > startingDate.getTime() && activity.end.getTime() < endDate.getTime())
      return shownActivies.flatMap(activity => {
        const datesToAdd: Date[] = [];
        let newDate = new Date(activity.start.toDateString());
        do {
          datesToAdd.push(newDate);
          if (newDate.toLocaleDateString() === activity.end.toLocaleDateString()) {
            break;
          }
          newDate = new Date(newDate.getTime() + day);
        } while (newDate.getTime() < activity.end.getTime());
        return datesToAdd;
      });
    },
    daysToSelectInDayView
  };

  return (
    <>
      <Calendar
        showGoToToday
        showMonthPickerAsOverlay
        onSelectDate={handleDateSelected}
        value={selectedDate}
        // Add the marked days
        calendarDayProps={calendarDayProps}
      />
    </>
  );
}