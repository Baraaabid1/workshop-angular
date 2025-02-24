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
  residenceList: any[] = []; // List of all residences

  constructor(
    private route: ActivatedRoute,  
    private router: Router,
    private residenceService: ResidenceService,
    private fb: FormBuilder
  ) {
    this.residenceForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      address: ['', Validators.required],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]],
      status: ['Disponible', Validators.required],
      apartments: this.fb.array([])
    });
  }

  ngOnInit() {
    this.residenceId = +this.route.snapshot.params['id']; // Convert ID to a number
  
    // Fetch all residences before doing anything
    this.residenceService.getResidences().subscribe({
      next: (data) => {
        this.residenceList = data; // Store the list of residences
        this.loadResidence(this.residenceId); // Load current residence based on ID
      },
      error: (err) => {
        console.error("Error fetching residences:", err);
      }
    });
  }

  loadResidence(id: number) {
    // Fetch the residence by ID
    const residence = this.residenceList.find(res => res.id == id);
    if (residence) {
      this.residenceForm.patchValue({
        id: residence.id,
        name: residence.name,
        address: residence.address,
        image: residence.image,
        status: residence.status
      });
      this.setApartments(residence.apartments || []);
    }
  }

  get apartments(): FormArray {
    return this.residenceForm.get('apartments') as FormArray;
  }

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
      const updatedResidence = {
        ...this.residenceForm.getRawValue(),
        id: this.residenceId
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
    const currentIndex = this.residenceList.findIndex(res => res.id === this.residenceId);
    if (currentIndex >= 0 && currentIndex < this.residenceList.length - 1) {
      const nextResidence = this.residenceList[currentIndex + 1];
      this.router.navigate(['/residence', nextResidence.id]); // Navigate to next residence
    } else {
      console.log('No next residence available.');
    }
  }
  
}
