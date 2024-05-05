import { DatePicker, DatePickerProps } from "@fluentui/react-datepicker-compat";
import { TimePicker, TimePickerProps, formatDateToTimeString } from "@fluentui/react-timepicker-compat";
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogOpenChangeData, DialogSurface, DialogTitle, DialogTrigger, Field, Input, Textarea, makeStyles } from "@fluentui/react-components";
import { AddFilled, EditRegular, SaveRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { Activity } from "types";
import { v4 as uuid } from 'uuid';
import { Activities } from "Activities";
import { CalendarEvents } from "CalendarEvents";
import { hour } from "MarkedCalendar";
import ActivityCard from "ActivityCard";

const useStyles = makeStyles({
    root: {
        display: "grid",
        columnGap: "20px",
        gridTemplateColumns: "repeat(2, 1fr)",
        maxWidth: "600px",
        marginBottom: "10px",
    },
});

export interface EditActivityProps {
    activity?: Activity;
}

export default function EditActivity({ activity = null }: EditActivityProps) {
    const styles = useStyles();
    const defaultStartTime = new Date();
    const defaultEndTime = new Date(defaultStartTime.getTime() + hour);
    const [newActivity] = useState(activity === null);
    const [editActivity, setEditActivity] = useState(activity);
    const [name, setName] = useState(activity?.name ?? '');
    const [location, setLocation] = useState(activity?.location ?? '');
    const [description, setDescription] = useState(activity?.description ?? '');
    const [startDate, setStartDate] = useState(activity?.start ?? defaultStartTime);
    const [selectedStartDate, setSelectedStartDate] = React.useState<Date>(startDate);
    const [selectedStartTime, setSelectedStartTime] = React.useState<string>(formatDateToTimeString(startDate));
    const [endDate, setEndDate] = useState(activity?.end ?? defaultEndTime);
    const [selectedEndDate, setSelectedEndDate] = React.useState<Date>(endDate);
    const [selectedEndTime, setSelectedEndTime] = React.useState<string>(formatDateToTimeString(endDate));
    const [adminMode, setAdminMode] = React.useState(false);

    useEffect(() => {
        return CalendarEvents.subscribe('adminMode', (isAdmin: boolean) => {
            setAdminMode(isAdmin);
        }, true);
    }, []);

    const saveActivity = async () => {
        await Activities.setActivity({
            name: name,
            location: location,
            description: description,
            start: startDate,
            end: endDate,
            id: activity?.id ?? uuid()
        });
        CalendarEvents.emit('eventsUpdated');
    }

    useEffect(() => {
        setEditActivity({
            name: name,
            location: location,
            description: description,
            start: startDate,
            end: endDate,
            id: activity?.id ?? uuid()
        });
    }, [name, location, description, startDate, endDate])

    const dialogClose = async () => {
        if (newActivity) {
            setName('');
            setLocation('');
            setDescription('');
            setStartDate(defaultStartTime);
            setSelectedStartDate(defaultStartTime);
            setSelectedStartTime(formatDateToTimeString(defaultStartTime));
            setEndDate(defaultEndTime);
            setSelectedEndDate(defaultEndTime);
            setSelectedEndTime(formatDateToTimeString(defaultEndTime))
        }
    }

    const onSelectStartDate: DatePickerProps["onSelectDate"] = (date) => {
        setSelectedStartDate(date);
        if (date && startDate) {
            setStartDate(
                new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    startDate.getHours(),
                    startDate.getMinutes()
                )
            );
        }
        if(selectedEndDate.getTime() < date?.getTime()) {
            setSelectedEndDate(date);
        }
    };

    const onStartTimeChange: TimePickerProps["onTimeChange"] = (_ev, data) => {
        if (data.errorType) {
            return;
        }
        setStartDate(data.selectedTime);
        setSelectedStartTime(data.selectedTimeText ?? "");
    };

    const onSelectEndDate: DatePickerProps["onSelectDate"] = (date) => {
        setSelectedEndDate(date);
        if (date && endDate) {
            setEndDate(
                new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    endDate.getHours(),
                    endDate.getMinutes()
                )
            );
        }
    };

    const onEndTimeChange: TimePickerProps["onTimeChange"] = (_ev, data) => {
        if (data.errorType) {
            return;
        }
        setEndDate(data.selectedTime);
        setSelectedEndTime(data.selectedTimeText ?? "");
    };

    let openButton = <Button appearance="transparent" icon={<EditRegular />} />;
    if (!activity) {
        openButton = <Button appearance="transparent" icon={<AddFilled />} />;
    }
    if (!adminMode) {
        return <></>;
    }
    return (
        <Dialog modalType="non-modal" onOpenChange={dialogClose}>
            <DialogTrigger disableButtonEnhancement>
                {openButton}
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{activity ? 'Edit activity' : 'New activity'}</DialogTitle>
                    <DialogContent>
                        <Field
                            label="Name"
                        >
                            <Input value={name} onChange={(_, data) => setName(data.value)} />
                        </Field>
                        <Field
                            label="Location"
                        >
                            <Input value={location} onChange={(_, data) => setLocation(data.value)} />
                        </Field>
                        <Field
                            label="Description"
                        >
                            <Textarea value={description} onChange={(_, data) => setDescription(data.value)} resize='vertical' />
                        </Field>
                        <div className={styles.root}>
                            <Field
                                label="Start date"
                            >
                                <DatePicker value={selectedStartDate} onSelectDate={onSelectStartDate} placeholder="Select a date..." />
                            </Field>
                            <Field label="Start time">
                                <TimePicker
                                    placeholder="Select a time..."
                                    freeform
                                    increment={15}
                                    dateAnchor={selectedStartDate}
                                    selectedTime={startDate}
                                    onTimeChange={onStartTimeChange}
                                    value={selectedStartTime}
                                />
                            </Field>
                        </div>
                        <div className={styles.root}>
                            <Field
                                label="End date"
                            >
                                <DatePicker value={selectedEndDate} onSelectDate={onSelectEndDate} placeholder="Select a date..." />
                            </Field>
                            <Field label="End time">
                                <TimePicker
                                    placeholder="Select a time..."
                                    freeform
                                    increment={15}
                                    dateAnchor={selectedEndDate}
                                    selectedTime={endDate}
                                    onTimeChange={onEndTimeChange}
                                    value={selectedEndTime}
                                />
                            </Field>
                        </div>
                        <ActivityCard activity={editActivity} demo={true} />
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="primary" icon={<SaveRegular />} onClick={saveActivity} >Save</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}