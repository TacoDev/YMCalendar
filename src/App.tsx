import ActivityList from 'ActivityList';
import allActivities from './activities.json';
import MarkedCalendar from 'MarkedCalendar';
import { LargeTitle } from "@fluentui/react-components";
import { Activity } from 'types';

const readActivities = allActivities.map<Activity>(activity => {
    return {
        name: activity.name,
        description: activity.description,
        start: new Date(activity.start),
        end: new Date(activity.end),
        location: activity.location,
        id: activity.id
    }
}).sort((a, b) => a.start.getTime() - b.start.getTime());

const today = new Date(new Date().toDateString());
const upComing = readActivities.filter((activity) => activity.start.getTime() >= today.getTime());

export default function App() {
    return (
        <>
            <LargeTitle>YM Activities</LargeTitle>
            <MarkedCalendar activities={upComing} />
            <ActivityList activities={upComing} />
        </>
    );
}