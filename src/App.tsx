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

  const getUpdatedTimeSlotsUnderSameCompany = (dataArr: ITime_slot[], ordinalsToUpdate: number[]): ITime_slot[] => {
    return dataArr.map(item => {
      return {
        ...item,
        isSelected: ordinalsToUpdate.includes(item.ordinal!),
      }
    });
  }

  const selectTimeSlot: (company: ICompany, timeSlot: ITime_slot) => void = (company, timeSlot) => {
    const companyReservation: ICompanyReservation = companyReservations.find(({ id }) => id === company.id)!;
    let timeSlotsToMatch: ITime_slot[] = [];

    // TODO - prevent selection on select of [c:ts]3-1:3-4 combination while [c:ts]1-2:1-3 combination exists
    // TODO - prevent add of another day
    // update selected timeslots
    if (companyReservation.time_slots.length === 0) {
      timeSlotsToMatch.push(timeSlot);
    } else if (!timeSlot.isSelected) { // is not selected, therefore we want to add some timeslots
      const startOrdinal: number = Math.min(timeSlot.ordinal!, ...companyReservation.time_slots.map(({ ordinal }) => ordinal!));
      const endOrdinal: number = Math.max(timeSlot.ordinal!, ...companyReservation.time_slots.map(({ ordinal }) => ordinal!));

      timeSlotsToMatch = company.time_slots.slice(startOrdinal, endOrdinal + 1);
    } else if (timeSlot.isSelected && timeSlot.start_time === companyReservation.time_slots[0].start_time) { // selecting first should remove it
      timeSlotsToMatch = companyReservation.time_slots.slice(1);
    } else if (timeSlot.isSelected && timeSlot.end_time === companyReservation.time_slots[companyReservation.time_slots.length - 1].end_time) { // selecting last should remove it
      timeSlotsToMatch = companyReservation.time_slots.slice(0, companyReservation.time_slots.length - 1);
    } else if (timeSlot.isSelected) { // is selected, therefore we want to remove some timeslots
      const startOrdinal: number = Math.min(...companyReservation.time_slots.map(({ ordinal }) => ordinal!));
      const endingOrdinal: number = (timeSlot.ordinal! > startOrdinal) ? timeSlot.ordinal! : startOrdinal;

      timeSlotsToMatch = company.time_slots.slice(startOrdinal, endingOrdinal + 1);
    }

    const selectedOrdinals: number[] = timeSlotsToMatch.map(({ ordinal }) => { return ordinal! });

    // update isSelected on company and on selected time slots
    const updatedCompanyReservation: ICompanyReservation = {
      ...companyReservation,
      time_slots: getUpdatedTimeSlotsUnderSameCompany(timeSlotsToMatch, selectedOrdinals),
    }
    const updatedCompanyReservationIdx: number = companyReservations.findIndex(({ id }) => id === companyReservation.id);
    let updatedCompanyReservations: ICompanyReservation[] = companyReservations.slice();
    updatedCompanyReservations[updatedCompanyReservationIdx] = updatedCompanyReservation;

    const updatedCompany: ICompany = {
      ...company,
      time_slots: getUpdatedTimeSlotsUnderSameCompany(company.time_slots, selectedOrdinals),
    };
    const updatedCompanyIdx: number = companies.findIndex(({ id }) => id === company.id);
    let updatedCompanies: ICompany[] = companies.slice();
    updatedCompanies[updatedCompanyIdx] = updatedCompany;

    // check whether selected timeslot is already selected by any other company
    // TODO - update isTakenUnderOtherCompany on unselect of already selected timeslot
    const selectedTimeSlotIsSelectedOfOtherCompanies: boolean[] = updatedCompanies.map(c => {
      // skip checking for the same company
      if (c.id === company.id) {
        return false;
      } else {
        const cTS = c.time_slots.find(({ ordinal }) => { return ordinal === timeSlot.ordinal })!.isSelected!;
        return cTS;
      }
    });
    const isTimeSlotTakenUnderOtherCompany: boolean = selectedTimeSlotIsSelectedOfOtherCompanies.some(i => i === true);
  
    // update isTakenUnderOtherCompany on all other companies
    updatedCompanies = updatedCompanies.map(c => {
      // don't touch already updated company
      if (c.id === company.id) {
        return c;
      } else {
        return {
          ...c,
          time_slots: c.time_slots.map(ts => {
            return {
              ...ts,
              isTakenUnderOtherCompany: selectedOrdinals.includes(ts.ordinal!) || isTimeSlotTakenUnderOtherCompany || ts.isTakenUnderOtherCompany,
            }
          }),
        }
      }
    });

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