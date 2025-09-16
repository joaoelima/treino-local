import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useTreinos(treinoBase) {
  const [treinos, setTreinos] = useState(treinoBase);
  const [historico, setHistorico] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const dataSalva = await AsyncStorage.getItem("treinos");
        const histSalvo = await AsyncStorage.getItem("historico");
        if (dataSalva) setTreinos(JSON.parse(dataSalva));
        if (histSalvo) setHistorico(JSON.parse(histSalvo));
      } catch (e) {
        console.log("Erro ao carregar storage:", e);
      }
    })();
  }, []);

  const salvarTreinos = async (novos) => {
    try {
      setTreinos(novos);
      await AsyncStorage.setItem("treinos", JSON.stringify(novos));
    } catch (e) {
      console.log("Erro ao salvar treinos:", e);
    }
  };

  return { treinos, setTreinos, historico, setHistorico, salvarTreinos };
}
