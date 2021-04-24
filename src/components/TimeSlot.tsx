import React from 'react';
import ITime_slot from '../models/ITime_slot';
import { Input } from './Input';

interface Props {
    timeSlot: ITime_slot;
    title?: string;
}

export const TimeSlot: React.FC<Props> = ({ timeSlot, title }) => {
    return (
        <React.Fragment>
            {title}
            <Input text={timeSlot.start_time} readOnly={true} />
            <Input text={timeSlot.end_time} readOnly={true} />
        </React.Fragment>
    )
}