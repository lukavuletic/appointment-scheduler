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
  const [companyReservations, setStateCompanyReservations] = useState<ICompanyReservation[]>([]);

  useEffect(() => {
    const fetchCompanies = async (): Promise<void> => {
      const companiesRes: ICompany[] = await getCompanies();
      const companyReservationsArr: ICompanyReservation[] = companiesRes.map(c => {
        return {
          id: c.id,
          time_slots: [],
        }
      });

      setStateCompanies(companiesRes);
      setStateCompanyReservations(companyReservationsArr);
    }

    fetchCompanies();
  }, []);

  const getCompanies = async (): Promise<ICompany[]> => {
    const res: ICompany[] = await companiesCoreService.get();
    return res.map(company => {
      return {
        ...company,
        time_slots: company.time_slots.map((time_slot, idx) => {
          return {
            ...time_slot,
            isSelected: false,
            ordinal: idx,
          }
        }),
      }
    });
  }

  const getUpdatedTimeSlots = (dataArr: ITime_slot[], ordinalsToUpdate: number[]): ITime_slot[] => {
    return dataArr.map(item => {
      return {
        ...item,
        isSelected: ordinalsToUpdate.includes(item.ordinal!)
      }
    });
  }

  const selectTimeSlot: (company: ICompany, timeSlot: ITime_slot) => void = (company, timeSlot) => {
    const companyReservation: ICompanyReservation = companyReservations.find(({ id }) => id === company.id)!;
    let timeSlotsToMatch: ITime_slot[] = [];

    // update selected timeslots
    if (companyReservation.time_slots.length === 0) {
      timeSlotsToMatch.push(timeSlot);
    } else if (!timeSlot.isSelected) { // is not selected, therefore we want to add some timeslots
      const startOrdinal: number = Math.min(timeSlot.ordinal!, ...companyReservation.time_slots.map(({ ordinal }) => ordinal!));
      const endOrdinal: number = Math.max(timeSlot.ordinal!, ...companyReservation.time_slots.map(({ ordinal }) => ordinal!));

      timeSlotsToMatch = company.time_slots.slice(startOrdinal, endOrdinal + 1);
    } else if (timeSlot.isSelected && timeSlot.start_time === companyReservation.time_slots[0].start_time) {
      timeSlotsToMatch = companyReservation.time_slots.slice(1);
    } else if (timeSlot.isSelected && timeSlot.end_time === companyReservation.time_slots[companyReservation.time_slots.length - 1].end_time) {
      timeSlotsToMatch = companyReservation.time_slots.slice(0, companyReservation.time_slots.length - 1);
    } else if (timeSlot.isSelected) { // is selected, therefore we want to remove some timeslots
      const startOrdinal: number = Math.min(...companyReservation.time_slots.map(({ ordinal }) => ordinal!));
      const endingOrdinal: number = (timeSlot.ordinal! > startOrdinal) ? timeSlot.ordinal! : startOrdinal;

      timeSlotsToMatch = company.time_slots.slice(startOrdinal, endingOrdinal + 1);
    }

    // update isSelected on company and on selected time slots
    const selectedOrdinals: number[] = timeSlotsToMatch.map(({ ordinal }) => { return ordinal! });

    const updatedCompanyReservation: ICompanyReservation = {
      ...companyReservation,
      time_slots: getUpdatedTimeSlots(timeSlotsToMatch, selectedOrdinals),
    }
    const updatedCompanyReservationIdx: number = companyReservations.findIndex(({ id }) => id === companyReservation.id);
    let updatedCompanyReservations: ICompanyReservation[] = companyReservations.slice();
    updatedCompanyReservations[updatedCompanyReservationIdx] = updatedCompanyReservation;

    const updatedCompany: ICompany = {
      ...company,
      time_slots: getUpdatedTimeSlots(company.time_slots, selectedOrdinals),
    };
    const updatedCompanyIdx: number = companies.findIndex(({ id }) => id === company.id);
    let updatedCompanies: ICompany[] = companies.slice();
    updatedCompanies[updatedCompanyIdx] = updatedCompany;

    setStateCompanies(updatedCompanies);
    setStateCompanyReservations(updatedCompanyReservations);
  }

  return (
    <div className="container">
      {companies.map(company => {
        return (
          <CompanyContainer
            key={company.id}
            company={company}
            companyReservation={companyReservations.find(({ id }) => id === company.id)}
            selectTimeSlot={selectTimeSlot}
          />
        )
      })}
    </div>
  );
}

export default App;