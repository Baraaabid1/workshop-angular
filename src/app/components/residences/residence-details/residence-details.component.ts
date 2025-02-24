import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { ResidenceService } from 'src/app/core/Services/residence.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-residence-details',
  templateUrl: './residence-details.component.html',
  styleUrls: ['./residence-details.component.css']
})
export class ResidenceDetailsComponent implements OnInit {
  residenceForm: FormGroup;
  residenceId!: number;
  residence: any;

  constructor(
    private route: ActivatedRoute,  
    private router: Router,
    private residenceService: ResidenceService,
    private fb: FormBuilder
  ) { // Initialize form with empty/default values
    this.residenceForm = this.fb.group({
      id: [{ value: '', disabled: true }], // ID should be readonly
      name: ['', Validators.required],
      address: ['', Validators.required],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]],
      status: ['Disponible', Validators.required],
      apartments: this.fb.array([]) // Empty list initially
    });}

  ngOnInit() {
    this.residenceId = Number(this.route.snapshot.params['id']);

    // Initialize form with all necessary fields
    this.residenceForm = this.fb.group({
      id: [{ value: '', disabled: true }], // ID should not be editable
      name: ['', Validators.required],
      address: ['', Validators.required],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]],
      status: ['Disponible', Validators.required],
      apartments: this.fb.array([]) // Dynamic list of apartments
    });

    // Fetch residence details and populate the form
    this.residenceService.getResidenceById(this.residenceId).subscribe({
      next: (data) => {
        this.residenceForm.patchValue({
          id: data.id,
          name: data.name,
          address: data.address,
          image: data.image,
          status: data.status
        });

        // Populate apartments array
        this.setApartments(data.apartments || []);

        this.residenceForm.updateValueAndValidity(); // Update form state
      },
      error: (err) => {
        console.error("Error fetching residence:", err);
      }
    });
  }

  // Getter for apartments FormArray
  get apartments(): FormArray {
    return this.residenceForm.get('apartments') as FormArray;
  }

  // Populate apartments
  setApartments(apartments: any[]) {
    this.apartments.clear();
    apartments.forEach(apartment => {
      this.apartments.push(this.fb.group({
        apartmentNumber: [apartment.apartmentNumber, [Validators.required, Validators.pattern('^[0-9]+$')]],
        floorNumber: [apartment.floorNumber, [Validators.required, Validators.pattern('^[0-9]+$')]],
        surface: [apartment.surface, [Validators.required, Validators.min(1)]],
        terrace: [apartment.terrace],
        surfaceTerrace: [{ value: apartment.surfaceTerrace || '', disabled: !apartment.terrace }, Validators.pattern('^[0-9]+$')],
        category: [apartment.category, Validators.required]
      }));
    });
  }

  updateResidence() {
    if (this.residenceForm.valid) {
      // Prepare updated data (enable ID field temporarily)
      const updatedResidence = {
        ...this.residenceForm.getRawValue(),
        id: this.residenceId // Ensure ID is included
      };

      this.residenceService.updateResidence(this.residenceId, updatedResidence).subscribe({
        next: () => {
          this.router.navigate(['/residences']); 
        },
        error: (err) => {
          console.error("Error updating residence:", err);
        }
      });
    }
  }

  nextResidence() {
    this.residenceId++;
    this.router.navigate(['/residence', this.residenceId]); 
  }
}