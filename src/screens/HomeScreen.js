import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
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

export default function HomeScreen() {
  const { treinos, setTreinos, historico, salvarTreinos, registrarTreino } =
    useTreinos(treinoBase);
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  if (diaSelecionado) {
    return (
      <DiaTreinoScreen
        dia={diaSelecionado}
        treinos={treinos}
        salvarTreinos={salvarTreinos}
        registrarTreino={registrarTreino}
        voltar={() => setDiaSelecionado(null)}
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
      <Calendar
        markedDates={Object.fromEntries(
          Object.entries(historico).map(([data, cor]) => [
            data,
            { marked: true, dotColor: cor === "verde" ? "green" : "red" },
          ])
        )}
      />
    </ScrollView>
  );
}
