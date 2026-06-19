# 5. System Requirements Specification

## Hardware Requirements

- **Server-side (Web):** Cloud-hosted container (min 1 vCPU, 2GB RAM).
- **Server-side (AI):** Dedicated CPU instances or entry-level GPU nodes depending on concurrency.
- **Client-side:** Standard browsers (Chrome, Safari, Edge) on Desktop or Mobile (Responsive capabilities required).

## Software Requirements

- **Core Stack:** Next.js 15, React 19, TypeScript.
- **Styling Framework:** Tailwind CSS.
- **Database:** MongoDB 6.0+ with Atlas deployment.
- **Agent / Python Pipeline:** FastAPI (Python 3.10), Scikit-Learn, PyTorch/XGBoost.
- **Libraries:** Recharts, Lucide React, Framer Motion/Motion React.

## User Requirements

- Complex AI insights must be abstracted to simple, percentage-based visual cards.
- High emphasis on protecting patient health information; users must be restricted inherently to their tenant domain.

---

# 6. Functional Requirements

- **Authentication:** Verify credentials, issue stateless JWTs, resolve users to scopes (Super Admin vs Clinical User).
- **Clinics / Multi-tenancy:** Onboard autonomous clinic entities.
- **Patients:** Create, read, update, delete (CRUD) patient profiles.
- **Doctors:** Register doctors against distinct clinic tenants.
- **Appointments:** Provision, schedule, view calendars, resolve overlapping timeslots.
- **EMR:** Attach vitals, records, and AI prediction logs to specific profiles.
- **AI Assistant & Predictive Disease Detection:** Process real-time form inputs to return diabetes, hypertension, and heart disease likelihood probabilities. Present "High-Risk Alerts".

---

# 7. Requirement Specifications

### Module: Authentication & RBAC

- **Description:** Manages identity verification and payload distribution.
- **Inputs:** `email`, `password`.
- **Outputs:** Authenticated context, `clinicId` marker, JWT Token.
- **Preconditions:** User exists in the directory.
- **Postconditions:** Successful token storage initiates `AuthContext` population across system UI.

### Module: Patients Directory

- **Description:** The system of record for active medical patients.
- **Inputs:** `name`, `status`, `nationalId`.
- **Outputs:** Data grid restricted explicitly by the user's logged-in `clinicId`.
- **Preconditions:** Session established.
- **Postconditions:** Patient is available to associate with predictions or appointments.

---

# 8. User Stories

1. **Super Admin:** "As a Super Admin, I want to manage all overall clinics so that I can seamlessly onboard entirely new organizations to the platform."
2. **Clinic Admin:** "As a Clinic Admin, I want to configure doctors at my clinic so that receptionist staff can map patient appointments to them."
3. **Doctor:** "As a Doctor, I want to trigger a predictive AI diagnosis form so that I can observe invisible correlations in patient metrics."
4. **Receptionist:** "As a Receptionist, I want to view my clinic's daily appointments cleanly so that I can check in physical traffic efficiently."
5. **Patient:** "As a Patient, I want to log in and observe my past timeline so that I remain engaged in my treatment plan."

---

# 9. Work Backlog

| Epic                  | Feature               | Tasks                                                         | Priority |
| --------------------- | --------------------- | ------------------------------------------------------------- | -------- |
| Platform Architecture | Multi-tenant Database | Configure Mongoose dynamic tenant resolution and JWT scoping. | High     |
| Authorization         | RBAC Framework        | Implement `AuthContext` UI guards.                            | High     |
| Registration          | Users & Doctors       | Registration forms with specific clinical associations.       | Medium   |
| EMR Systems           | Patient Directory     | Build data tables, CRUD routes, search handlers.              | High     |
| Predictive Systems    | FastAPI ML Backend    | Train Scikit XGBoost models, expose REST, connect UI forms.   | High     |
| UI/UX                 | Dashboard Analytics   | Build Recharts dashboard, high-risk summary panels.           | Low      |

---

# 11. Use Case Diagram

```mermaid
usecaseDiagram
    actor "Super Admin" as SA
    actor "Clinic Admin" as CA
    actor "Doctor" as DR
    actor "Receptionist" as RC
    actor "Patient" as PT

    usecase "Manage Registered Clinics" as UC1
    usecase "Configure Doctors & Staff" as UC2
    usecase "Manage Appointments" as UC3
    usecase "View EMR Timeline" as UC4
    usecase "Run AI Health Prediction" as UC5
    usecase "Authenticate (Login)" as UC6

    SA --> UC1
    CA --> UC2
    RC --> UC3
    DR --> UC4
    DR --> UC5
    PT --> UC4

    SA --> UC6
    CA --> UC6
    DR --> UC6
    RC --> UC6
    PT --> UC6
```

---

# 12. Actor Description

- **Super Admin:** Master level credential. They have no absolute `clinicId` constraint, permitting them absolute visibility to audit records or establish core organizations.
- **Clinic Admin:** Operates restricted to a single organizational unit limit. They execute management duties but generally do not provide medical feedback.
- **Doctor:** The core driver of the clinical experience. Operates on EMR models, charts updates, reviews timelines, and engages the Predictive Agent heavily.
- **Receptionist:** Facilitates scheduling. Constrained strictly to modifying Appointments and light Patient profile edits.
- **Patient:** Externally constrained user who accesses the portal in a strictly read-only mode to visualize their own specific history.

---

# 13. Use Case Description

**Use Case: Run AI Health Prediction**

- **Main Flow:**
  1. Authorized Doctor logs in and accesses the "Predictive Health" module.
  2. Selects a base disorder (e.g., Hypertension Form).
  3. Inputs required scalar data such as BMI, Glucose, or Resting Heart Rate.
  4. Clicks "Generate Insight".
  5. UI dispatches payload to FastAPI.
  6. Prediction probability and severity band returned to the user natively.
- **Alternative Flow:**
  - Incomplete Vitals provided: The Form validators immediately block the submission and highlight missing mandatory metrics, preventing a wasted API interaction.
- **Exceptions:**
  - The ML Cluster goes offline: A timeout mechanism gracefully intercepts the failed HTTP bridge and alerts the user `AI services temporarily unavailable`.

---

# 14. Traceability Matrix

| Requirement | Description             | User Story             | Use Case                 | Test Case Mapping    |
| ----------- | ----------------------- | ---------------------- | ------------------------ | -------------------- |
| REQ-01      | Implement ML insights   | US-Doctor (Prediction) | Run AI Health Prediction | TC-AI-01             |
| REQ-02      | Multi-tenant separation | US-Clinic (Privacy)    | Authenticate (Login)     | TC-SEC-01, TC-SEC-02 |
| REQ-03      | Patient Scheduling      | US-Receptionist        | Manage Appointments      | TC-APT-01            |
| REQ-04      | Persist Patient History | US-Patient             | View EMR Timeline        | TC-PTE-01            |

---

# 17. Non-Functional Requirements

- **Security:** Database transactions strictly append `where clinicId = 'X'` to intercept potential cross-over bugs. Passwords universally salted and hashed with robust algorithms.
- **Performance:** Single Page Application (SPA) mechanics combined with concurrent state updates to keep frame renders at 60 FPS. API requests should complete in <1200ms round trip.
- **Scalability:** Horizontal replication scaling possible for both Node instances and the Python Inference cluster.
- **Accessibility:** Use of high-contrast readable markers, robust SVG iconography (`lucide-react`), and semantic inputs.
- **Reliability:** Built-in fault tolerance boundaries for components, preventing an overall React DOM cascade if one specific network call fails.
