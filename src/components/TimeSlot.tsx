import React from 'react';
import ITime_slot from '../interfaces/ITime_slot';
import { Input } from './Input';
import moment from 'moment';

const hourMinuteFormat = 'HH:mm';
const selectDateText = 'Please select a date'

interface Props {
    timeSlot: ITime_slot;
    title?: string;
}

export const TimeSlot: React.FC<Props> = ({ timeSlot, title }) => {
    return (
        <div className={timeSlot.isSelected ? 'timeslot-selected' : ''}>
            {title &&
                <div className="title">
                    {title} < br />
                </div>
            }
            <Input
                text={timeSlot.start_time !== '' ? moment(timeSlot.start_time).format(hourMinuteFormat) : selectDateText}
                readOnly={true}
            />
            <Input
                text={timeSlot.end_time !== '' ? moment(timeSlot.end_time).format(hourMinuteFormat) : selectDateText}
                readOnly={true}
            />
        </div>
    )
}