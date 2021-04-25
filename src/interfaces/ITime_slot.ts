export default interface ITime_slot {
    start_time: string;
    end_time: string;
    isSelected?: boolean;
    isTakenUnderOtherCompany?: boolean;
    ordinal?: number;
}