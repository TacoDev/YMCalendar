export type CalendarEvent = {
    "markedDays": {
        startDate: Date;
        endData: Date;
    };
};
export declare namespace CalendarEvents {
    function emit(event: keyof CalendarEvent, data: CalendarEvent[keyof CalendarEvent]): void;
    function subscribe(event: keyof CalendarEvent, listener: (data: CalendarEvent[keyof CalendarEvent]) => void): () => void;
    function unsubscribe(event: keyof CalendarEvent, listener: (data: CalendarEvent[keyof CalendarEvent]) => void): void;
}
