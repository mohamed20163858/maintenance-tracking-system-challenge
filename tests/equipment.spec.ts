import { test, expect } from "@playwright/test";

// Equipment Management Tests
test.describe("Equipment Management", () => {
  test("Should create new equipment with valid data", async ({ page }) => {
    // Navigate to the equipment creation page
    await page.goto("/equipment/new");

    // Fill out the form with valid data
    await page.fill("#name", "New Equipment");
    await page.fill("#location", "Building A");
    await page.selectOption("#department", "Machining");
    await page.fill("#model", "Model-X");
    await page.fill("#serialNumber", "12345");
    await page.fill("#installDate", "2024-12-10");
    await page.selectOption("#status", "Operational");

    // Submit the form
    await page.click('button[type="submit"]');
    await page.waitForResponse(
      (response) =>
        response.url().includes("/equipment") && response.status() === 201
    );

    page.on("dialog", async (dialog) => {
      // Verify the dialog text
      expect(dialog.message()).toBe("Equipment created successfully");

      // Accept the dialog (close the alert)
      await dialog.accept();
    });

    // Assert success message and redirection
    await expect(page).toHaveURL("/equipment");

    // Check the first page for the new record
    const recordExistsOnFirstPage = await page.locator("table").innerText();
    if (!recordExistsOnFirstPage.includes("New Equipment")) {
      // Navigate to the last page using the ">>" button
      const lastPageButton = page.locator('button:has-text(">>")');
      const isDisabled = await lastPageButton.getAttribute("disabled");

      if (!isDisabled) {
        await lastPageButton.click();
      }

      // Verify the equipment appears in the table on the last page
      await expect(page.locator("table")).toContainText("New Equipment");
    } else {
      // Verify the equipment appears in the table on the first page
      await expect(page.locator("table")).toContainText("New Equipment");
    }
  });

  test("Should show validation errors for invalid equipment data", async ({
    page,
  }) => {
    // Navigate to the equipment creation page
    await page.goto("/equipment/new");

    // Submit the form without filling it out
    await page.click('button[type="submit"]');

    // Assert validation errors
    await expect(page.locator("#name-error")).toHaveText(
      "Name must be at least 3 characters"
    );
    await expect(page.locator("#location-error")).toHaveText(
      "Location is required"
    );
    await expect(page.locator("#department-error")).toHaveText(
      "Invalid enum value. Expected 'Machining' | 'Assembly' | 'Packaging' | 'Shipping', received ''"
    );
  });

  test("Should edit existing equipment", async ({ page }) => {
    // Navigate to the equipment table
    await page.goto("/equipment");

    // Click the edit link for the last added equipment
    await page.click("table tr:last-child a");
    await page.click('a:has-text("Edit")');

    // Update the equipment details
    await page.fill("#name", "Updated Equipment");
    await page.fill("#location", "Building momo");
    await page.click('button[type="submit"]');

    page.on("dialog", async (dialog) => {
      // Verify the dialog text
      expect(dialog.message()).toBe("Equipment updated successfully");

      // Accept the dialog (close the alert)
      await dialog.accept();
    });
    await expect(page.locator("table")).toContainText("Updated Equipment");
    await expect(page.locator("table")).toContainText("Building momo");
  });

  test("Should filter equipment table", async ({ page }) => {
    // Navigate to the equipment table
    await page.goto(`/equipment`);

    // Apply a filter
    await page.fill(
      "table thead tr th:nth-child(2) input[type='text']",
      "Building momo"
    );

    // Assert that the table displays only filtered results
    const rows = await page.locator("table tbody tr");
    await expect(rows.first()).toContainText("Building momo");
  });

  test("Should delete the added equipment", async ({ page }) => {
    // Navigate to the equipment table
    await page.goto(`/equipment`);

    // Click the Delete button for the last added equipment
    await page.click("table tr:last-child a");
    await page.waitForSelector('button:has-text("Delete")', {
      state: "visible",
    });
    // await page.click("#delete-button");
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
    await expect(page).toHaveURL("/equipment");

    // page.on("dialog", async (dialog) => {
    //   await dialog.accept();
    // });
    // Assert success message and redirection
    // await expect(page).toHaveURL(`${baseURL}/equipment`);

    // Apply a filter
    await page.fill(
      "table thead tr th:nth-child(2) input[type='text']",
      "Building momo"
    );
    // Assert that the table displays only filtered results
    const rows = await page.locator("table tbody tr");
    await expect(rows).toHaveCount(0);
  });
});
