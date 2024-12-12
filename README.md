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
  #### 1. Create Equipment:
  Users can create equipments that will be added dynamically to equipment table.
  #### 2. Create Maintenance Record:
  Users can add and save maintenance records with dynamic equipment selection.
  #### 3. Validation:
  Ensures valid input for fields like maintenance hours and dates.
  #### 4. Equipment Table:
  Displays a list of all Equipments.
  #### 5. Maintenance Table:
  Displays a list of all maintenance records with associated equipment names.
  #### 6. Enable sorting:
  In both tables maintenance and equipment all columns  when you click on any column it will sort the whole table based on the values in this specific column in this order:- 
  - assending (after the first click on this specific column)
  - dessending ( after the second click on this specific column)
  - no sort ( after the third click on this specific column)
  the sorting is done alphaptically by default expect some specific columns that has special sorting functions to priotrize sorting .
  for example in equipment table the column status sort the tables based on this priority [operational , maintenance, down, retired] where operational has the lowest priority and retired has the largest priority
  ### 7. Enable Filtering:
  In both tables Maintenance and Equipment tables all columns has an assoiated filter according to the the type of the data in the column.
  For example:- 
  fields like techinician, Equipment name,..etc has a search filter to filter the table data using the search key that user will enter inside the specific column  using input of type text
  fields like hours:- has a number range filter from min to max that user will provide using 2 inputs of type number
  fields like date:- has a date range filter . this is done by using two inputs of type date named startDate and endDate sequentially.
  fields like status , type, ..etc:- has a cateorigical filter. this is done using Dropdown with specific options.
  ### 8. Dynamic Dropdowns:
  Fetches equipment list dynamically from the API in maintenance record form.
  ### 9. Enable bulk status update:
  In equipment table i make it easy for user to update the status of a group of equipment during his surf in equipment table by using the dropDown menu in each record in the status column
  and after he finish he just need to click on th apply bluk update button and in an instant of eye all the selected column will be updated on the fly
  ### 10. Enable Grouping maintenance records using equipment name:
  In maintenance records table i created a toggle button that when the user click it. it will switch between two themes.
  - the first theme is creating subtables for each equipment name that enable user to track the maintenance history of each equipment. enabled by default
  - the second theme is just a regular main table that contain maintenance records . 
  ### 11. API Endpoints( will be updated in the future)
  i didnot build the backend of this project yet, but to make things easier for me i used json-server to mock the endpoints i will use in the future to make integration easier and here is the list of api endpoints i used in this application
  - GET /equipment: Retrieves all equipment details.
  - POST /equipment: Creates a new equipment.
  - DELETE /equipment/[id]: Delete specific equipment.
  - PUT /equipment/[id]: edit specific equipment.
  - GET /maintenance: Retrieves maintenance records.
  - POST /maintenance: Creates a new maintenance record.
  
  ## 4. Testing Approach
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
  

