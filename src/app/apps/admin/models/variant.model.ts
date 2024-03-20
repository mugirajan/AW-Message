import { Time } from "@angular/common";

export interface Variant {
    id?: number,
    g_name: string,
    Body_Text: string,
    selectedDate: Date,
    selectedTime: Time,
    active_status: string;
}
