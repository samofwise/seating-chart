import { Home } from "./components/pages/Home";
import { SeatingChartProvider } from "./contexts/SeatingChartContext";

const App = () => (
  <SeatingChartProvider>
    <Home />
  </SeatingChartProvider>
);

export default App;
