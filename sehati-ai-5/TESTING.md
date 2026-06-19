# 23. Testing (User Acceptance Test)

## UAT Scenario 1: Clinic Data Multi-Tenant Isolation

- **Preconditions:** The database is successfully seeded with simulated patients mapped explicitly to "Clinic A" and "Clinic B". A test user is assigned Doctor status within "Clinic A".
- **Steps:**
  1. Boot the web interface and login using the Clinic A Doctor credentials.
  2. Navigate directly to the "Patient Directory" grid component.
  3. Validate that only Clinic A's roster displays natively.
  4. Attempt to utilize the Global Search feature by typing a specific active name mapped to Clinic B.
- **Expected Result:** The interface rigorously denies interaction. The patient mapped to Clinic B remains entirely unrendered and undiscoverable.

## UAT Scenario 2: Persistent Safety of Deletion Operations

- **Preconditions:** The global database holds records for independent active tenants.
- **Steps:**
  1. Login as Clinic A and permanently erase an onboarded patient record (via UI Trash icon).
  2. The table refetches state in Clinic A to confirm absence.
  3. Logout, and login using a Super Admin privileged account.
  4. Perform an audit to observe Clinic B's records.
- **Expected Result:** Clinic B data remains geometrically intact despite deletion parameters executing previously. The code successfully partitions write limits.

---

# 24. Test Cases Document

The platform undergoes rigorous functional assertion utilizing robust framework testing (`Vitest`, `React Testing Library`, `jsdom`). Below presents formalized manual/automation scenarios mapping directly to the integration test suites.

| Test ID       | Test Scenario                   | Test Steps                                                                                              | Expected Result                                                                                                                                         | Actual Result                                                           | Status                          |
| ------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------- |
| **TC-SEC-01** | Super Admin Visibility Bounds   | 1. Authenticate with Role: `SUPER_ADMIN`. <br> 2. Mount Dashboard. <br> 3. Observe total count markers. | Observer retains unconstrained visibility into all registered entities indiscriminately.                                                                | Successfully loads combined datasets.                                   | **PASS**                        |
| **TC-SEC-02** | Clinic Privacy Verification     | 1. Authenticate with Role: `DOCTOR`, Clinic: `clinic_1`. <br> 2. Interrogate `AppointmentsView`.        | Blocks all parameters tagged exclusively to `clinic_2`.                                                                                                 | Correctly restricts view arrays.                                        | **PASS**                        |
| **TC-SEC-03** | Local Deletion Scope Logic      | 1. Simulate frontend `delete` on active grid item. <br> 2. Assert against primary master array mapping. | Deletion accurately mutates local display element while correctly parsing the global array to prevent destructive overwriting of sister tenant records. | Logic parses properly, no data-loss occurred on adjacent clinic blocks. | **PASS** 🐛 (Fixed in dev loop) |
| **TC-AI-01**  | Mathematical Prediction Mapping | 1. Enter Form values (age: 50, BMI: 30). <br> 2. Execute submit payload.                                | System correctly packages payload structure and natively handles state promise resolution into UI render strings.                                       | Strings render dynamically without crash.                               | **PASS**                        |
| **TC-CTX-01** | Fallback Defaults               | 1. Wipe root storage cache. <br> 2. Engage main UI tree.                                                | The Context Provider smoothly degrades or enforces Super Admin initial fallback configurations for development bootstrapping.                           | Default state engaged gracefully.                                       | **PASS**                        |
| **TC-UI-01**  | Navigation Mount Reliability    | 1. Click persistent Dashboard routes.                                                                   | Core structural application trees initialize without dependency race conditions.                                                                        | Render stable.                                                          | **PASS**                        |
