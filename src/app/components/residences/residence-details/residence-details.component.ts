import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { ResidenceService } from 'src/app/core/Services/residence.service';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  ) {
    // Initialize form with default values
    this.residenceForm = this.fb.group({
      name: ['', Validators.required], // add validators
      location: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.residenceId = Number(this.route.snapshot.params['id']); // Ensure it's a number

    // Fetch the residence by ID and patch the form values
    this.residenceService.getResidenceById(this.residenceId).subscribe({
      next: (data) => {
        this.residence = data;
        this.residenceForm.patchValue(data); // Populate form with fetched data
      },
      error: (err) => {
        console.error("Error fetching residence:", err);
      }
    });
  }

  updateResidence() {
    if (this.residenceForm.valid) {
      this.residenceService.updateResidence(this.residenceId, this.residenceForm.value).subscribe({
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