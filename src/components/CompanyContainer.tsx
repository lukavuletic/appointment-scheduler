import React from 'react';
import ICompany from '../interfaces/ICompany';
import ITime_slot from '../interfaces/ITime_slot';
import ICompanyReservation from '../interfaces/ICompanyReservation';
import { CompanyName } from './CompanyName';
import { TimeSlot } from './TimeSlot';

interface Props {
    company: ICompany;
    companyReservation: ICompanyReservation;
}

export const CompanyContainer: React.FC<Props> = ({ company, companyReservation }) => {
    console.log(company)
    return (
        <React.Fragment>
            <CompanyName name={company.name} />
            <TimeSlot timeSlot={companyReservation.time_slot} title='Reservation' />
            {company.time_slots.map((timeSlot: ITime_slot, idx: number)=> {
                return (
                    <TimeSlot key={idx} timeSlot={timeSlot} />
                )
            })}
        </React.Fragment>
    )
}