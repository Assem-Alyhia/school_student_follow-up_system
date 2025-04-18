import { router , dashboardRoutes} from "./router";
import { RouterProvider } from "react-router-dom";


function App() {
  return (

    <RouterProvider router={router} dashboardRoutes={dashboardRoutes}/>
  );
}

export default App;
