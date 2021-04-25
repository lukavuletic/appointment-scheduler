import React from 'react';
import ICompany from '../interfaces/ICompany';
import ITime_slot from '../interfaces/ITime_slot';
import ICompanyReservation from '../interfaces/ICompanyReservation';
import { CompanyName } from './CompanyName';
import { TimeSlot } from './TimeSlot';
import moment from 'moment';

interface Props {
    company: ICompany;
    companyReservation?: ICompanyReservation;
    selectTimeSlot: (company: ICompany, timeSlot: ITime_slot) => void;
}

export const CompanyContainer: React.FC<Props> = ({ company, companyReservation, selectTimeSlot }) => {
    return (
        <div className="container-wrapper">
            <CompanyName name={company.name} />
            {companyReservation &&
                <span>
                    <TimeSlot
                        timeSlot={{
                            start_time: (companyReservation.time_slots[0] && companyReservation.time_slots[0].start_time) || '',
                            end_time: (companyReservation.time_slots[0] && companyReservation.time_slots[companyReservation.time_slots.length - 1].end_time) || '',
                        }}
                        title='Reservation'
                    />
                    <hr />
                </span>
            }
            {company.time_slots.map((timeSlot: ITime_slot, idx: number) => {
                const dayOfCurrentSlot: number = company.time_slots[idx - 1] ? moment(company.time_slots[idx - 1].start_time).dayOfYear() : moment(company.time_slots[idx].start_time).dayOfYear();
                const dayOfOncomingSlot: number = moment(company.time_slots[idx].start_time).dayOfYear();
                let shouldRenderDay: boolean = false;
                if ((dayOfCurrentSlot !== dayOfOncomingSlot) || (idx === 0)) {
                    shouldRenderDay = true;
                }
                const dayToRender: string = moment(company.time_slots[idx].start_time).format('dddd');
                return (
                    <div key={idx}>
                        {shouldRenderDay &&
                            <h1>{dayToRender}</h1>
                        }
                        <div
                            className={`timeslot ${(timeSlot.isTakenUnderOtherCompany && ' timeslot-disabled')}`}
                            onClick={() => selectTimeSlot && !timeSlot.isTakenUnderOtherCompany && selectTimeSlot(company, timeSlot)}
                        >
                            <TimeSlot
                                timeSlot={timeSlot}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}