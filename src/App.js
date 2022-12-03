import { useEffect, useState } from "react";
import DataProcessor from './Components/DataProcessor'
import Castells from './Components/Castells'
import './style.css'

function App() {
  const [diades, setCastells] = useState({});
  const [puntuacions, setPuntuacions] = useState({});

  const exports = {
    'diades': diades,
    'setCastells': setCastells,
    'puntuacions': puntuacions,
    'setPuntuacions': setPuntuacions
  };

  useEffect(() => {
  }, [diades]);
  useEffect(() => {
  }, [puntuacions]);

  return (
    <>
      <DataProcessor {...exports} />
      <Castells {...exports} />
    </>
  );
}

export default App;
