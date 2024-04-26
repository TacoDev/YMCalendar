
export type CalendarEventMap = {
    "markedDays": { startDate: Date, endData: Date };
    "eventsUpdated": void;
    "adminMode": boolean;
}

export type CalendarEvent = keyof CalendarEventMap;
export type CalendarEventCallback<T extends CalendarEvent> = (arg: CalendarEventMap[T]) => void;

export namespace CalendarEvents {
    const events: Record<CalendarEvent, { listeners: CalendarEventCallback<CalendarEvent>[], lastData: any }> = {
        'markedDays': { listeners: [], lastData: null },
        'eventsUpdated': { listeners: [], lastData: null },
        'adminMode': { listeners: [], lastData: null },
    };

    export function emit(event: CalendarEvent, data: CalendarEventMap[CalendarEvent]) {
        events[event].lastData = data;
        events[event].listeners.forEach(listener => {
            listener(data);
        });
    }

    export function subscribe<T extends CalendarEvent>(event: T, listener: CalendarEventCallback<T>, triggerLastEmit = false) {
        events[event].listeners.push(listener);
        if (triggerLastEmit && events[event].lastData) {
            listener(events[event].lastData);
        }
        return () => unsubscribe(event, listener);
    }

    export function unsubscribe<T extends CalendarEvent>(event: T, listener: CalendarEventCallback<T>) {
        const index = events[event].listeners.indexOf(listener);
        events[event].listeners = events[event].listeners.splice(index, 1);
    }
}