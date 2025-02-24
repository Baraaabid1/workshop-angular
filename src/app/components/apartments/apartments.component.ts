import { Component } from '@angular/core';
import { CommonService } from 'src/app/core/Services/common.service';


@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.css']
})
export class ApartmentsComponent {
  listApartments: any[] = [];
  similarApartmentsCount: number = 0;

  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.fetchApartments();
  }

  fetchApartments() {
    this.commonService.getApartments().subscribe(
      (data) => {
        this.listApartments = data;
        this.similarApartmentsCount = this.commonService.getSameValueOf(this.listApartments, 'surface', 50);
      },
      (error) => {
        console.error('Error fetching apartments:', error);
      }
    );
  }
}