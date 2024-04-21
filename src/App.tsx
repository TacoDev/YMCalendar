import allActivities from './activities.json';
import ActivityCard, { Activity } from 'ActivityCard';

export default function App() {
    const readActivities = allActivities.map<Activity>(activity => {
        return {
            name: activity.name,
            description: activity.description,
            start: new Date(activity.start),
            end: new Date(activity.end),
            location: activity.location
        }
    }) 
    return <div style={{display:'flex', flexDirection: 'column', gap: 10}}>{readActivities.map(activity => {
        return <ActivityCard {...activity} />
    })}</div>;
}