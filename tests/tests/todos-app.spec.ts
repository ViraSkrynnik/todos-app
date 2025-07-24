import {expect, test} from "@playwright/test";
import {TodosPage} from "../Pages/todos-page";

const task1Title = 'Buy milk';
const task2Title = 'Buy bread';

async function createTwoTasks(todosPage: TodosPage) {
    await todosPage.createTask(task1Title);
    await todosPage.createTask(task2Title);
 }

test.beforeEach(async ({page}) => {
    await page.goto('https://todo-app.tallinn-learning.ee/');
    const todosPage = new TodosPage(page);
    await createTwoTasks(todosPage);
})

test('create new task', async ({ page }) => {
    const todosPage = new TodosPage(page);
    await expect.soft(todosPage.getTaskByIndex(0)).toHaveText(task1Title);
    await expect.soft(todosPage.getTaskByIndex(1)).toHaveText(task1Title);
});

test('delete created task', async ({ page }) => {
    const todosPage = new TodosPage(page);
    await todosPage.deleteTask(task1Title);
    expect.soft(await todosPage.countTodosItems()).toBe(1);
});

test('verify task completion', async ({ page }) => {
    const todosPage = new TodosPage(page);
    await todosPage.completeTask(task1Title);
    await expect.soft(todosPage.getTaskByTitle(task1Title)).toHaveClass(/completed/);
    await expect.soft(todosPage.getTaskByTitle(task2Title)).not.toHaveClass(/completed/);
})

test('verify button "active" and button "completed" are working correctly', async ({ page }) => {
    const todosPage = new TodosPage(page);

    await todosPage.completeTask(task1Title);

    await todosPage.activeTasks.click();

    const firstTask = todosPage.getTaskByTitle(task1Title);
    const secondTask = todosPage.getTaskByTitle(task2Title);
    await expect.soft(firstTask).not.toBeVisible();
    await expect.soft(secondTask).toBeVisible();

    await todosPage.completedTasks.click();

    await expect.soft(firstTask).toBeVisible();
    await expect.soft(secondTask).not.toBeVisible();
})

test('verify button "clear completed" working correctly', async ({ page }) => {
    const todosPage = new TodosPage(page);

    await todosPage.completeTask(task1Title);
    expect.soft(await todosPage.countTodosItems()).toBe(2);
    await todosPage.clearCompletedButton.click();
    expect.soft(await todosPage.countTodosItems()).toBe(1);
})

test('verify toggle all button working correctly', async ({ page }) => {
    const todosPage = new TodosPage(page);
    await todosPage.toggleAll.click();

    const firstTask = todosPage.getTaskByTitle(task1Title);
    const secondTask = todosPage.getTaskByTitle(task2Title);
    await expect.soft(firstTask).toHaveClass(/completed/);
    await expect.soft(secondTask).toHaveClass(/completed/);

    await todosPage.toggleAll.click();
    await expect.soft(firstTask).not.toHaveClass(/completed/);
    await expect.soft(secondTask).not.toHaveClass(/completed/);
})