import { Title3 } from "@fluentui/react-components";
import ActivityCard from "ActivityCard";
import EditActivity from "EditActivity";
import { useState } from "react";
import { Activity } from "types";

export interface ActivityListProps {
    activities: Activity[];
}

export default function ActivityList(props: ActivityListProps) {

    return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title3>Upcoming activities</Title3><EditActivity />
        </div>
        {props.activities.map(activity => {
            return <ActivityCard key={activity.id} {...activity} />
        })}
    </div>;
}