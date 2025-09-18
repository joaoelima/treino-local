import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DiaTreinoScreen from "./DiaTreinoScreen";
import useTreinos from "../hooks/useTreinos";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

const treinoBase = {
  Segunda: [
    { nome: "Supino Inclinado Barra", series: "4x12" },
    { nome: "Supino Máquina Articulado", series: "4x12,10,8,8" },
    { nome: "Voador", series: "4x12 (pico 2s)" },
    { nome: "Desenvolvimento Máquina", series: "4x12,10,8,8" },
    { nome: "Tríceps Pulley Barra W", series: "4x12" },
    { nome: "Tríceps Francês", series: "4x12" },
    { nome: "Abdominal", series: "3x15" },
  ],
  Terça: [
    { nome: "Pulley Pronado", series: "10x10" },
    { nome: "Pulley Supinado", series: "4x12" },
    { nome: "Remada Baixa Fechada", series: "4x12,10,8,8" },
    { nome: "Remada Articulada Fechada", series: "4x12" },
    { nome: "Voador Inverso", series: "4x12 (pico 2s)" },
    { nome: "Rosca Direta Barra W", series: "4x12" },
    { nome: "Rosca Inclinada Cross", series: "4x12" },
    { nome: "Abdominal", series: "3x15" },
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
    { nome: "Elevação Lateral", series: "4x12" },
    { nome: "Encolhimento", series: "4x12" },
    { nome: "Abdominal", series: "3x15" },
  ],
  Sexta: [
    { nome: "Levantamento Terra Romeno", series: "4x12,10,8,8" },
    { nome: "Leg Press 45", series: "4x10" },
    { nome: "Flexora Deitado", series: "4x12" },
    { nome: "Cadeira Abdutora", series: "4x12" },
    { nome: "Elevação Lateral", series: "4x12" },
    { nome: "Encolhimento", series: "4x12" },
    { nome: "Abdominal", series: "3x15" },
  ],
};

// --------- CALENDÁRIO CUSTOM ---------
function CalendarioCustom({ historico, setHistorico }) {
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();

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

      <View style={styles.semana}>
        {["S", "T", "Q", "Q", "S", "S", "D"].map((dia, i) => (
          <Text key={i} style={styles.cabecalho}>
            {dia}
          </Text>
        ))}
      </View>

      <View style={styles.grade}>{renderDias()}</View>
    </View>
  );
}

// --------- HOMESCREEN ---------
export default function HomeScreen() {
  const { treinos, salvarTreinos, historico, setHistorico } =
    useTreinos(treinoBase);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [editandoNome, setEditandoNome] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [dias, setDias] = useState(
    Object.keys(treinos).map((dia) => ({
      key: dia,
      label: dia,
    }))
  );

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
        registrarDiaConcluido={registrarDiaConcluido}
      />
    );
  }

  const handleRenomear = (diaAntigo, diaNovo) => {
    if (!diaNovo.trim() || treinos[diaNovo]) return;

    // Atualiza treinos no AsyncStorage
    const novoTreinos = { ...treinos };
    novoTreinos[diaNovo] = novoTreinos[diaAntigo];
    delete novoTreinos[diaAntigo];
    salvarTreinos(novoTreinos);

    // Atualiza lista local (dias) imediatamente
    const novosDias = dias.map((d) =>
      d.key === diaAntigo ? { ...d, key: diaNovo, label: diaNovo } : d
    );
    setDias(novosDias);

    setEditandoNome(null);
  };

  const handleReorder = (novaOrdem) => {
    const novoTreinos = {};
    novaOrdem.forEach((item) => {
      novoTreinos[item.key] = treinos[item.key];
    });
    salvarTreinos(novoTreinos);
    setDias(novaOrdem); // Atualiza lista local na hora
  };

  const renderItem = ({ item, drag, isActive }) => (
    <ScaleDecorator>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          opacity: isActive ? 0.7 : 1,
        }}
      >
        <TouchableOpacity
          onPress={() => setDiaSelecionado(item.key)}
          style={{
            flex: 1,
            padding: 15,
            backgroundColor: "#eee",
            borderRadius: 8,
          }}
        >
          {editandoNome === item.key ? (
            <TextInput
              value={novoNome}
              onChangeText={setNovoNome}
              onSubmitEditing={() => handleRenomear(item.key, novoNome)}
              onBlur={() => setEditandoNome(null)} // fecha ao clicar fora
              style={{
                borderWidth: 1,
                padding: 6,
                borderRadius: 5,
                backgroundColor: "#fff",
              }}
              autoFocus
            />
          ) : (
            <Text style={{ fontSize: 18 }}>{item.label}</Text>
          )}
        </TouchableOpacity>

        {/* Editar nome */}
        <TouchableOpacity
          onPress={() => {
            setEditandoNome(item.key);
            setNovoNome(item.key);
          }}
          style={{ marginLeft: 5 }}
        >
          <Text style={{ color: "blue" }}>✎</Text>
        </TouchableOpacity>

        {/* Handle para arrastar */}
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={{ marginLeft: 10 }}
        >
          <Text style={{ fontSize: 22 }}>⋮⋮</Text>
        </TouchableOpacity>
      </View>
    </ScaleDecorator>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Dias da Semana
      </Text>

      <DraggableFlatList
        data={dias}
        onDragEnd={({ data }) => handleReorder(data)}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
      />

      <Text style={{ fontSize: 22, fontWeight: "bold", marginVertical: 20 }}>
        Calendário
      </Text>
      <CalendarioCustom historico={historico} setHistorico={setHistorico} />
    </KeyboardAvoidingView>
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
  cabecalho: {
    width: 40, // igual ao quadradinho do dia
    height: 40, // opcional, se quiser centralizar verticalmente
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 40, // centraliza no meio, igual aos números
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
