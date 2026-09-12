import { expect, test } from '@playwright/test'

test.describe('Kanban board', () => {
  test('loads dummy columns and cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('board')).toBeVisible()
    await expect(page.getByTestId('column-title-col-backlog')).toHaveText('Backlog')
    await expect(page.getByTestId('column-title-col-ready')).toHaveText('Ready')
    await expect(page.getByTestId('column-title-col-progress')).toHaveText('In Progress')
    await expect(page.getByTestId('column-title-col-review')).toHaveText('Review')
    await expect(page.getByTestId('column-title-col-done')).toHaveText('Done')
    await expect(page.getByTestId('card-brand')).toContainText('Refresh brand guidelines')
  })

  test('renames a column', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('column-title-col-backlog').click()
    const input = page.getByTestId('column-title-input-col-backlog')
    await input.fill('Icebox')
    await input.press('Enter')
    await expect(page.getByTestId('column-title-col-backlog')).toHaveText('Icebox')
  })

  test('adds a card to a column', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('add-toggle-col-ready').click()
    await page.getByTestId('add-title-col-ready').fill('Ship release notes')
    await page.getByTestId('add-details-col-ready').fill('Publish the changelog on Friday.')
    await page.getByTestId('add-submit-col-ready').click()
    await expect(page.getByTestId('column-col-ready')).toContainText('Ship release notes')
    await expect(page.getByTestId('column-col-ready')).toContainText('Publish the changelog on Friday.')
  })

  test('deletes a card', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('delete-card-a11y').click()
    await expect(page.getByTestId('card-a11y')).toHaveCount(0)
  })

  test('drags a card to another column', async ({ page }) => {
    await page.goto('/')
    const card = page.getByTestId('card-brand').locator('.card-body')
    const done = page.getByTestId('column-col-done')
    await card.dragTo(done, { targetPosition: { x: 80, y: 120 }, steps: 25 })
    await expect(done).toContainText('Refresh brand guidelines')
    await expect(page.getByTestId('column-col-backlog')).not.toContainText('Refresh brand guidelines')
  })
})
