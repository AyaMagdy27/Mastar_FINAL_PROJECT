# Application Programming Interface (API)

## REST Architecture Principles

The API follows standard RESTful principles using stateless connections managed by JSON Web Tokens (JWT). All requests returning medical or user data must provide standard Bearer authorization.

---

## 1. Authentication

Handles context generation.

- **POST `/api/auth/login`**
  - **Description:** Negotiates credentials against stored hash.
  - **Payload Request:** `{ "email": "admin@sehati.ai", "password": "..." }`
  - **Response (200):** `{ "token": "ey...", "user": { "id": "uuid", "role": "SUPER_ADMIN", "clinicId": null } }`

---

## 2. Clinic Management

Administrative control layer.

- **GET `/api/clinics`**
  - **Description:** Lists registered organizational tenants. Restricted natively to high-tier roles.
  - **Response (200):** `[ { "_id": "clinic_1", "name": "Sehati Main Clinic" } ]`

---

## 3. Patient EMR Operations

_All patient endpoints execute behind strict `clinicId` query isolations natively in the route controllers._

- **GET `/api/patients`**
  - **Description:** Retrieves catalogual patient grids.
  - **Response (200):** `[ { "id": "PT-1002", "name": "Sarah Jenkins", "clinicId": "clinic_1", ... } ]`
- **POST `/api/patients`**
  - **Description:** Provisions a new profile attached to the user's active tenant.
  - **Payload Request:** `{ "nationalId": "100293", "name": "Sarah Jenkins", "gender": "female" }`
  - **Response (201):** `Patient DTO Object`
- **DELETE `/api/patients/:id`**
  - **Description:** Executes scoped deletion of the record, permanently cleaning data if permitted.

---

## 4. Scheduling & Appointments

- **GET `/api/appointments`**
  - **Description:** Obtains timeslots. Can be optionally parameterized via URL string `?date=YYYY-MM-DD` to restrict queries.
  - **Response (200):** `[ { "id": "APT-1", "department": "Cardiology", "status": "pending" } ]`
- **POST `/api/appointments`**
  - **Description:** Books an upcoming visitation slot. Checks internally for collision constraints.

---

## 5. System Intelligence & AI (FastAPI Layer)

_This is the downstream service layer generally proxied through the primary Node gateway._

- **POST `/predict/disease`**
  - **Description:** Main statistical endpoint passing multidimensional arrays into the XGBoost or specialized models.
  - **Payload Example:**
  ```json
  {
    "disease_mode": "hypertension",
    "vitals_tensor": { "bmi": 31, "systolic": 145, "diastolic": 90, "age": 55 }
  }
  ```
  - **Response Example (200):**
  ```json
  {
    "riskProbability": 82.5,
    "riskLevel": "High",
    "contributing_features": ["systolic", "bmi"]
  }
  ```
