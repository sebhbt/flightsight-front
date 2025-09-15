import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule, } from '@angular/router';

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

interface Review {
  id: number;
  title: string;
  comment: string;
  rating: number;
  createdAt: string;
}

interface ReviewResponse {
  content: Review[];
  // Autres propriétés de pagination si nécessaire
}

@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.html',
  styleUrls: ['./flight-detail.css'],
  imports: [DatePipe, RouterModule, ReactiveFormsModule, CommonModule]
})
export class FlightDetailComponent implements OnInit {
  // This is needed for ngClass that does not recognize Math from js
  Math = Math;

  // Form to post a review
  reviewForm: FormGroup;

  // Signals for flight
  flight = signal<Flight | null>(null);
  loadingFlight = signal<boolean>(false);
  errorFlight = signal<string | null>(null);
  // Signals for review
  reviews = signal<Review[]>([]);
  loadingReviews = signal<boolean>(false);
  errorReviews = signal<string | null>(null);

  fullStars = signal<number>(0);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.reviewForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      comment: ['', [Validators.required, Validators.maxLength(2000)]],
      rating: [5, [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    this.fetchFlightDetails();
    this.fetchReviews();
    this.fullStars.set(this.reviewForm.get('rating')?.value / 2);
  }

  fetchFlightDetails(): void {
    this.loadingFlight.set(true);
    this.errorFlight.set(null);
    const flightId = this.route.snapshot.paramMap.get('id');
    this.http.get<Flight>(`/api/flights/${flightId}`).subscribe({
      next: (data) => {
        this.flight.set(data);
        this.loadingFlight.set(false);
      },
      error: (error) => {
        this.errorFlight.set("Impossible de charger les détails du vol.");
        this.loadingFlight.set(false);
        console.error('Erreur :', error);
      }
    });
  }

  fetchReviews(): void {
    this.loadingReviews.set(true);
    this.errorReviews.set(null);
    const flightId = this.route.snapshot.paramMap.get('id');
    this.http.get<ReviewResponse>(`/api/reviews/search?flightId=${flightId}`).subscribe({
      next: (response) => {
        this.reviews.set(response.content);
        this.loadingReviews.set(false);
      },
      error: (error) => {
        this.errorReviews.set("Impossible de charger les avis.");
        this.loadingReviews.set(false);
        console.error('Erreur :', error);
      }
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      const reviewData = {
        flightId: this.flight()?.flightId,
        ...this.reviewForm.value
      };
      this.http.post('/api/reviews', reviewData).subscribe({
        next: (response) => {
          this.reviewForm.reset({ title: '', comment: '', rating: 5 });
          this.fullStars.set(this.reviewForm.get('rating')?.value / 2);
          alert('Merci pour votre avis !');
          this.fetchReviews();
        },
        error: (error) => {
          console.error('Erreur lors de la soumission :', error);
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      });
    }
  }

  rate(starIndex: number): void {
    this.fullStars.set(starIndex);
    this.reviewForm.get('rating')?.setValue(starIndex * 2);
  }
}
