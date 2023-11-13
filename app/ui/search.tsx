"use client"; //CUANDO TIENE ESTA DECLARACION HABILITA A UTILIZAR HOOKS Y LISTENERS - ES PARA "USO DEL CLIENTE"

// --> CONECTAR EL INPUT PARA GUARDAR LOS VALORES: un onChange = {(e) => {handleSearch(e.target.value)}}

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";  //LIBRERIA PARA REDUCIR LA CANTIDAD DE REQUESTS A LA BDD. en este caso esta configurado para que una vez que pasen 3 segundos desde que termino de tipear el usuario, recien se mande la busqueda.

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams(); //For update the URL with the search params
  const pathname = usePathname();
  const { replace } = useRouter();

  console.log(searchParams)

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams); // URLSearchParams is a Web API that provides utility methods for manipulating the URL query parameters. Instead of creating a complex string literal, you can use it to get the params string like ?page=1&query=a
    params.set('page', '1') //cuando hace una nueva busqueda, resetea page a 1

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`); //params.toString() translates this input into a URL-friendly format.
    //${pathname} is the current path
    // The replace(${pathname}?${params.toString()}); command updates the URL with the user's search data. For example, /dashboard/invoices?query=lee if the user searches for "lee".
    
  }, 500)

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
        // defaultvalue mantiene sincronizado el valor del input y de la query URL
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}

// !DATO
// defaultValue vs. value / Controlled vs. Uncontrolled

// If you're using state to manage the value of an input, you'd use the value attribute to make it a controlled component. This means React would manage the input's state.

// However, since you're not using state, you can use defaultValue. This means the native input will manage its own state. This is okay since you're saving the search query to the URL instead of state.
