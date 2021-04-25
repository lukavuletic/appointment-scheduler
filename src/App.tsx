import './App.css';
import React, { useState, useEffect } from 'react';
import CoreService from './core/CoreService';
import { CompanyContainer } from './components/CompanyContainer';
import ICompany from './interfaces/ICompany';
import ICompanyReservation from './interfaces/ICompanyReservation';
import ITime_slot from './interfaces/ITime_slot';

function App() {
  const companiesCoreService = new CoreService('companies');

  const [companies, setStateCompanies] = useState<ICompany[]>([]);
  const [companyReservation, setStateCompanyReservation] = useState<ICompanyReservation>({
    id: 0,
    name: '',
    type: '',
    time_slot: {
      start_time: '',
      end_time: '',
    }
  });

  useEffect(() => {
    const fetchCompanies = async (): Promise<void> => {
      const companiesRes: ICompany[] = await getCompanies();
      setStateCompanies(companiesRes);
    }

    fetchCompanies();
  }, []);

  const getCompanies = async (): Promise<ICompany[]> => {
    const res: ICompany[] = await companiesCoreService.get();
    return res;
  }

  const getCompany = async (id: number): Promise<ICompany> => {
    const res: ICompany = await companiesCoreService.find(id);
    return res;
  }

  const selectTimeSlot: (company: ICompany, timeSlot: ITime_slot) => void = (company, timeSlot) => {
    const { time_slots, ...otherProps } = company;
    const companyReservationStartTime: string = companyReservation.time_slot.start_time;
    const companyReservationEndTime: string = companyReservation.time_slot.end_time;

    let timeSlotFinal: ITime_slot = {
      start_time: '',
      end_time: '',
    };

    if (companyReservationStartTime !== '' && companyReservationEndTime !== '') {
      if (companyReservationStartTime === timeSlot.start_time) { // once again selected same timeslot; not cast into Date because of ms
        timeSlotFinal.start_time = companyReservationStartTime;
        timeSlotFinal.end_time = timeSlot.end_time;
      } else if (new Date(companyReservationStartTime) < new Date(timeSlot.start_time) // shorten reservation time
        && new Date(companyReservationEndTime) < new Date(timeSlot.end_time)
      ) {
        timeSlotFinal.start_time = companyReservationStartTime;
        timeSlotFinal.end_time = timeSlot.end_time;
      } else if (new Date(companyReservationStartTime) > new Date(timeSlot.start_time) // lenghten reservation time
        && new Date(companyReservationEndTime) > new Date(timeSlot.end_time)
      ) {
        timeSlotFinal.start_time = timeSlot.start_time;
        timeSlotFinal.end_time = companyReservationEndTime;
      } else if (new Date(companyReservationStartTime) < new Date(timeSlot.start_time)
        && new Date(companyReservationEndTime) > new Date(timeSlot.end_time)
      ) {
        timeSlotFinal.start_time = companyReservationStartTime;
        timeSlotFinal.end_time = timeSlot.end_time;
      } else if (new Date(companyReservationStartTime) > new Date(timeSlot.start_time)
        && new Date(companyReservationEndTime) < new Date(timeSlot.end_time)
      ) {
        timeSlotFinal.start_time = timeSlot.start_time;
        timeSlotFinal.end_time = companyReservationEndTime;
      } else {
        return;
      }
    } else {
      timeSlotFinal = timeSlot;
    }

    setStateCompanyReservation({ ...otherProps, time_slot: timeSlotFinal });
  }

  return (
    <div className="container">
      {companies.map(company => {
        return (
          <CompanyContainer
            key={company.id}
            company={company}
            companyReservation={companyReservation}
            selectTimeSlot={selectTimeSlot}
          />
        )
      })}
    </div>
  );
}

export default App;