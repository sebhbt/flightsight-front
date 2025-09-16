# FlightsightFront

FlightsightFront is the website for the solution Flightsight.

On this website you can (for the moment):

* See the last 20 flights and search you're flight.
* See the review on a flight and add one 

## Frontend Architecture

### HTTP Communication with Backend

**Library**: Angular's `HttpClient` (from `@angular/common/http`)

**Key Features**:
- Used for all API calls to the backend APIs
- Handles:
  - GET/POST/PUT/DELETE requests
  - Request/response interception
  - Error handling
  - JSON data conversion

**Typical Implementation**:
```typescript
// Directly in the component for the moment and in a service in the future.
constructor(private http: HttpClient) {}

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
```

## UI Framework: Bootstrap 5

I used Bootstrap because it's easy to implement, fast and can be customized later on.

**Implementation**:
- Version: 5.3.8
- Integration: Via npm package (`bootstrap`)
- Usage: CSS classes

## Development server

To start a local development server, run:

```bash
ng serve
```

If you want to have access to Flightsight Back on local start with proxy

```bash
ng serve --proxy-config proxy.conf.json
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.
