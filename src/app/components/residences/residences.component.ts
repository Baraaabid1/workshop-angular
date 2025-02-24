import { Component } from '@angular/core';
import { Residence } from 'src/app/core/models/residence.model';
import { CommonService } from 'src/app/core/Services/common.service';
import { ResidenceService } from 'src/app/core/Services/residence.service';

@Component({
  selector: 'app-residences',
  templateUrl: './residences.component.html',
  styleUrls: ['./residences.component.css']
})
export class ResidencesComponent {
  searchTerm: string = '';

  listResidences: any[] = [];



  constructor(private residenceService: ResidenceService) {}

  ngOnInit() {
    this.residenceService.getResidences().subscribe(data => {
      console.log("Fetched residences:", data);  
      this.listResidences = data;
    }, error => {
      console.error("Error fetching residences:", error);
    });
  }


  showLocation(residence: Residence) {
    if (residence.address === "inconnu") {
      alert(`L'adresse de ${residence.name} est inconnue.`);
    } else {
      alert(`Adresse de ${residence.name}: ${residence.address}`);
    }
  }

  deleteResidence(id: number) {
    this.residenceService.deleteResidence(id).subscribe(() => {
      this.listResidences = this.listResidences.filter(r => r.id !== id);
    });
  }


  get filteredResidences() {
    return this.listResidences.filter(residence =>
      residence.address.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  likeResidence(residence: Residence) {
    alert(`${residence.name} ajouté aux favoris!`);
  }


  similarResidencesCount: number = 0;


  
}