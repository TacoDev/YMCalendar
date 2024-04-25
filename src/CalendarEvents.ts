
export type CalendarEvent = {
    "markedDays": { startDate: Date, endData: Date };
    "eventsUpdated": void;
    "adminMode": boolean;
}

export namespace CalendarEvents {
    const events: Record<string, { listeners: ((data: CalendarEvent[keyof CalendarEvent]) => void)[], lastData: any }> = {};

    function checkEvent(event: keyof CalendarEvent) {
        if (!events[event]) {
            events[event] = { lastData: null, listeners: [] };
        }
    }

    export function emit(event: keyof CalendarEvent, data: CalendarEvent[keyof CalendarEvent]) {
        checkEvent(event);
        events[event].lastData = data;
        events[event].listeners.forEach(listener => {
            listener(data);
        });
    }

    export function subscribe(event: keyof CalendarEvent, listener: (data: CalendarEvent[keyof CalendarEvent]) => void, triggerLastEmit = false) {
        checkEvent(event);
        events[event].listeners.push(listener);
        if (triggerLastEmit && events[event].lastData) {
            listener(events[event].lastData);
        }
        return () => unsubscribe(event, listener);
    }

    export function unsubscribe(event: keyof CalendarEvent, listener: (data: CalendarEvent[keyof CalendarEvent]) => void) {
        checkEvent(event);
        const index = events[event].listeners.indexOf(listener);
        events[event].listeners = events[event].listeners.splice(index, 1);
    }
}