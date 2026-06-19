# 20. Class Diagram

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +String role
        +String clinicId
        +login()
        +logout()
    }

    class Clinic {
        +String _id
        +String name
        +String address
    }

    class Patient {
        +String id
        +String nationalId
        +String name
        +String status
        +String clinicId
        +Date dateOfBirth
    }

    class Appointment {
        +String id
        +String patientId
        +String doctorId
        +String clinicId
        +String department
        +Date date
        +String timeSlot
        +String status
    }

    User --> Clinic : Associated To
    Patient --> Clinic : Registered At
    Appointment --> Patient : References
    Appointment --> User : Conducted By (Doctor)
    Appointment --> Clinic : Hosted At
```

---

# 21. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    CLINIC ||--o{ USER : employs
    CLINIC ||--o{ PATIENT : registers
    CLINIC ||--o{ APPOINTMENT : hosts
    PATIENT ||--o{ APPOINTMENT : books
    USER ||--o{ APPOINTMENT : conducts

    USER {
        ObjectId _id PK
        string role
        string name
        string email
        string password_hash
        ObjectId clinicId FK
    }
    CLINIC {
        ObjectId _id PK
        string name
        string location
    }
    PATIENT {
        ObjectId _id PK
        string nationalId
        string name
        string status
        ObjectId clinicId FK
    }
    APPOINTMENT {
        ObjectId _id PK
        string department
        date date
        string timeSlot
        ObjectId patientId FK
        ObjectId doctorId FK
        ObjectId clinicId FK
    }
```

---

# 22. Mapping

## Database Mapping Strategy

The MongoDB database uses logical schemas established directly from the classes presented above. To ensure architectural integrity and support real-world clinic chains, standard document stores implement an automatic tenancy enforcement mapping rule:

- Except for global documents (such as system-wide standard Clinic locations or Super Admin users), **every single Schema must implement a required `clinicId` field**.
- The Node API layer contains routing middleware that automatically asserts that any given REST verb carries an implicit condition `{ clinicId: req.user.clinicId }`. This ensures absolute mathematical partitioning.

## API Response Mapping

API responses map Mongoose/MongoDB data aggregates into constrained standard JSON types before delivering them to the React frontend.

## Data Transfer Object (DTO) Mapping

To enhance security and normalize types:

- **Database Models** inherently hold backend-specific fields like `__v` or internal `_id` and sensitive flags (like password hashes).
- Before bridging data onto the web protocol, the Node controller filters records into **DTOs** containing normalized `id` fields and only necessary parameters. The `src/types.ts` typescript interface file explicitly mirrors this frontend DTO contract.
