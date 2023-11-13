import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page({params} : {params : {id : string}}) {
    const id = params.id //se lo paso a la URL de edicion

    const [invoice, customers] = await Promise.all([ //con Promise.all hago el fetch de ambas acciones en paralelo.
        fetchInvoiceById(id),
        fetchCustomers(),
    ])

    //notFound es una funcion de next que muestra una UI de not found.
    if(!invoice) {
        notFound()
    }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}