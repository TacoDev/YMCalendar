import ActivityList from 'ActivityList';
import MarkedCalendar from 'MarkedCalendar';
import { LargeTitle } from "@fluentui/react-components";
import { useEffect, useState } from 'react';
import { CalendarEvents } from "CalendarEvents";
import { Activities } from 'Activities';

export default function App() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        Activities.getActivities().then(serverActivities => {
            setActivities(serverActivities);
        });

        CalendarEvents.emit('adminMode', window.location.href.includes("adminMode=true"));
        
        addEventListener("hashchange", (event) => {
            CalendarEvents.emit('adminMode', event.newURL.includes("adminMode=true"));
        });
        
        return CalendarEvents.subscribe('eventsUpdated', () => {
            console.log('updating list');
            Activities.getActivities().then(serverActivities => {
                setActivities(serverActivities);
                console.log(serverActivities);
            });
        });
    }, []);

    return (
        <>
            <LargeTitle>YM Activities</LargeTitle>
            <MarkedCalendar activities={activities} />
            <ActivityList activities={activities} />
        </>
    );
}