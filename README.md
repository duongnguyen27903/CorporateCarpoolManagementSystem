# CorporateCarpoolManagementSystem

A full-stack enterprise carpooling platform designed to connect employees for shared rides, reduce carbon footprint, and optimize corporate commute routes. The platform uses **Uber H3 spatial indexing** and the **Google Encoded Polyline Algorithm** to efficiently match drivers and passengers based on spatial proximity and route alignment.

---

## 🚀 Key Features

* **Smart Route & Location Matching**:
* **Uber H3 Indexing**: Converts geographical coordinates into hexagonal spatial grids to quickly identify nearby pickup and drop-off points.
* **Google Encoded Polyline Algorithm**: Compresses and decodes route paths to calculate route overlap and proximity between passenger requests and driver routes.
* **Map and Location searching**: Use Leaflet library to display map and Open Street Map Nominatim API for location searching.

* **Trip & Booking Management**: Create, schedule, search, and manage carpool trips and ride requests across sprints/teams.
* **Cost & Transaction Tracking**: Automatic cost-sharing calculation and transaction history for corporate commuting.
* **Interactive UI**: Modern, responsive user interface with map integration for route visualization and location search optimization.

---

## 🛠️ Tech Stack

* **Frontend**: TypeScript, Angular, Leaflet JS maps library
* **Backend**: C# / .NET, ASP.NET Core RESTful APIs
* **Spatial & Geospatial Utilities**: pocketken.H3 - Uber H3 library for .Net, Google Polyline Encoding/Decoding
* **Infrastructure & Containerization**: Docker, Docker Compose, Nginx

---

## 📁 Repository Structure

```text
CorporateCarpoolManagementSystem/
├── .github/workflows/    # CI/CD pipelines
├── docker/               # Nginx and container configurations
├── docs/                 # Documentation, Sprint deliverables, and ERDs
├── src/                  # Source code (Frontend & Backend projects)
└── docker-compose.yml    # Multi-container Docker configuration

```

---

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

* [Docker Desktop](https://www.docker.com/) (with `docker-compose`)
* [.NET 8.0 SDK](https://dotnet.microsoft.com/) (for local backend development)
* [Node.js](https://nodejs.org/) (v18+ for local frontend development)

---

### Running with Docker Compose

1. **Clone the repository**:
```bash
git clone https://github.com/duongnguyen27903/CorporateCarpoolManagementSystem.git
cd CorporateCarpoolManagementSystem

```


2. **Start the application containers**:
```bash
docker-compose up -d --build

```


3. **Access the application**:
* Frontend / Nginx Proxy: `http://localhost`
* Backend API: `http://localhost:5000` (or specified API port)



---

### Local Development Setup

#### Backend (.NET)

```bash
cd src/backend
# Navigate to your backend API project folder
dotnet restore
dotnet ef database update --project CarpoolSystem.Infrastructure.Sqlserver --startup-project CarpoolSystem.API
dotnet run --project CarpoolSystem.API/CarpoolSystem.API.csproj

```

#### Frontend (TypeScript)

```bash
cd src/frontend
# Navigate to your frontend project folder
npm install
npm run dev
# or you can use npm start
```

---

## 🧠 Algorithmic Design Overview

### 1. Spatial Hexagonal Indexing (Uber H3)

Instead of running expensive distance calculations across all database records, locations are mapped to **H3 hexagonal cells** at a specific resolution ( Resolution 9). Driver routes and passenger locations are matched by querying intersecting or adjacent hexagon IDs ($k$-ring lookup).

### 2. Route Overlap Matching (Google Encoded Polyline)

1. **Encoding**: Driver routes generated via map APIs are compressed into compact polyline strings for efficient network transmission and storage.
2. **Decoding & Proximity**: The polyline is decoded into coordinate points along the route. High-probability matches are validated by checking if passenger origin and destination H3 cells align sequentially along the driver's polyline path.

---

## 👥 Contributors

* [@duongnguyen27903](https://github.com/duongnguyen27903)
* [@phantuananh3107](https://github.com/phantuananh3107)
* [@Hai-Son-Nguyen](https://github.com/Hai-Son-Nguyen)
* [@ninhtrungki-dev](https://github.com/ninhtrungki-dev)
* [@Hoang404nf](https://github.com/Hoang404nf)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Video demo

[carpoolMatching.webm](https://github.com/user-attachments/assets/421e8f04-6fef-49a4-8bcf-d8c83061b08d)

