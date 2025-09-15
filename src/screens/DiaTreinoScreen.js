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
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [novoExercicio, setNovoExercicio] = useState("");
  const [novaSerie, setNovaSerie] = useState("");
  const [checked, setChecked] = useState(
    treinos[dia].map(() => false) // inicia todos como "não concluído"
  );

  // Adicionar ou editar exercício
  const salvarExercicio = () => {
    if (!novoExercicio) return;
    const novos = { ...treinos };

    if (editandoIndex !== null) {
      // edição
      novos[dia][editandoIndex] = { nome: novoExercicio, series: novaSerie };
    } else {
      // novo
      novos[dia].push({ nome: novoExercicio, series: novaSerie });
      setChecked([...checked, false]); // adiciona check vazio para o novo
    }

    salvarTreinos(novos);
    setNovoExercicio("");
    setNovaSerie("");
    setEditandoIndex(null);
    setModalVisible(false);
  };

  // Excluir exercício
  const excluirExercicio = (index) => {
    const novos = { ...treinos };
    novos[dia].splice(index, 1);
    salvarTreinos(novos);

    const novosChecks = [...checked];
    novosChecks.splice(index, 1);
    setChecked(novosChecks);
  };

  // Editar exercício
  const editarExercicio = (item, index) => {
    setNovoExercicio(item.nome);
    setNovaSerie(item.series);
    setEditandoIndex(index);
    setModalVisible(true);
  };

  // Marcar exercício concluído
  const toggleCheck = (index) => {
    const novosChecks = [...checked];
    novosChecks[index] = !novosChecks[index];
    setChecked(novosChecks);
  };

  // Só libera concluir se todos marcados
  const todosConcluidos = checked.every((c) => c);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={voltar} style={{ marginBottom: 10 }}>
        <Text style={{ color: "blue" }}>⬅ Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.titulo}>{dia}</Text>

      <FlatList
        data={treinos[dia]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <TouchableOpacity onPress={() => toggleCheck(index)}>
              <Text style={{ fontSize: 16 }}>
                {checked[index] ? "✅" : "⬜"} {item.nome} - {item.series}
              </Text>
            </TouchableOpacity>
            <View style={styles.acoes}>
              <TouchableOpacity
                onPress={() => editarExercicio(item, index)}
                style={styles.botaoEditar}
              >
                <Text style={styles.textoBotao}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => excluirExercicio(index)}
                style={styles.botaoExcluir}
              >
                <Text style={styles.textoBotao}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.botaoAdicionar}
      >
        <Text style={styles.textoBotao}>Adicionar Exercício</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={registrarTreino}
        style={[
          styles.botaoConcluir,
          { backgroundColor: todosConcluidos ? "green" : "gray" },
        ]}
        disabled={!todosConcluidos}
      >
        <Text style={styles.textoBotao}>Concluir Treino</Text>
      </TouchableOpacity>

      {/* Modal para adicionar/editar */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.tituloModal}>
            {editandoIndex !== null ? "Editar Exercício" : "Novo Exercício"}
          </Text>
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
            onPress={salvarExercicio}
            style={styles.botaoConcluir}
          >
            <Text style={styles.textoBotao}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              setEditandoIndex(null);
            }}
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
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  acoes: { flexDirection: "row" },
  botaoEditar: {
    backgroundColor: "blue",
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  botaoExcluir: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  botaoAdicionar: {
    backgroundColor: "orange",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  botaoConcluir: {
    padding: 10,
    borderRadius: 8,
  },
  textoBotao: { color: "#fff", textAlign: "center" },
  modalContainer: { flex: 1, backgroundColor: "#fff", padding: 20 },
  tituloModal: { fontSize: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
});
