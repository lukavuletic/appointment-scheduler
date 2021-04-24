import React from 'react';
import ICompany from '../models/ICompany';
import ITime_slot from '../models/ITime_slot';
import { CompanyName } from './CompanyName';
import { TimeSlot } from './TimeSlot';

interface Props {
    company: ICompany;
}

export const CompanyContainer: React.FC<Props> = ({ company }) => {
    console.log(company)
    return (
        <React.Fragment>
            <CompanyName name={company.name} />
            <TimeSlot timeSlot={company.selectedTimeSlot} title='Reservation' />
            {company.time_slots.map((timeSlot: ITime_slot, idx: number)=> {
                return (
                    <TimeSlot key={idx} timeSlot={timeSlot} />
                )
            })}
        </React.Fragment>
    )
}