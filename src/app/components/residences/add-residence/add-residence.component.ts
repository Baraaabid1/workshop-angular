import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ResidenceService } from 'src/app/core/Services/residence.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-residence',
  templateUrl: './add-residence.component.html',
  styleUrls: ['./add-residence.component.css']
})
export class AddResidenceComponent {
residenceForm: FormGroup;

constructor(private fb: FormBuilder, private residenceService: ResidenceService, private router: Router) {
  this.residenceForm = this.fb.group({
    id: [''], // Hidden ID field
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', Validators.required],
    image: ['', [Validators.required, Validators.pattern('https?://.+')]], // URL validation
    status: ['Disponible', Validators.required], // Default: Disponible
    apartments: this.fb.array([]) // Apartment list
  });
}
get apartments(): FormArray {
  return this.residenceForm.get('apartments') as FormArray;
}

addApartment() {
  const apartmentGroup = this.fb.group({
    apartmentNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    floorNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    surface: ['', [Validators.required, Validators.min(1)]],
    terrace: [false], // Checkbox (boolean)
    surfaceTerrace: [{ value: '', disabled: true }, Validators.pattern('^[0-9]+$')],
    category: ['S+1', Validators.required]
  });

  // Enable/Disable 'surfaceTerrace' based on 'terrace' checkbox
  apartmentGroup.get('terrace')?.valueChanges.subscribe(value => {
    if (value) {
      apartmentGroup.get('surfaceTerrace')?.enable();
      apartmentGroup.get('surfaceTerrace')?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      apartmentGroup.get('surfaceTerrace')?.disable();
      apartmentGroup.get('surfaceTerrace')?.clearValidators();
      apartmentGroup.get('surfaceTerrace')?.reset();
    }
    apartmentGroup.get('surfaceTerrace')?.updateValueAndValidity();
  });

  this.apartments.push(apartmentGroup);
}

removeApartment(index: number) {
  this.apartments.removeAt(index);
}

onSubmit() {
  if (this.residenceForm.valid) {
    let formData = this.residenceForm.value;

    // Remove the ID so JSON Server can auto-generate it
    delete formData.id;

    console.log("Submitting Residence:", formData);

    this.residenceService.addResidence(formData).subscribe((response) => {
      console.log("Residence Added:", response);
      this.router.navigate(['/residences']); // Redirect to residence list
    });
  } else {
    console.log("Form Invalid:", this.residenceForm.errors);
  }
}
}