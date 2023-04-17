import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";

import Footer from "./components/Footer";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AppRouter />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
