import { Activity, RawActivity } from "types";

declare const apiDomain: string;

export namespace Activities {

    export async function getActivities(): Promise<Activity[]> {
        const response = await fetch(`${apiDomain}/activities`, { mode: 'cors', method: 'GET' });
        return (await response.json() as RawActivity[]).map<Activity>(activity => {
            return {
                name: activity.name,
                description: activity.description,
                start: new Date(activity.start),
                end: new Date(activity.end),
                location: activity.location,
                id: activity.id
            }
        }).sort((a, b) => a.start.getTime() - b.start.getTime());;
    }

    export async function setActivity(activity: Activity): Promise<Activity> {
        const response = await fetch(
            `${apiDomain}/activities/${activity.id}`,
            {
                mode: 'cors',
                method: 'PUT',
                body: JSON.stringify(activity)
            });
        activity = (await response.json() as Activity)
        return {
            name: activity.name,
            description: activity.description,
            start: new Date(activity.start),
            end: new Date(activity.end),
            location: activity.location,
            id: activity.id
        };
    }

    export async function deleteActivity(id: string): Promise<void> {
        await fetch(
            `${apiDomain}/activities/${id}`,
            {
                mode: 'cors',
                method: 'DELETE'
            });
    }
}