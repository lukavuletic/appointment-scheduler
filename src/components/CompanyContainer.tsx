import React from 'react';
import ICompany from '../interfaces/ICompany';
import ITime_slot from '../interfaces/ITime_slot';
import ICompanyReservation from '../interfaces/ICompanyReservation';
import { CompanyName } from './CompanyName';
import { TimeSlot } from './TimeSlot';

interface Props {
    company: ICompany;
    companyReservation: ICompanyReservation;
    selectTimeSlot: (company: ICompany, timeSlot: ITime_slot) => void;
}

export const CompanyContainer: React.FC<Props> = ({ company, companyReservation, selectTimeSlot }) => {
    console.log(company)
    return (
        <div className="container-wrapper">
            <CompanyName name={company.name} />
            <TimeSlot timeSlot={companyReservation.time_slot} title='Reservation' />
            {company.time_slots.map((timeSlot: ITime_slot, idx: number) => {
                return (
                    <div
                        className="timeslot"
                        onClick={() => selectTimeSlot && selectTimeSlot(company, timeSlot)}
                    >
                        <TimeSlot
                            key={idx}
                            timeSlot={timeSlot}
                        />
                    </div>
                )
            })}
        </div>
    )
}