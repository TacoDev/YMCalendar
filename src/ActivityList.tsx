import { Title3 } from "@fluentui/react-components";
import ActivityCard from "ActivityCard";
import EditActivity from "EditActivity";
import { useState } from "react";
import { Activity } from "types";

export interface ActivityListProps {
    activities: Activity[];
}

export default function ActivityList(props: ActivityListProps) {
    const [activities, setActivities] = useState(props.activities);

    return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title3>Upcoming activities</Title3><EditActivity closed={(newActivity) => setActivities([...activities, newActivity])} />
        </div>
        {activities.map(activity => {
            return <ActivityCard {...activity} />
        })}
    </div>;
}