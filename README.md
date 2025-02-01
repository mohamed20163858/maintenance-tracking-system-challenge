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
     git clone https://github.com/mohamed20163858/maintenance-tracking-system-challenge.git
     cd maintenance-tracking-system-challenge
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
  - DELETE /maintenance/[id]: Delete specific maintenance record.
  - PUT /maintenance/[id]: edit specific maintenance record.
  
  ## 3. Testing Approach
  ### 1. Testing Strategy
  - #### End-to-End Testing (Playwright):
      - Validates user interactions and workflows such as form submissions and filtering.
  
  ### 2. What is Tested and Why
  - #### Critical Features:
      - Tests ensure critical features like record creation, validation, and filtering work correctly.
  - #### Edge Cases:
      - Scenarios like invalid dates or exceeding allowed maintenance hours are tested.
  ### 3. How to Run Different Types of Tests
  #### Run All End-to-End Tests:
        npx playwright test
      
 ## 4. Technical Decisions

### Key Libraries Used and Why
1. **React Hook Form**:
   - Simplifies handling form state and validation.
2. **Playwright**:
   - Facilitates end-to-end testing for browser interactions.
3. **Zod**:
   - Provides schema-based validation for input data, ensuring robust validation rules.
4. **@tanstack/react-table**:
   - Used for efficient and customizable rendering of tabular data, with built-in support for sorting, filtering, and pagination.
5. **Recharts**:
   - Enables the creation of visually appealing and responsive charts for data visualization.

### Architecture Decisions
- **Component-Based Design**:
   - Ensures a modular, reusable, and maintainable UI structure.
- **Dynamic Data Fetching**:
   - Uses API calls to populate dropdowns and update records dynamically, ensuring flexibility and up-to-date information.
- **Table Management**:
   - Implements **@tanstack/react-table** for managing tabular data, enabling efficient data manipulation and display.
- **Data Visualization**:
   - Leverages **Recharts** to present complex data in a user-friendly and interactive manner.

### State Management Approach
- **React State**:
   - Handles local state for managing small UI interactions and temporary data.
- **React Hook Form**:
   - Provides streamlined management for form data and validations across the application.

---

## 5. Known Issues/Limitations

### Current Bugs or Limitations
1. **Performance Issues**:
   - Filtering or sorting large datasets using **@tanstack/react-table** can be slow without server-side support.
2. **Limited Backend**:
   - Currently reliant on a JSON server, lacking persistence and authentication mechanisms.
3. **Validation Edge Cases**:
   - Certain programmatic changes to input fields may bypass validation rules defined by **Zod**.
4. **Static Charts**:
   - Charts created using **Recharts** are currently static and do not include advanced interactivity like drill-down features.

### Future Improvements

1. **Server-Side Table Operations**:
   - Implement server-side support for sorting, filtering, and pagination to handle large datasets efficiently.
2. **Interactive Charts**:
   - Enhance visualizations with dynamic and interactive features using **Recharts**.
3. **Advanced Validation**:
   - Improve input validation to handle more complex scenarios and prevent bypassing rules.
4. **Error Feedback**:
   - Implement a comprehensive error handling mechanism for better user feedback in case of API failures or input errors.
6. **UI/UX Upgrades**:
   - Improve accessibility and usability, with responsive design enhancements and better layout structures.

  This document will evolve as the project progresses. Contributions and suggestions are welcome!

# Updates
- now the application using real [server](https://maintenance-system-server.vercel.app/) (nodejs and expressjs) and real db(mongodb) for more information please visit this [repo](https://github.com/mohamed20163858/maintenance_system_server)
  

