import ActivityList from 'ActivityList';
import MarkedCalendar from 'MarkedCalendar';
import { Title2, SelectTabData, SelectTabEvent, Tab, TabList, Subtitle1 } from "@fluentui/react-components";
import { useEffect, useState } from 'react';
import { CalendarEvents } from "CalendarEvents";
import { Activities } from 'Activities';
import EditActivity from 'EditActivity';

type TabValue = "tab1" | "tab2";

export default function App() {
    const [pastActivities, setPastActivities] = useState([]);
    const [futureActivities, setFutureActivities] = useState([]);
    const [selectedValue, setSelectedValue] = useState<TabValue>("tab1");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value as TabValue);
    };

    const updateActivities = () => {
        const now = new Date();
        Activities.getActivities().then(serverActivities => {
            setPastActivities(serverActivities.filter(activity => activity.end.getTime() <= now.getTime()).sort((a, b) => b.start.getTime() - a.start.getTime()));
            setFutureActivities(serverActivities.filter(activity => activity.end.getTime() > now.getTime()));
        });

    }

    useEffect(() => {
        updateActivities();
        CalendarEvents.emit('adminMode', window.location.href.includes("adminMode=true"));

        addEventListener("hashchange", (event) => {
            CalendarEvents.emit('adminMode', event.newURL.includes("adminMode=true"));
        });

        return CalendarEvents.subscribe('eventsUpdated', () => {
            updateActivities();
        });
    }, []);

    return (
        <>
            <Title2>YM Activities</Title2>
            <MarkedCalendar activities={[...pastActivities, ...futureActivities]} />
            <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} >
                <Tab value="tab1"><Subtitle1>Upcoming activities</Subtitle1></Tab>
                <Tab value="tab2"><Subtitle1>Past activities</Subtitle1></Tab>
                <EditActivity />
            </TabList>
            {selectedValue === "tab1" && <ActivityList activities={futureActivities} />}
            {selectedValue === "tab2" && <ActivityList activities={pastActivities} />}
        </>
    );
}