export interface AddTemplate {
    id?: number,
    Temp_name: string,
    Temp_alt_img: string,
    Temp_img: string,
    Temp_number: string,
    Temp_headers: string,
    active_status: string
}



export class AddTemplateMOdel2 {
    Temp_name!: string;
    Temp_img!:string;
    Temp_alt_img!:string;
    Temp_headers!:string;
   Temp_selected!: string;
    //Temp_number!: string;
   Temp_number!: string;
    active_status!: string;

    constructor(Temp_name:string,Temp_img:string, Temp_alt_img:string ,Temp_headers:string,  Temp_number: string, active_status: string) {
        this.Temp_name = Temp_name;
        this.Temp_img = Temp_img;
        this.Temp_alt_img = Temp_alt_img;
        this.Temp_headers = Temp_headers;
        this.Temp_number = Temp_number;

        // this.c_number = c_number;
        this.active_status = active_status;
    }
}


export interface TestimonialGridModel {
    data: AddTemplate[],
    total: number
}