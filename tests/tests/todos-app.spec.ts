import {expect, test} from "@playwright/test";
import {TodosPage} from "../Pages/todos-page";


test('create new task', async ({ page }) => {
    await page.goto('https://todo-app.tallinn-learning.ee/');
    const todosPage = new TodosPage(page);
    await todosPage.input.fill('New Task');
    await todosPage.input.press('Enter');
    await expect.soft(todosPage.itemLabel).toHaveText('New Task');
});

test('delete created task', async ({ page }) => {
    await page.goto('https://todo-app.tallinn-learning.ee/');
    const todosPage = new TodosPage(page);

    await todosPage.input.fill('Buy milk');
    await todosPage.input.press('Enter');
    await todosPage.input.fill('Buy bread');
    await todosPage.input.press('Enter');

    const taskItem = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Buy milk' });
    await taskItem.hover();
    const deleteButton = taskItem.locator('[data-testid="todo-item-button"]');
    await deleteButton.click();

    expect.soft(await todosPage.countTodosItems()).toBe(1);
});

