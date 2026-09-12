import type { Board } from '../models/types'

export function createDummyBoard(): Board {
  return {
    columns: [
      {
        id: 'col-backlog',
        title: 'Backlog',
        cards: [
          {
            id: 'card-brand',
            title: 'Refresh brand guidelines',
            details: 'Update color tokens and type scale for the marketing site.',
          },
          {
            id: 'card-onboard',
            title: 'Draft onboarding copy',
            details: 'Write the first-run checklist for new workspace members.',
          },
        ],
      },
      {
        id: 'col-ready',
        title: 'Ready',
        cards: [
          {
            id: 'card-api',
            title: 'Specify billing API',
            details: 'Document endpoints for invoices and payment methods.',
          },
        ],
      },
      {
        id: 'col-progress',
        title: 'In Progress',
        cards: [
          {
            id: 'card-board',
            title: 'Build board layout',
            details: 'Five columns, card title and details, drag between columns.',
          },
          {
            id: 'card-rename',
            title: 'Column rename',
            details: 'Allow each of the five columns to be renamed inline.',
          },
        ],
      },
      {
        id: 'col-review',
        title: 'Review',
        cards: [
          {
            id: 'card-a11y',
            title: 'Keyboard drag review',
            details: 'Confirm cards can be moved with pointer and keyboard.',
          },
        ],
      },
      {
        id: 'col-done',
        title: 'Done',
        cards: [
          {
            id: 'card-palette',
            title: 'Lock color palette',
            details: 'Navy headings, gray labels, yellow accents, blue links, purple actions.',
          },
        ],
      },
    ],
  }
}
