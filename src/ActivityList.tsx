import ActivityCard from "ActivityCard";
import { Activity } from "types";

export interface ActivityListProps {
    activities: Activity[];
}

export default function ActivityList(props: ActivityListProps) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {props.activities.map(activity => {
            return <ActivityCard key={activity.id} activity={activity} />
        })}
    </div>;
}