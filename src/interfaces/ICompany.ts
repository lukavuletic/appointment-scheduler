import { ITime_slot } from "./";

export default interface ICompany {
  id: number;
  name: string;
  type: string;
  time_slots: ITime_slot[];
}