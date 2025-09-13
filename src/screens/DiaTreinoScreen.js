import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";

export default function DiaTreinoScreen({
  dia,
  treinos,
  salvarTreinos,
  registrarTreino,
  voltar,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [novoExercicio, setNovoExercicio] = useState("");
  const [novaSerie, setNovaSerie] = useState("");

  const adicionarExercicio = async () => {
    if (!novoExercicio) return;
    const novos = { ...treinos };
    novos[dia].push({ nome: novoExercicio, series: novaSerie });
    salvarTreinos(novos);
    setNovoExercicio("");
    setNovaSerie("");
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity onPress={voltar} style={{ marginBottom: 10 }}>
        <Text style={{ color: "blue" }}>⬅ Voltar</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        {dia}
      </Text>
      <FlatList
        data={treinos[dia]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}
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
        onPress={registrarTreino}
        style={{ backgroundColor: "green", padding: 10, borderRadius: 8 }}
      >
        <Text style={{ textAlign: "center", color: "#fff" }}>
          Concluir Treino
        </Text>
      </TouchableOpacity>

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
    </View>
  );
}
