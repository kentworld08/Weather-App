import "./App.css";
import { CountryWeatherData } from "./Components/CountryWeatherData";
import { Navbar } from "./Components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <CountryWeatherData />
    </>
  );
}

export default App;
