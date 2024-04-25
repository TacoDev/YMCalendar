import { Button, CheckboxProps, Popover, PopoverProps, PopoverSurface, PopoverTrigger, Title3 } from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import { Activities } from "Activities";
import { CalendarEvents } from "CalendarEvents";
import React, { useEffect, useState } from "react";

export interface EditActivityProps {
    id?: string;
}

export default function DeleteActivity({ id }: EditActivityProps) {
    const [open, setOpen] = React.useState(false);
    const [adminMode, setAdminMode] = React.useState(false);

    useEffect(() => {
        return CalendarEvents.subscribe('adminMode', (isAdmin: boolean) => {
            setAdminMode(isAdmin);
        }, true);
    }, []);

    const handleOpenChange: PopoverProps["onOpenChange"] = (e, data) =>
        setOpen(data.open || false);

    async function deleteActivity(id: string) {
        await Activities.deleteActivity(id);
        CalendarEvents.emit('eventsUpdated');
    }


    if (!adminMode) {
        return <></>;
    }
    return (
        <Popover trapFocus withArrow onOpenChange={handleOpenChange} open={open}>
            <PopoverTrigger disableButtonEnhancement>
                <Button appearance="transparent" icon={<DeleteRegular />} />
            </PopoverTrigger>
            <PopoverSurface aria-labelledby={id}>
                <div>
                    <Title3>Delete activity</Title3>
                    <p>Are you sure you want to delete the activity?</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'end', gap: 10 }}>
                    <Button onClick={() => deleteActivity(id)}>Yes</Button>
                    <Button appearance='primary' onClick={() => setOpen(false)}>No</Button>
                </div>
            </PopoverSurface>
        </Popover>
    );
}