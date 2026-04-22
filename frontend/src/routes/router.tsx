import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/features/home/HomePage'
import { TaxFormPage } from '@/features/tax-form/TaxFormPage'
import { NotFoundPage } from './NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tax-form', element: <TaxFormPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
