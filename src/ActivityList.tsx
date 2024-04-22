import ActivityCard from "ActivityCard";
import MarkedCalendar from "MarkedCalendar";
import { Activity } from "types";

export interface ActivityListProps {
    activities: Activity[];
}

export default function ActivityList({ activities }: ActivityListProps) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {activities.map(activity => {
            return <ActivityCard {...activity} />
        })}
    </div>;
}