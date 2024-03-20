import { Time } from "@angular/common";

export interface Variant {
    id?: number,
    group_id: string,
    Body_Text: string,
    selectedDate: Date,
    selectedTime: Time,
    // active_status: string;
    group_name:string,
    active_status: boolean;
}
