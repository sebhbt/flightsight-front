import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { FlightDetailComponent } from './flight-detail/flight-detail';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'flights/:id', component: FlightDetailComponent }
];
