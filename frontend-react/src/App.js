import "bootstrap/dist/css/bootstrap.min.css";

import Footer from "./components/Footer";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <div className="App">
      <AppRouter />
      {/* <Footer /> */}
    </div>
  );
}

export default App;
