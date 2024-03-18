export interface Category {
    id?: number,
    c_name: string,
    c_desc: string,
    // c_number: string,
    c_number: string,
    c_selected: string,
    active_status: string
}



export class CategoryMOdel2 {
    c_name!: string;
    c_desc!: string;
    c_selected!: string;
    // c_number!: string;
    c_number!: string;
    active_status!: string;

    constructor(c_name: string,c_selected: string, c_desc: string,  c_number: string, active_status: string) {
        this.c_name = c_name;
        this.c_desc = c_desc;
        this.c_selected = c_selected;
        // this.c_number = c_number;
        this.active_status = active_status;
    }
}


export interface TestimonialGridModel {
    data: Category[],
    total: number
}