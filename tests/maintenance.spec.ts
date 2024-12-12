import { test, expect } from "@playwright/test";

// Maintenance Record Tests
test.describe("Maintenance Record Tests", () => {
  test("Should create new maintenance record with valid data", async ({
    page,
  }) => {
    // Navigate to the maintenance creation page
    await page.goto("/maintenance/new");

    // Fill out the form with valid data
    await page.waitForSelector("select#equipmentId"); // Wait for the dropdown to be visible
    const options = await page
      .locator("select#equipmentId option")
      .elementHandles(); // Get all options
    const lastOption = options[options.length - 1]; // Select the last option
    const value = await lastOption.getAttribute("value"); // Get the value of the last option

    if (value) {
      await page.selectOption("select#equipmentId", value); // Use the value to select the last option
    }
    await page.fill("#date", "2024-12-02");
    await page.selectOption("#type", "Preventive");
    await page.fill("#technician", "Technician Name Test");
    await page.fill("#hoursSpent", "5");
    await page.fill("#description", "Routine check");
    await page.selectOption("#priority", "Medium");
    await page.selectOption("#completionStatus", "Complete");

    // Submit the form
    await page.click('button[type="submit"]');
    await page.waitForResponse(
      (response) =>
        response.url().includes("/maintenance") && response.status() === 201
    );

    page.on("dialog", async (dialog) => {
      // Verify the dialog text
      expect(dialog.message()).toBe("Record created successfully");

      // Accept the dialog (close the alert)
      await dialog.accept();
    });

    // Assert success message and redirection
    await expect(page).toHaveURL("/maintenance");

    // Check the first page for the new record
    const recordExistsOnFirstPage = await page.locator("table").innerText();
    if (!recordExistsOnFirstPage.includes("Technician Name Test")) {
      // Navigate to the last page using the ">>" button
      const lastPageButton = page.locator('button:has-text(">>")');
      const isDisabled = await lastPageButton.getAttribute("disabled");

      if (!isDisabled) {
        await lastPageButton.click();
      }

      // Verify the equipment appears in the table on the last page
      await expect(page.locator("table")).toContainText("Technician Name Test");
    } else {
      // Verify the equipment appears in the table on the first page
      await expect(page.locator("table")).toContainText("Technician Name Test");
    }
  });

  test("Should validate maintenance hours (reject negative/over 24)", async ({
    page,
  }) => {
    // Navigate to the maintenance creation page
    await page.goto("/maintenance/new");
    // Test negative hours
    await page.fill("#hoursSpent", "-5");
    await page.click('button[type="submit"]');
    await expect(
      page.locator("text=Hours must be a positive number")
    ).toBeVisible(); // Replace with the actual error message

    // Test hours over 24
    await page.fill("#hoursSpent", "25");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Hours cannot exceed 24")).toBeVisible();
  });
  test("Should show equipment name in maintenance table", async ({ page }) => {
    // Navigate to the maintenance records creation page to get the name of the equipment
    await page.goto("maintenance/new");
    await page.waitForSelector("select#equipmentId"); // Wait for the dropdown to be visible
    const options = await page
      .locator("select#equipmentId option")
      .elementHandles(); // Get all options
    const lastOption = options[options.length - 1]; // Select the last option
    const equipmentName = await lastOption.innerText(); // Get the value of the last option

    // Navigate to the maintenance records page
    await page.goto("maintenance");

    // Check if the equipment name is displayed in the table
    await expect(
      page.locator(`text=${equipmentName?.split("-")[0].trim()}`)
    ).toBeVisible();
  });

  test("Should filter maintenance records by date range", async ({ page }) => {
    // Navigate to the maintenance records page
    await page.goto("maintenance"); // Replace with the correct URL

    // Set the date range filters
    await page.fill("#maintenance-start-date", "2024-12-01"); // Replace with the start date input selector
    await page.fill("#maintenance-end-date", "2024-12-12"); // Replace with the end date input selector

    // Check if records within the date range are displayed
    const filteredRecordDate = "2024-12-02"; // Replace with a sample date in the range
    await expect(
      page.locator(`text=${filteredRecordDate}`).first()
    ).toBeVisible();

    // Check if records outside the date range are hidden
    const outsideRecordDate = "2024-11-30"; // Replace with a date outside the range
    await expect(page.locator(`text=${outsideRecordDate}`)).not.toBeVisible();
  });
  test("Should delete the added Maintenance Record", async ({ page }) => {
    // Navigate to the maintenance table
    await page.goto(`/maintenance`);

    // Click the Delete button for the last added maintenance record
    await page.click("table tr:last-child a");
    await page.waitForSelector('button:has-text("Delete")', {
      state: "visible",
    });
    // Wait for dialog to be triggered
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe(
        "Are you sure you want to delete this record?"
      );
      await dialog.accept(); // Accept the confirmation dialog
    });

    // Click the Delete button
    await page.click('button:has-text("Delete")');

    // Ensure the correct URL and that the equipment is removed
    await expect(page).toHaveURL("/maintenance");
    // Apply a filter
    await page.fill(
      "table thead tr th:nth-child(3) input[type='text']",
      "Technician Name Test"
    );
    // Assert that the table displays only filtered results
    const rows = await page.locator("table tbody tr");
    await expect(rows).toHaveCount(0);
  });
});
