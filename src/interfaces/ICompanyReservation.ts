import ITime_slot from "./ITime_slot";

export default interface ICompanyReservation {
  id: number;
  time_slots: ITime_slot[];
}