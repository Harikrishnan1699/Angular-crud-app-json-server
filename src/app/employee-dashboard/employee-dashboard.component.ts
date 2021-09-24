import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EmployeeModel } from './employee-dashboard.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  formValue: FormGroup;
  employeeModelObj: EmployeeModel = new EmployeeModel();
  employeeData: any;
  showAdd!:boolean;
  showUpdate!:boolean;




  constructor(private fb: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.fb.group({
      firstname: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastname: new FormControl('', [Validators.maxLength(15), Validators.pattern("^[a-zA-Z]+$")]), 
      email: new FormControl('', [Validators.email, Validators.required]),
      mobile: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      salary: new FormControl('', [Validators.required, Validators.maxLength(7)])
    })

    this.getAllEmployee();
  }

clickAddEmployee(){
  this.formValue.reset();

  this.showAdd=true;
  this.showUpdate=false;
  
}


postEmployeeDetails() {
  if(this.formValue.valid){
    this.employeeModelObj.firstname = this.formValue.value.firstname;
    this.employeeModelObj.lastname = this.formValue.value.lastname;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;

    //const payload  = new EmployeeModel(this.formValue.getRawValue())

    this.api.postEmployee(this.employeeModelObj).subscribe(res => {
      console.log(res);

      alert('Successfully Added')
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllEmployee();
    },
      err => {
        alert('something went wrong')

      })
  }

 
}

  getAllEmployee() {
    this.api.getEmployee().subscribe(res => {
      this.employeeData = res;
    })
  }
  delEmployee(item: any) {
    this.api.deleteEmployee(item.id).subscribe(res => {
      alert('Successfully Deleted!')
      this.getAllEmployee();
    })
  }

onEdit(item:any){
  this.showAdd=false;
  this.showUpdate=true;
  

  this.employeeModelObj.id=item.id;
   this.formValue.controls['firstname'].setValue(item.firstname);
   this.formValue.controls['lastname'].setValue(item.lastname);
   this.formValue.controls['email'].setValue(item.email);
   this.formValue.controls['mobile'].setValue(item.mobile);
   this.formValue.controls['salary'].setValue(item.salary);
}

updateEmployeeDetails(){
  this.employeeModelObj.firstname = this.formValue.value.firstname;
    this.employeeModelObj.lastname = this.formValue.value.lastname;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;
    this.api.updateEmployee(this.employeeModelObj,this.employeeModelObj.id)
    .subscribe(res=>{
      alert("Successfully Updated")
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllEmployee();
    })

}


  getErrorMessage() {
    if (this.formValue.get('firstname').hasError('required')) {
      return 'You must enter a value';
    }
    return ""

  }
}
