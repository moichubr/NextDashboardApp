"use server"; //al declararlo de uso del servidor, todas las funciones aqui creadas seran Server Actions (pueden ser usadas dentro de componentes de servidor como de componentes de cliente). You can also write Server Actions directly inside Server Components by adding "use server" inside the action. But for this course, we'll keep them all organized in a separate file.
import { z } from "zod"; //librería para hacer validaciones de typo en typescript
import { sql } from "@vercel/postgres"; //para hacer las request a la bdd
import { revalidatePath } from "next/cache"; //actualizar el cache del browser del cliente con la nueva informacion de la bdd
import { redirect } from "next/navigation"; //para redirigir al usuario a la pagina que queremos que vaya

//--!MI ARCHIVO DE SERVER ACTIONS!!!

// Tip: If you're working with forms that have many fields, you may want to consider using the entries()
// method with JavaScript's Object.fromEntries()

// . For example:

// const rawFormData = Object.fromEntries(formData.entries())

//PARA VALIDAR LOS TIPOS DE TYPESCRIPT ANTES DE MANDAR LA DATA A LA BDD
const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), //se lo coerce a cambiar de string a number validando el tipo
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });

//FUNCION QUE CREA UN INVOICE
export default async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    //de esta manera hago la validacion de tipo con el .parse()
    customerId: formData.get("customerId"), //método para extraer la informacion
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100; //It's usually good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy.
  const date = new Date().toISOString().split("T")[0]; //fecha actual

  //guardar en bdd --> Insertar en la tabla invoices en las columnas XX XX XX los valores XX XX XX
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date) 
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
  } catch (error) {
    return {
      message: "Database error. Fail to create Invoice.",
    };
  }
  revalidatePath("/dashboard/invoices"); //me trae la nueva info actualizada con lo que acabo de guardar
  redirect("/dashboard/invoices"); // redirijo a la pagina de invoices (estaba en createInvoice)
}

// Use Zod to update the expected types
const UpdateInvoice = InvoiceSchema.omit({ date: true, id: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;
  try {
      await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return {
        message: 'Database Error. Failed to update invoice.'
    }
  }

  revalidatePath("/dashboard/invoices"); //clear cache and make a new request
  redirect("/dashboard/invoices");
}

//DELETE
const DeleteInvoice = InvoiceSchema.omit({ date: true, id: true });

export async function deleteInvoice(id: string) {
    // throw new Error('Fail to delete invoice')
    try {
        await sql`
          DELETE FROM invoices WHERE id = ${id}
          `;
          return {
            message: 'Deleted Invoice'
          }
    } catch (error) {
        return {
            message: 'Database Error. Failed to Delete Invoice.'
        }
        
    }

  revalidatePath("/dashboard/invoices");
}
