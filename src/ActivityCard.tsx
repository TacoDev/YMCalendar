import { Body1, Caption1, Card, CardFooter, CardHeader, CardPreview } from "@fluentui/react-components";

export interface Activity {
    name: string;
    description: string;
    start: Date;
    end: Date;
    location: string;
}

function twoDigits(time: number) {
    return (time < 10) ? `0${time}` : `${time}`;
}

function getDurationString(startDate: Date, endDate: Date) {
    const duration = endDate.getTime() - startDate.getTime(); // duration in milliseconds
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return `${hours}:${twoDigits(minutes)}`;
}


export default function ActivityCard({start, end, name, location, description}: Activity) {
    let timeDescription = '';
    if (start.toLocaleDateString() === end.toLocaleDateString()) {
        timeDescription = `${start.toLocaleDateString()} ${getDurationString(start, end)}`;
    } else {
        timeDescription = `${start.toLocaleDateString()} ${start.toLocaleTimeString()} - ${end.toLocaleDateString()} ${end.toLocaleTimeString()}`;
    }
    return <Card>
        <CardHeader
            header={
                <Body1>
                    <b>{name}</b>
                </Body1>
            }
            description={<Caption1>{`${location}: ${timeDescription}`}</Caption1>}
        />
        {description}
    </Card>;
}