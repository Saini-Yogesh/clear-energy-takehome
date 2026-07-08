# Clear Energy Delivery Management System

A production-grade, highly scalable React Native Expo monorepo supporting three enterprise mobile applications: **Customer**, **Driver**, and **Admin Mobile**. This workspace utilizes a unified core module containing shared theme configurations, types, Zod validators, Axios API handlers, and reusable UI card states.

---

## 1. Architectural Design & Philosophy

This project is built as a **Monorepo** using **pnpm workspaces** and managed via **Turborepo**. The fundamental engineering principle applied here is **Single Source of Truth (SSOT)**.

Multi-app suites inside growing organizations frequently suffer from "concept drift"—where the representation of an Entity (e.g., an `Order` or `Stop`) diverges between the driver-facing and customer-facing teams. This drift leads to silent serialization bugs at the API layer, duplicative styling code, and disjointed user experiences.

### Key Architectural Pillars

- **DRY Schema Modeling**: Types are not written by hand; instead, they are derived dynamically from **Zod Schemas** (`packages/shared/src/validators/order.ts`). This ensures that changes to any field immediately fail compilation across the entire workspace if any app utilizes the data incorrectly.
- **Encapsulated API Communication**: All endpoints are mapped to an abstract `ApiService` container within the shared workspace. Consumer apps do not issue raw requests; they import strongly typed query hooks.
- **Dynamic Theme Resolution**: Dynamic light/dark modes are resolved through token objects rather than inline styling. The theme system is structured to handle tablet layouts, typography hierarchy, and accessibility guidelines natively.

---

## 2. Directory Structure

```
clear-energy-takehome/
├── apps/
│   ├── customer/            # Customer App (Today's Orders Screen)
│   │   ├── src/screens/     # Screen implementations
│   │   ├── App.tsx          # Nav stack & React Query Providers
│   │   ├── metro.config.js  # Monorepo custom metro bundler config
│   │   └── package.json     # Workspace manifest
│   ├── driver/              # Driver App (Today's Route Screen)
│   │   ├── src/screens/     # Screen implementations
│   │   ├── App.tsx
│   │   ├── metro.config.js
│   │   └── package.json
│   └── admin-mobile/        # Admin App (Action Inbox Screen)
│       ├── src/screens/     # Screen implementations
│       ├── App.tsx
│       ├── metro.config.js
│       └── package.json
├── packages/
│   └── shared/              # Shared Library Module
│       ├── src/
│       │   ├── api/         # Axios API Client, Interceptors, and Error Parsers
│       │   ├── components/  # OrderCard, Skeletons, Empty/Error States
│       │   ├── hooks/       # useOrders, useTrips, usePendingActions, useNetwork...
│       │   ├── constants/   # API Ports, cache keys, timeout variables
│       │   ├── theme/       # Design tokens (colors, typography, margins)
│       │   ├── utils/       # Formatter functions (Currency, Dates, address logger)
│       │   ├── types/       # Unified TypeScript definitions
│       │   └── validators/  # Run-time Zod schemas
│       ├── package.json
│       ├── jest.config.js
│       └── tsconfig.json
├── mock-api.json            # json-server Mock Database
├── package.json             # Root Monorepo Configuration
├── turbo.json               # Turborepo task pipeline
└── pnpm-workspace.yaml      # pnpm workspace definition
```

---

## 3. Technology Choices & Justification

### pnpm Workspaces vs. Alternatives

- **Yarn Workspaces (Classic)**: Yarn v1 is deprecated and lacks local caching. Yarn Berry (v2+) introduces complex Plug'n'Play (PnP) configurations which often crash when resolving react-native and Metro bundler libraries.
- **npm Workspaces**: Lacks standard symbol-link mechanisms and has slower package downloading compared to `pnpm`.
- **pnpm (Chosen)**: Utilizes a global content-addressable store. Instead of downloading separate copies of `expo` or `react-native` for three apps (which consumes gigabytes of space), `pnpm` links files together, reducing disk footprint by up to 80% and decreasing install times to seconds.

### Turborepo vs. Nx

- **Nx**: Nx is a heavy, powerful framework that introduces proprietary tools and config files. It is often overkill for small to medium monorepos.
- **Turborepo (Chosen)**: Offers a zero-config build/test caching pipeline. We declare our task pipeline in `turbo.json`, and Turborepo handles task orchestration, executing build and lint stages concurrently with caching.

### Axios vs. Fetch API

- **Fetch API**: Lacks out-of-the-box support for interceptors, timeouts, cancellation abstractions, and request retries. Writing this functionality from scratch introduces bug-prone boilerplate.
- **Axios (Chosen)**: Natively supports request/response interceptors, request timeouts (`ECONNABORTED`), and standard response mapping. We can inject tracking IDs and retry commands globally without muddying our screen controllers.

### TanStack Query (React Query) vs. Zustand (Local Server Caching)

- **Zustand (Local State)**: Excellent for transient app settings (e.g. tracking local theme choices or active connection states), but implementing cache invalidate loops, automated polling, query retries, and offline queuing from scratch is hard.
- **TanStack Query (Chosen)**: Manages server cache states seamlessly. It automatically triggers refetches, invalidates keys when mutations complete, tracks loading indicators, and handles cancellation (via `AbortController` signals) when screens unmount.

---

## 4. Shared API Client & Components Deep Dive

### Reusable Axios Client (`packages/shared/src/api/client.ts`)

