import React from 'react';
import ITime_slot from '../interfaces/ITime_slot';
import { Input } from './Input';
import moment from 'moment';

const hourMinuteFormat = 'HH:mm';

interface Props {
    timeSlot: ITime_slot;
    title?: string;
}

export const TimeSlot: React.FC<Props> = ({ timeSlot, title }) => {
    return (
        <div className="timeslot">
            {title}
            <Input text={moment(timeSlot.start_time).format(hourMinuteFormat)} readOnly={true} />
            <Input text={moment(timeSlot.end_time).format(hourMinuteFormat)} readOnly={true} />
        </div>
    )
}