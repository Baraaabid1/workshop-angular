import { Component } from '@angular/core';
import { Residence } from 'src/app/core/models/residence.model';

@Component({
  selector: 'app-residences',
  templateUrl: './residences.component.html',
  styleUrls: ['./residences.component.css']
})
export class ResidencesComponent {
  searchTerm: string = '';

  listResidences: Residence[] = [
    { id: 1, name: "El Fel", address: "Borj Cedria", image: "../../assets/images/R1.jpg", status: "Disponible" },
    { id: 2, name: "El Yasmine", address: "Ezzahra", image: "../../assets/images/R2.jpg", status: "Disponible" },
    { id: 3, name: "El Arij", address: "Rades", image: "../../assets/images/R3.jpeg", status: "Vendu" },
    { id: 4, name: "El Anber", address: "inconnu", image: "../../assets/images/R4.jpeg", status: "En Construction" }
  ];

  showLocation(residence: Residence) {
    if (residence.address === "inconnu") {
      alert(`L'adresse de ${residence.name} est inconnue.`);
    } else {
      alert(`Adresse de ${residence.name}: ${residence.address}`);
    }
  }


  get filteredResidences() {
    return this.listResidences.filter(residence =>
      residence.address.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  likeResidence(residence: Residence) {
    alert(`${residence.name} ajouté aux favoris!`);
  }
}