- **Request Interceptor**:
  - Generates a unique `X-Request-ID` per execution.
  - Attaches `Authorization: Bearer <token>` automatically when an auth session is active.
  - Attaches `X-Idempotency-Key` to state-modifying requests (`POST`, `PUT`, `PATCH`, `DELETE`) so that if a request is retried due to network dropouts, the server does not perform the action twice.
- **Exponential Backoff Retries**:
  - Catches transient network errors (`ERR_NETWORK`), timeouts (`ECONNABORTED`), and server-side glitches (`502`, `503`, `504`).
  - Retries the request up to 3 times, spacing out retries exponentially (`1s`, `2s`, `4s`).
- **Standard Error Parser (`packages/shared/src/api/errors.ts`)**:
  - Parses exceptions into an `AppError` type.
  - Translates code exceptions (e.g., `401` to `UNAUTHORIZED`, `429` to `TOO_MANY_REQUESTS`, `422` to `VALIDATION_ERROR`) into user-friendly localized messages.
  - Keeps technical stack strings encapsulated for diagnostic dropdown panels.

### Reusable Order Card (`packages/shared/src/components/OrderCard.tsx`)

A unified rendering block configured for three distinct contexts:

1.  **Customer View**: Displays the order SKU, status badge, formatted currency, and created timestamp. If the status is `'PENDING'`, a full-width cancel button is rendered.
2.  **Driver View**: Shows the stop route sequence (e.g. `STOP #1`), estimated arrival time (ETA), truncated address layout, and a priority indicator badge. Provides "Navigate" and "Complete" button triggers.
3.  **Admin View**: Features prominent priority indicators (e.g., critical red tags), the order SKU, amount, action details (e.g., approval request type), and explicit Reject/Approve buttons. Displays admin warning callouts.

---

## 5. Getting Started & Setup

### Prerequisites

- Node.js v20+
- pnpm installed globally (`npm i -g pnpm`)

### Installation & Linking

From the root directory of the project, execute:

```bash
pnpm install
```

This command downloads the dependencies for all applications and package components, establishes the workspace linkages inside `node_modules`, and prepares the repository for development.

### Start the Mock API Server

We run `json-server` on port `4000` to allow local emulators (Android/iOS) to bridge connections cleanly:

```bash
npx json-server mock-api.json --port 4000
```

---

## 6. Running the Applications

Open separate terminal windows and run the apps using the workspace filters:

```bash
# Start Customer App
pnpm --filter customer start

# Start Driver App
pnpm --filter driver start

# Start Admin App
pnpm --filter admin-mobile start
```

### Expo / Metro Key Commands

After running `start`, press the target key:

- Press **`a`** to open on your local Android Emulator.
- Press **`i`** to open on your local iOS Simulator.
- Press **`w`** to open in a web browser.
- Scan the QR code with your phone via **Expo Go** to test on a physical device.

---

## 7. Verification & Testing

Our workspace is configured with global task pipelines. You can lint the entire repository or run test suites using these commands:

### Running Tests

To run unit tests (validating the currency formatting algorithms):

```bash
pnpm run test
```

- Uses `ts-jest` inside `packages/shared` to run tests without full app overhead.
- Checks comma splits in Rupees, zero values, and negative/invalid states.

### Running Lint Checks

To run code analysis across all workspace folders:

```bash
pnpm run lint
```

- Validates TypeScript variables, compiler rules, and imports.

---

## 8. Future Improvements

If we were deploying this project to staging/production next week, we would implement:

1.  **Strict Cache Hydration (Offline Support)**: Integrate TanStack Query's `persistQueryClient` with AsyncStorage so that if a driver goes offline during a route, their stops remain readable and active actions are queued.
2.  **Dynamic Map Intents**: Replace the mock `NAVIGATE` alert in the driver app with native device navigation bindings:
    ```ts
    import { Linking, Platform } from 'react-native';
    const openMap = (address: string) => {
      const url = Platform.select({
        ios: `maps:0,0?q=${encodeURIComponent(address)}`,
        android: `geo:0,0?q=${encodeURIComponent(address)}`,
      });
      if (url) Linking.openURL(url);
    };
    ```
3.  **Monorepo Shared Package Bundling (Prebuilds)**: Currently, apps compile the shared package from source. For larger monorepos, compiling shared modules to JS/d.ts bundles (e.g. using `tsup` or `rollup`) reduces app build times and speeds up Metro launches.

---

## 9. Engineering Trade-offs

- **React Native JSX Jest Unit Testing**:
  Testing JSX components wrapping native React Native modules inside Jest requires loading complex Babel transpilers (`metro-react-native-babel-preset`) and mock files for all layout elements (e.g., safe areas, screens, views). Since component visual testing was explicitly listed as out of scope, we focused testing on the core business calculations (R6 - Indian price formatting) to ensure our testing suite runs under 3 seconds and builds cleanly.
- **State Mutations on json-server**:
  Since the mock database inside `mock-api.json` is a plain JSON file, state modifications (`PATCH` calls to pending actions) will write back to the local database, altering the seed values. We added a Pull-to-Refresh system on lists to allow users to trigger a reload to reset views.

---

## 10. AI Usage & Project Metrics

- **AI Tools**: Gemini 3.5 Flash (Medium).
- **Tasks Handled**: Generating monorepo workspaces, Axios retry interceptors, unified OrderCard styling schemas, and Jest tests.
- **AI Scope Decisions**: Discarded native UI layout tests in Jest to keep the compiler clean and fast, concentrating testing on formatting calculations.
- **Time Spent**: 1 hour 45 minutes from scaffold to linter/test completion.
