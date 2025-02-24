import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResidenceService } from 'src/app/core/Services/residence.service';

@Component({
  selector: 'app-apartments-by-residence',
  templateUrl: './apartments-by-residence.component.html',
  styleUrls: ['./apartments-by-residence.component.css']
})
export class ApartmentsByResidenceComponent {
  residenceId: number | null = null; 
  apartments: any[] = [];  

  constructor(
    private route: ActivatedRoute, 
    private residenceService: ResidenceService  
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');  

    if (id) {
      this.residenceId = +id;  
      this.residenceService.getApartmentsByResidenceId(this.residenceId).subscribe((data) => {
        this.apartments = data; 
      });
    }
  }
}