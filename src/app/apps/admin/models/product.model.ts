export interface Product {
    id?: number,
    
    p_uni_code: string,
    p_name: string,
    p_shrt_desc: string,
    p_desc: string,
    p_category: string,
    p_kypts: string,
    
    p_ftd_img: string,
    p_ftd_img_file: File | null,
    
    p_img: string,
    p_img_file: File[],
    
    p_catlog: string,
    // p_catlog_file: File | null,
    
    p_datasheet: string,
    // p_datasheet_file: File | null,

    files: File[],
    
    is_ft_prod: string,
    active_status: string,
    catlogue_status: string,
    datasheet_status: string,
    prod_order: number
}

export interface ProductModel2 {
    id?: number,
    p_uni_code: string,
    p_name: string,
    p_shrt_desc: string,
    p_desc: string,
    p_category: string,
    p_ftd_img: string,
    p_kypts: string,
    p_img: string,
    p_catlog: string,
    p_datasheet: string,
    // files: File[],
    is_ft_prod: string,
    active_status: string,
    catlogue_status:string,
    datasheet_status: string,
    prod_order: number
}   

export class ProductModel3 {
    id?: number;
    p_uni_code!: string;
    p_name!: string;
    p_shrt_desc!: string;
    p_desc!: string;
    p_category!: string;
    p_ftd_img!: string;
    p_kypts!: string;
    p_img!: string;
    p_catlog!: string;
    p_datasheet!: string;
    is_ft_prod!: string;
    active_status!: string;
    catlogue_status!: string;
    datasheet_status!: string;
    prod_order!: number;

    constructor(p_uni_code: string, p_name: string, p_shrt_desc: string, p_desc: string, p_category: string,
    p_ftd_img:string, p_kypts: string, p_img:string, p_catlog:string, p_datasheet: string, is_ft_prod:string,active_status: string, catlogue_status: string, datasheet_status: string, prod_order: number) {
        this.p_uni_code = p_uni_code;
        this.p_name = p_name;
        this.p_shrt_desc = p_shrt_desc;
        this.p_desc = p_desc;
        this.p_category = p_category;
        this.p_ftd_img = p_ftd_img;
        this.p_kypts = p_kypts;
        this.p_img = p_img;
        this.p_catlog = p_catlog;
        this.p_datasheet = p_datasheet;
        this.is_ft_prod = is_ft_prod;
        this.active_status = active_status;
        this.catlogue_status =  catlogue_status;
        this.datasheet_status = datasheet_status;
        this.prod_order = prod_order;
    }
}


export interface ProductGridModel {
    data: ProductModel2[],
    total: number
}