import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar } from "react-native-calendars";

export default function App() {
  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

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

  const [treinos, setTreinos] = useState(treinoBase);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [historico, setHistorico] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [novoExercicio, setNovoExercicio] = useState("");
  const [novaSerie, setNovaSerie] = useState("");

  useEffect(() => {
    (async () => {
      const dataSalva = await AsyncStorage.getItem("treinos");
      const histSalvo = await AsyncStorage.getItem("historico");
      if (dataSalva) setTreinos(JSON.parse(dataSalva));
      if (histSalvo) setHistorico(JSON.parse(histSalvo));
    })();
  }, []);

  const salvarTreinos = async (novos) => {
    setTreinos(novos);
    await AsyncStorage.setItem("treinos", JSON.stringify(novos));
  };

  const concluirTreino = async () => {
    const hoje = new Date().toISOString().split("T")[0];
    const novoHistorico = { ...historico, [hoje]: "verde" };
    setHistorico(novoHistorico);
    await AsyncStorage.setItem("historico", JSON.stringify(novoHistorico));
    setDiaSelecionado(null);
  };

  const adicionarExercicio = async () => {
    if (!novoExercicio) return;
    const novos = { ...treinos };
    novos[diaSelecionado].push({ nome: novoExercicio, series: novaSerie });
    salvarTreinos(novos);
    setNovoExercicio("");
    setNovaSerie("");
    setModalVisible(false);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      {!diaSelecionado ? (
        <>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
            Dias da Semana
          </Text>
          {diasSemana.map((dia) => (
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
          <Text
            style={{ fontSize: 22, fontWeight: "bold", marginVertical: 20 }}
          >
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
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setDiaSelecionado(null)}
            style={{ marginBottom: 10 }}
          >
            <Text style={{ color: "blue" }}>⬅ Voltar</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            {diaSelecionado}
          </Text>
          <FlatList
            data={treinos[diaSelecionado]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <Text style={{ fontSize: 16 }}>
                  {item.nome} - {item.series}
                </Text>
              </View>
            )}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              backgroundColor: "orange",
              padding: 10,
              marginVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>
              Adicionar Exercício
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={concluirTreino}
            style={{ backgroundColor: "green", padding: 10, borderRadius: 8 }}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>
              Concluir Treino
            </Text>
          </TouchableOpacity>
        </>
      )}

      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Novo Exercício</Text>
          <TextInput
            placeholder="Nome"
            value={novoExercicio}
            onChangeText={setNovoExercicio}
            style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
          />
          <TextInput
            placeholder="Séries"
            value={novaSerie}
            onChangeText={setNovaSerie}
            style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
          />
          <TouchableOpacity
            onPress={adicionarExercicio}
            style={{
              backgroundColor: "green",
              padding: 10,
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ backgroundColor: "red", padding: 10, borderRadius: 8 }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}
