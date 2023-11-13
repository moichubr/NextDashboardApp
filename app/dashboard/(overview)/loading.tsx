import DashboardSkeleton from '@/app/ui/skeletons';

export default function Loading() {
    return <DashboardSkeleton />;
  }

  //loading es un archivo especial de next que permite generar una UI para que el usuario vea mientras se carga el contenido dinámico 
//de la pagina. El contenido estatico como por ejemplo la nav bar o side bar, se cargan automaticamente y el usuario puede entonces
//ver este contenido estatico, interactuar si quiere con el, mientras espera la carga de lo demas. Esto se denomina navegacion ininterrumpida

// Route groups allow you to organize files into logical groups without affecting the URL path structure. When you create a new folder using parentheses (), the name won't be included in the URL path. So /dashboard/(overview)/page.tsx becomes /dashboard.
// Here, you're using a route group to ensure loading.tsx only applies to your dashboard overview page. However, you can also use route groups to separate your application into sections (e.g. (marketing) routes and (dashboard) routes) or by teams for larger applications.