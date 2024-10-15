import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable()
export class DynaFormService {

  ScheduleList!: FormGroup;


  constructor(
      private _fb: FormBuilder
  ) {}


  /**
   * 
   * Method for generating blank form
   * @param param 
   * @returns 
   */
  generateForm(param: any): FormArray {

    console.log("Called you")

    this.ScheduleList = this._fb.group({
        specs: new FormArray([])
    });    
    param.forEach((element: any, indx: number) => {
      this.specs.push(this.newSpecGroup());
      element['grp'].forEach((label: any, ind: number) => {
        this.getSpecGroup(indx).push(this.newSpecGrpItem());
      });
    });
    return this.ScheduleList.get('specs') as FormArray;
  }
  // entire specs array
  get specs(): FormArray {
    return this.ScheduleList.get("specs") as FormArray;
  }
  // one spec group - like Input Side
  newSpecGroup(): FormGroup {
    let fb!: FormGroup;
    fb = this._fb.group({
      grp: new FormArray([])
    })
    return fb;
  }
  // one item in a particular spec group - like Max. DC Input Power(kW) under Input Side
  newSpecGrpItem(): FormGroup {
    return this._fb.group({
      val: ['']
    });
  }
  // get a spec group
  getSpecGroup(index: number): FormArray {
    return this.specs.at(index).get("grp") as FormArray
  }



  /**
   * 
   * Method for generating blank form
   * @param param 
   * @param values 
   * @returns 
   */
  generateFormWithValues(param: any, values: any): FormArray {

    this.ScheduleList = this._fb.group({
        specs: new FormArray([])
    });

    console.log("Param and value: ", param, values);

    param.forEach((element: any, indx: number) => {
      this.specs.push(this.newSpecGroupWithValue());
      // console.log("value 1 for: ", values[indx])
      element['grp'].forEach((label: any, ind: number) => {
        // console.log("value 2 for: ", values[indx][ind])
        this.getSpecGroupWithValue(indx).push(this.newSpecGrpItemWithValue(values[indx][ind]['val']));
      });
    });
    return this.ScheduleList.get("specs") as FormArray;
  }
  // entire specs array
  get specsWithValue(): FormArray {
    return this.ScheduleList.get("specs") as FormArray;
  }
  // one spec group - like Input Side
  newSpecGroupWithValue(): FormGroup {
    let fb!: FormGroup;
    fb = this._fb.group({
      grp: new FormArray([])
    })
    return fb;
  }
  // one item in a particular spec group - like Max. DC Input Power(kW) under Input Side
  newSpecGrpItemWithValue(val: any): FormGroup {
    console.log("Value: ", val)
    return this._fb.group({
      val: new FormControl(val)
    });
  }
  // get a spec group
  getSpecGroupWithValue(index: number): FormArray {
    return this.specsWithValue.at(index).get("grp") as FormArray
  }

}