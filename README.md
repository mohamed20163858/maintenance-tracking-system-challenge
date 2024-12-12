# Maintenance Records Management Application

This README outlines the steps to set up, use, and test the Maintenance Records Management application, highlights key features, discusses technical decisions, and notes any known issues or limitations.

---

## 1. Setup Instructions
  ### Prerequisites
  - **Node.js**: Ensure you have Node.js (v18 or higher) installed.
  - **npm/yarn**: Package manager for managing dependencies.
  - **Database**: Ensure a JSON server or relevant backend API is running for equipment and maintenance records.

  ### Installation Steps
  - open your terminal and write the following commands:-
  1. Clone the repository:
     ```
     git clone https://github.com/your-repo-name.git
     cd your-repo-name
     ```
  2. Install the dependencies:
     
      ```
      npm install
      ```
  4. Start the application:
     
      ```
      npm run dev
      ```
  6. Start the backend API:
      ```
      npx json-server --watch db.json --port 3001
      ```
  ## How to Run the Application
  - Visit  http://localhost:3000  in your web browser to access the app.

  ## How to Run Tests
  ### Run Playwright tests:
   1. Run tests without using  GUI browser (headless)
      ```
      npx playwright test
      ```
   2. Run tests using  GUI browser (not headless)
      ```
      npx playwright test --headed
      ```
      - I choose to use chrome as my only and default browser for testing, there are a lot of other factors like number of workers, number of retries, ..etc you can change these configuration by editing `playwright.config.ts` that existed in the root folder 
  ## 2. Features Implementation
  List of Completed Features
  Create Maintenance Record:
  Users can add and save maintenance records with dynamic equipment selection.
  Validation:
  Ensures valid input for fields like maintenance hours and dates.
  Maintenance Table:
  Displays a list of all maintenance records with associated equipment names.
  Date Range Filter:
  Filters records based on a user-defined date range.
  Dynamic Dropdowns:
  Fetches equipment list dynamically from the API.
  API Endpoints
  GET /equipment: Retrieves all equipment details.
  POST /maintenance-records: Creates a new maintenance record.
  GET /maintenance-records: Retrieves maintenance records, supports filtering.
  4. Testing Approach
  Testing Strategy
  End-to-End Testing (Playwright):
  Validates user interactions and workflows such as form submissions and filtering.
  Unit Testing (React):
  Ensures component-level functionality like form validations and dropdown population.
  What is Tested and Why
  Critical Features:
  Tests ensure critical features like record creation, validation, and filtering work correctly.
  Edge Cases:
  Scenarios like invalid dates or exceeding allowed maintenance hours are tested.
  How to Run Different Types of Tests
  Run All End-to-End Tests:
  bash
  Copy code
  npx playwright test
  Run React Unit Tests:
  bash
  Copy code
  npm run test
  5. Technical Decisions
  Key Libraries Used and Why
  React Hook Form:
  Simplifies handling form state and validation.
  Playwright:
  Facilitates end-to-end testing for browser interactions.
  Zod:
  Provides schema-based validation for inputs.
  Architecture Decisions
  Component-Based Design:
  Ensures scalability and reusability of UI components.
  Dynamic Data Handling:
  Fetches data like equipment details dynamically to ensure flexibility.
  State Management Approach
  React State:
  Used for managing local component states.
  React Hook Form:
  Manages form state and validation efficiently.
  6. Known Issues/Limitations
  Current Bugs or Limitations
  Performance:
  Filtering large datasets in the frontend may cause slowdowns.
  Validation:
  Programmatic changes to form fields may bypass validation.
  Backend API:
  Limited to a JSON server with no authentication support.
  Future Improvements
  Backend Integration:
  Migrate to a more robust database like PostgreSQL.
  Advanced Filtering:
  Add additional filters such as technician or maintenance type.
  Error Handling:
  Improve user feedback for API errors.
  Enhanced UI/UX:
  Refine the interface with advanced designs and better styling.
  This document will evolve as the project progresses. Contributions and suggestions are welcome!
  

