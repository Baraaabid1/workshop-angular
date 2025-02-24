import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';



@Component({
  selector: 'app-add-apartment',
  templateUrl: './add-apartment.component.html',
  styleUrls: ['./add-apartment.component.css']
})
export class AddApartmentComponent {
  apartmentForm: FormGroup;
  newApart: any = null;


  constructor(private fb: FormBuilder) {
    this.apartmentForm = this.fb.group({
      apartmentNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      floorNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      surface: ['', [Validators.required, Validators.min(1)]],
      terrace: [false, Validators.required], // Changed 'yes' to boolean
      surfaceTerrace: [{ value: '', disabled: true }, [Validators.pattern('^[0-9]+$')]],
      category: ['S+1', Validators.required],
      residenceId: ['', Validators.required],
      apartments: this.fb.array([]) // Added FormArray for managing multiple apartments
    });

    // Enable or disable 'surfaceTerrace' based on 'terrace' value
    this.apartmentForm.get('terrace')?.valueChanges.subscribe(value => {
      if (value) {
        this.apartmentForm.get('surfaceTerrace')?.setValidators([Validators.required, Validators.min(1)]);
        this.apartmentForm.get('surfaceTerrace')?.enable();
      } else {
        this.apartmentForm.get('surfaceTerrace')?.clearValidators();
        this.apartmentForm.get('surfaceTerrace')?.reset();
        this.apartmentForm.get('surfaceTerrace')?.disable();
      }
      this.apartmentForm.get('surfaceTerrace')?.updateValueAndValidity();
    });
  }

  get apartments(): FormArray {
    return this.apartmentForm.get('apartments') as FormArray;
  }

  addApartment() {
    const apartmentGroup = this.fb.group({
      apartmentNumber: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      floorNumber: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      terrace: [false],
      surfaceTerrace: [{ value: '', disabled: true }, Validators.pattern("^[0-9]+$")]
    });

    // Enable Surface Terrace if Terrace is checked
    apartmentGroup.get('terrace')?.valueChanges.subscribe(value => {
      if (value) {
        apartmentGroup.get('surfaceTerrace')?.enable();
      } else {
        apartmentGroup.get('surfaceTerrace')?.disable();
        apartmentGroup.get('surfaceTerrace')?.reset();
      }
    });

    this.apartments.push(apartmentGroup);
  }

  removeApartment(index: number) {
    this.apartments.removeAt(index);
  }
}