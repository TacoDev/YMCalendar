import { Subtitle2, Caption1, Card, CardFooter, CardHeader, makeStyles, tokens } from "@fluentui/react-components";
import { CalendarEvents } from "CalendarEvents";
import EditActivity from "EditActivity";
import DeleteActivity from "DeleteActivity";
import React, { useState } from "react";
import { Activity } from "types";

const useStyles = makeStyles({
    selected: { backgroundColor: tokens.colorBrandBackground2 },
    description: {
        whiteSpace: 'pre-line'
    },
    default: {},
});

function twoDigits(time: number) {
    return (time < 10) ? `0${time}` : `${time}`;
}

const options1: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
};
const formatter = new Intl.DateTimeFormat('en-US', options1);

function getDurationString(startDate: Date, endDate: Date) {
    const duration = endDate.getTime() - startDate.getTime(); // duration in milliseconds
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    if (minutes === 0) {
        if (hours === 1) {
            return `${hours} hour`;
        }
        return `${hours} hours`;
    }
    if(hours === 0) {
        return `${twoDigits(minutes)} minutes`;
    }
    return `${hours}:${twoDigits(minutes)} minutes`;
}

function betweenTime(checkDate: Date, startDate: Date, endDate: Date) {
    const duration = endDate.getTime() - startDate.getTime();
    const checkTime = checkDate.getTime() - startDate.getTime();
    return (checkTime > 0 && checkTime < duration);
}

export default function ActivityCard(props : {activity: Activity, demo?: boolean}) {
    const [inSelectedRange, setInSelectedRange] = useState(false);
    const { start, end, name, location, description, id } = props.activity;
    const styles = useStyles();
    let timeDescription = '';
    if (start.toLocaleDateString() === end.toLocaleDateString()) {
        timeDescription = `${formatter.format(start)} - ${getDurationString(start, end)}`;
    } else {
        timeDescription = `${formatter.format(start)} - ${formatter.format(end)}`;
    }

    React.useEffect(() => {
        return CalendarEvents.subscribe('markedDays', (data) => {
            setInSelectedRange(betweenTime(start, data.startDate, data.endData) || betweenTime(end, data.startDate, data.endData))
        }, true);
    }, [])

    return <Card className={inSelectedRange ? styles.selected : styles.default}>
        <CardHeader
            header={
                <Subtitle2>{name}</Subtitle2>
            }
            description={<Caption1>{`${location}: ${timeDescription}`}</Caption1>}
        />
        <div className={styles.description}>
            {description}
        </div>
        <CardFooter
            action={!props.demo &&
                <>
                    <DeleteActivity id={id} />
                    <EditActivity activity={props.activity} />
                </>
            }
        >
        </CardFooter>
    </Card>;
}