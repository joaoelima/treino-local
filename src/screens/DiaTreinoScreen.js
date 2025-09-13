import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
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
    <View style={styles.container}>
      <TouchableOpacity onPress={voltar} style={{ marginBottom: 10 }}>
        <Text style={{ color: "blue" }}>⬅ Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.titulo}>{dia}</Text>
      <FlatList
        data={treinos[dia]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.texto}>
              {item.nome} - {item.series}
            </Text>
          </View>
        )}
      />
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.botaoAdicionar}
      >
        <Text style={styles.textoBotao}>Adicionar Exercício</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={registrarTreino} style={styles.botaoConcluir}>
        <Text style={styles.textoBotao}>Concluir Treino</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.tituloModal}>Novo Exercício</Text>
          <TextInput
            placeholder="Nome"
            value={novoExercicio}
            onChangeText={setNovoExercicio}
            style={styles.input}
          />
          <TextInput
            placeholder="Séries"
            value={novaSerie}
            onChangeText={setNovaSerie}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={adicionarExercicio}
            style={styles.botaoConcluir}
          >
            <Text style={styles.textoBotao}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.botaoCancelar}
          >
            <Text style={styles.textoBotao}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Força fundo branco
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  texto: {
    fontSize: 16,
  },
  botaoAdicionar: {
    backgroundColor: "orange",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  botaoConcluir: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  botaoCancelar: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  textoBotao: {
    textAlign: "center",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff", // Modal também com fundo branco
    padding: 20,
  },
  tituloModal: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
});
