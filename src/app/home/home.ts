import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from '@angular/router';

interface Flight {
  flightId: number;
  flightNumber: string;
  airline: string;
  departureDatetime: string;
  arrivalDatetime: string;
  departureAirport: string;
  arrivalAirport: string;
  createdAt: string;
}

interface FlightResponse {
  content: Flight[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  // Signal flights, loading and errors
  flights = signal<Flight[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  searchQuery: string = '';
  searchField: string = 'flightNumber';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchFlights();
  }

  // Fetch flights
  fetchFlights(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<FlightResponse>('/api/flights/search').subscribe({
      next: (response) => {
        this.flights.set(response.content);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set("Impossible de charger les vols. Veuillez réessayer plus tard.");
        this.loading.set(false);
        console.error('Erreur :', error);
      }
    });
  }

  searchFlights() {
    console.log('Recherche:', this.searchQuery, 'dans le champ:', this.searchField);
    this.loading.set(true);
    this.error.set(null);
    this.http.get<FlightResponse>(`/api/flights/search?${this.searchField}=${this.searchQuery}`).subscribe({
      next: (response) => {
        this.flights.set(response.content);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set("Impossible de charger les vols. Veuillez réessayer plus tard.");
        this.loading.set(false);
        console.error('Erreur :', error);
      }
    });
  }

  goToFlightDetail(flightId: number): void {
    this.router.navigate(['/flights', flightId]);
  }
}
