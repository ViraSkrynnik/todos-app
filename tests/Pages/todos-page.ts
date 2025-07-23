import {Page, Locator} from "@playwright/test";

export class TodosPage {
    readonly page: Page
    readonly title : Locator
    readonly input: Locator
    readonly itemLabel: Locator
    readonly deleteButton: Locator
    readonly toggleAll: Locator
    readonly checkbox: Locator
    readonly allTasks: Locator
    readonly completedTasks: Locator
    readonly activeTasks: Locator
    readonly clearCompletedButton: Locator

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId('header');
        this.input = page.getByTestId('text-input');
        this.itemLabel = page.getByTestId('todo-item-label');
        this.deleteButton = page.getByTestId('todo-item-button');
        this.toggleAll = page.getByTestId('toggle-all');
        this.checkbox = page.getByTestId('todo-item-toggle');
        this.allTasks = page.getByRole('link', { name: 'All' });
        this.completedTasks = page.getByRole('link', { name: 'Completed' })
        this.activeTasks = page.getByRole('link', { name: 'Active' })
        this.clearCompletedButton = page.locator('.clear-completed')
    }

    async countTodosItems(): Promise<number> {
        const todosItemsLabels = this.page.getByTestId('todo-item-label');
        return await todosItemsLabels.count();
    }
}