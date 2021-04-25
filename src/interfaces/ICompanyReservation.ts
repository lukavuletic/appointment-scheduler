import { ITime_slot } from "./";

export default interface ICompanyReservation {
  id: number;
  time_slots: ITime_slot[];
}