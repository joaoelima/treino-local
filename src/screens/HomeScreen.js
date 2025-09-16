import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DiaTreinoScreen from "./DiaTreinoScreen";
import useTreinos from "../hooks/useTreinos";

const treinoBase = {
  Segunda: [
    { nome: "Supino Máquina", series: "4x12,10,8,8" },
    { nome: "Supino Máquina Articulado", series: "4x12,10,8,8" },
    { nome: "Voador", series: "4x12 (pico 2s)" },
    { nome: "Desenvolvimento Máquina", series: "4x12,10,8,8" },
    { nome: "Tríceps Pulley Barra W", series: "4x12" },
    { nome: "Tríceps Francês", series: "4x12" },
    { nome: "Abdominal", series: "" },
  ],
  Terça: [
    { nome: "Pulley Pronado", series: "10x10" },
    { nome: "Pulley Supinado", series: "4x12" },
    { nome: "Remada Baixa Fechada", series: "4x12,10,8,8" },
    { nome: "Remada Articulada Fechada", series: "4x12" },
    { nome: "Voador Inverso", series: "4x12 (pico 2s)" },
    { nome: "Rosca Direta Barra W", series: "4x12" },
    { nome: "Rosca Inclinada Cross", series: "4x12" },
    { nome: "Abdominal", series: "" },
  ],
  Quarta: [
    { nome: "Agachamento Smith", series: "4x12" },
    { nome: "Leg Press 45", series: "4x12,10,8,8" },
    { nome: "Cadeira Extensora", series: "4x12" },
    { nome: "Flexora Deitado", series: "4x12" },
    { nome: "Cadeira Abdutora", series: "4x15 (3s contração)" },
    { nome: "Panturrilha em Pé", series: "4x12" },
  ],
  Quinta: [
    { nome: "Supino Máquina", series: "4x12" },
    { nome: "Desenvolvimento Halteres", series: "4x12,10,8,8" },
    { nome: "Remada Baixa Fechada", series: "4x10" },
    { nome: "Pulley", series: "4x12" },
    { nome: "Rosca Scott", series: "4x12 (3s contração)" },
    { nome: "Tríceps Testa + Polia Barra", series: "4x12" },
    { nome: "Abdominal", series: "" },
  ],
  Sexta: [
    { nome: "Levantamento Terra Romeno", series: "4x12,10,8,8" },
    { nome: "Leg Press 45", series: "4x10" },
    { nome: "Flexora Deitado", series: "4x12" },
    { nome: "Cadeira Abdutora", series: "4x12" },
    { nome: "Abdominal", series: "" },
  ],
};

// --------- CALENDÁRIO CUSTOM ---------
function CalendarioCustom({ historico, setHistorico }) {
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth()); // 0=jan
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay(); // 0=Dom

  const toggleDia = async (dia) => {
    const dataKey = `${anoAtual}-${String(mesAtual + 1).padStart(
      2,
      "0"
    )}-${String(dia).padStart(2, "0")}`;

    const novo = { ...historico };
    if (novo[dataKey]) {
      delete novo[dataKey];
    } else {
      novo[dataKey] = "verde";
    }
    setHistorico(novo);
    await AsyncStorage.setItem("historico", JSON.stringify(novo));
  };

  const mudarMes = (delta) => {
    let novoMes = mesAtual + delta;
    let novoAno = anoAtual;

    if (novoMes < 0) {
      novoMes = 11;
      novoAno -= 1;
    } else if (novoMes > 11) {
      novoMes = 0;
      novoAno += 1;
    }

    setMesAtual(novoMes);
    setAnoAtual(novoAno);
  };

  const renderDias = () => {
    const dias = [];
    // Espaços antes do primeiro dia
    for (
      let i = 0;
      i < (primeiroDiaSemana === 0 ? 6 : primeiroDiaSemana - 1);
      i++
    ) {
      dias.push(<View key={`vazio-${i}`} style={styles.diaVazio} />);
    }

    for (let d = 1; d <= diasNoMes; d++) {
      const dataKey = `${anoAtual}-${String(mesAtual + 1).padStart(
        2,
        "0"
      )}-${String(d).padStart(2, "0")}`;
      const marcado = historico[dataKey];
      dias.push(
        <TouchableOpacity
          key={d}
          onPress={() => toggleDia(d)}
          style={[
            styles.dia,
            marcado
              ? { backgroundColor: "green" }
              : { backgroundColor: "#eee" },
          ]}
        >
          <Text style={{ color: marcado ? "#fff" : "#000" }}>{d}</Text>
        </TouchableOpacity>
      );
    }
    return dias;
  };

  return (
    <View style={{ marginTop: 20 }}>
      {/* Header com navegação */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => mudarMes(-1)}>
          <Text style={styles.seta}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>
          {new Date(anoAtual, mesAtual).toLocaleString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <TouchableOpacity onPress={() => mudarMes(1)}>
          <Text style={styles.seta}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Cabeçalho dos dias */}
      <View style={styles.semana}>
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
          <Text key={dia} style={styles.cabecalho}>
            {dia}
          </Text>
        ))}
      </View>

      {/* Dias */}
      <View style={styles.grade}>{renderDias()}</View>
    </View>
  );
}

// --------- HOMESCREEN ---------
export default function HomeScreen() {
  const { treinos, salvarTreinos, historico, setHistorico } =
    useTreinos(treinoBase);
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  // 👉 função para marcar automaticamente o dia atual ao concluir treino
  const registrarDiaConcluido = async () => {
    const hoje = new Date();
    const dataKey = `${hoje.getFullYear()}-${String(
      hoje.getMonth() + 1
    ).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

    const novo = { ...historico, [dataKey]: "verde" };
    setHistorico(novo);
    await AsyncStorage.setItem("historico", JSON.stringify(novo));
  };

  if (diaSelecionado) {
    return (
      <DiaTreinoScreen
        dia={diaSelecionado}
        treinos={treinos}
        salvarTreinos={salvarTreinos}
        voltar={() => setDiaSelecionado(null)}
        registrarDiaConcluido={registrarDiaConcluido} // 👈 passa pro filho
      />
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Dias da Semana
      </Text>
      {Object.keys(treinoBase).map((dia) => (
        <TouchableOpacity
          key={dia}
          onPress={() => setDiaSelecionado(dia)}
          style={{
            padding: 15,
            backgroundColor: "#eee",
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 18 }}>{dia}</Text>
        </TouchableOpacity>
      ))}

      <Text style={{ fontSize: 22, fontWeight: "bold", marginVertical: 20 }}>
        Calendário
      </Text>
      <CalendarioCustom historico={historico} setHistorico={setHistorico} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seta: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  semana: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  cabecalho: { width: 40, textAlign: "center", fontWeight: "bold" },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dia: {
    width: 40,
    height: 40,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  diaVazio: {
    width: 40,
    height: 40,
    margin: 2,
  },
});
