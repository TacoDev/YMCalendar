
export type CalendarEvent = {
    "markedDays": { startDate: Date, endData: Date }
}

export namespace CalendarEvents {
    const listeners: Record<string, ((data: CalendarEvent[keyof CalendarEvent]) => void)[]> = {};

    export function emit(event: keyof CalendarEvent, data: CalendarEvent[keyof CalendarEvent]) {
        if (!listeners[event]) {
            return;
        }
        listeners[event].forEach((listener) => {
            listener(data);
        });
    }
    
    export function subscribe(event: keyof CalendarEvent, listener: (data: CalendarEvent[keyof CalendarEvent]) => void) {
        if (!listeners[event]) {
            listeners[event] = [];
        }
        listeners[event].push(listener);
        return () => unsubscribe(event, listener);
    }

    export function unsubscribe(event: keyof CalendarEvent, listener: (data: CalendarEvent[keyof CalendarEvent]) => void) {
        if (!listeners[event]) {
            return;
        }
        const index = listeners[event].indexOf(listener);
        listeners[event] = listeners[event].splice(index, 1);
    }
}