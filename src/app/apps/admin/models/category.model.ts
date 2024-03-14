export interface Category {
    id?: number,
    c_name: string,
    c_desc: string,
    unq_cat_name: string,
    supr_cat: string,
    active_status: string
}



export class CategoryMOdel2 {
    c_name!: string;
    c_desc!: string;
    unq_cat_name!: string;
    supr_cat!: string;
    active_status!: string;

    constructor(c_name: string, c_desc: string, unq_cat_name: string, supr_cat: string, active_status: string) {
        this.c_name = c_name;
        this.c_desc = c_desc;
        this.unq_cat_name = unq_cat_name;
        this.active_status = active_status;
    }
}


export interface TestimonialGridModel {
    data: Category[],
    total: number
}