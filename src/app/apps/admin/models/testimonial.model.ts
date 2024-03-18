export interface Testimonial {
    id?: any,
    t_name: string,
    t_role: string,
    t_date: string,
    t_img: string,
    t_img_file?: any,
    t_msg: string,
    active_status?: string
}

export interface TestimonialModel2 {
    id?: number,
    t_name: string,
    t_role: string,
    t_date: string,
    t_img: string,
    t_msg: string,
    active_status?: string
}   

export class TestimonialModel3 {
    t_name!: string;
    t_role!: string;
    t_date!: string;
    t_img_file!: string;
    t_msg!: string;
    active_status!: string;

    constructor(t_name: string, t_role: string, t_date: string, t_img_file: string, t_msg: string, active_status: string) {
        this.t_name = t_name;
        this.t_role = t_role;
        this.t_date = t_date;
        this.t_img_file = t_img_file;
        this.t_msg = t_msg;
        this.active_status = active_status;
    }
}


export interface TestimonialGridModel {
    data: TestimonialModel2[],
    total: number
}