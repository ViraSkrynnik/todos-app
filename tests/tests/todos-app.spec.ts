import {expect, test} from "@playwright/test";
import {TodosPage} from "../Pages/todos-page";

let todosPage : TodosPage;

async function createTwoTasks(todosPage: TodosPage) {
    await todosPage.input.fill('Buy milk');
    await todosPage.input.press('Enter');
    await todosPage.input.fill('Buy bread');
    await todosPage.input.press('Enter');
}

test.beforeEach(async ({page}) => {
    await page.goto('https://todo-app.tallinn-learning.ee/');
    todosPage = new TodosPage(page);
})

test('create new task', async () => {
    await createTwoTasks(todosPage);
    await expect.soft(todosPage.itemLabel.nth(0)).toHaveText('Buy milk');
    await expect.soft(todosPage.itemLabel.nth(1)).toHaveText('Buy bread');
});

test('delete created task', async ({ page }) => {
    await createTwoTasks(todosPage);
    const taskItem = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Buy milk' });
    await taskItem.hover();
    const deleteButton = taskItem.locator('[data-testid="todo-item-button"]');
    await deleteButton.click();
    expect.soft(await todosPage.countTodosItems()).toBe(1);
});

test('activate task by name completed', async ({ page }) => {
    await createTwoTasks(todosPage);
    const firstTask = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Buy milk' });
    const firstCheckbox = firstTask.locator('[data-testid="todo-item-toggle"]');
    await firstCheckbox.click();
    await expect.soft(firstTask).toHaveClass(/completed/);

    const secondTask = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Buy bread' });
    await expect.soft(secondTask).not.toHaveClass(/completed/);
})

test('verify button "active" and button "completed" are working correctly', async ({ page }) => {
    await createTwoTasks(todosPage);
    await todosPage.activeTasks.click();
    const firstTask = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Buy milk' });
    const firstCheckbox = firstTask.locator('[data-testid="todo-item-toggle"]');
    await firstCheckbox.click();
    await todosPage.activeTasks.click();
    await expect.soft(firstTask).not.toBeVisible();
    const secondTask = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Buy bread' });
    await expect.soft(secondTask).toBeVisible();

    await todosPage.completedTasks.click();
    await expect.soft(firstTask).toBeVisible();
    await expect.soft(secondTask).not.toBeVisible();
})

test('verify button "clear completed" working correctly', async ({ page }) => {
    await createTwoTasks(todosPage);
    const firstTask = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Buy milk' });
    const firstCheckbox = firstTask.locator('[data-testid="todo-item-toggle"]');
    await firstCheckbox.click();
    expect.soft(await todosPage.countTodosItems()).toBe(2);
    await todosPage.clearCompletedButton.click();
    expect.soft(await todosPage.countTodosItems()).toBe(1);
})

test('verify toggle all button working correctly', async ({ page }) => {
    await createTwoTasks(todosPage);
    await todosPage.toggleAll.click();
    const firstTask = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Buy milk' });
    await expect.soft(firstTask).toHaveClass(/completed/);
    const secondTask = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Buy bread' });
    await expect.soft(secondTask).toHaveClass(/completed/);
})