export interface Testimonial {
    id?: any,
    t_name: string,
    t_role: string,
    t_date: string,
    t_membership:string,
    t_marriage:string,
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
    t_marriage:string,
    t_membership:string,
    t_img: string,
    t_msg: string,
    active_status?: string
}   

export class TestimonialModel3 {
    t_name!: string;
    t_role!: string;
    t_date!: string;
    t_marriage!: string;
    t_membership!:string;
    t_img_file!: string;
    t_msg!: string;
    active_status!: string;

    constructor(t_name: string, t_role: string, t_date: string,t_marriage:string, t_img_file: string, t_msg: string, active_status: string,t_membership:string) {
        this.t_name = t_name;
        this.t_role = t_role;
        this.t_date = t_date;
        this.t_marriage = t_marriage;
        this.t_membership= t_membership;
        this.t_img_file = t_img_file;
        this.t_msg = t_msg;
        this.active_status = active_status;
    }
}


export interface TestimonialGridModel {
    data: TestimonialModel2[],
    total: number
}