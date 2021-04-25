import ITime_slot from "./ITime_slot";

export default interface ICompany {    
  id: number;
  name: string;
  type: string;
  time_slot: ITime_slot;
}