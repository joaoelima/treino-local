import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import CheckBox from "expo-checkbox";

export default function DiaTreinoScreen({
  dia,
  treinos,
  salvarTreinos,
  registrarDiaConcluido, // 👈 vem do HomeScreen
  voltar,
}) {
  const [editando, setEditando] = useState(false);
  const [listaEditavel, setListaEditavel] = useState([...treinos[dia]]);
  const [checks, setChecks] = useState(treinos[dia].map(() => false));

  // Atualiza sempre que mudar o dia ou a lista de treinos
  useEffect(() => {
    setChecks(treinos[dia].map(() => false));
    setListaEditavel([...treinos[dia]]);
  }, [dia, treinos]);

  const salvarEdicao = () => {
    const novos = { ...treinos, [dia]: listaEditavel };
    salvarTreinos(novos);
    setEditando(false);
  };

  const excluirTodos = () => {
    const novos = { ...treinos, [dia]: [] };
    salvarTreinos(novos);
    setEditando(false);
  };

  const adicionarExercicio = () => {
    const novos = [
      ...listaEditavel,
      { nome: "Novo Exercício", series: "4x10" },
    ];
    setListaEditavel(novos);
    salvarTreinos({ ...treinos, [dia]: novos });
  };

  const toggleCheck = (index) => {
    const novos = [...checks];
    novos[index] = !novos[index];
    setChecks(novos);
  };

  const todosConcluidos = checks.every((item) => item);

  const concluirTreino = () => {
    if (todosConcluidos) {
      registrarDiaConcluido(); // Marca no calendário
      voltar(); // Volta para a HomeScreen
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      {/* Voltar */}
      <TouchableOpacity onPress={voltar} style={{ marginBottom: 10 }}>
        <Text style={{ color: "blue" }}>⬅ Voltar</Text>
      </TouchableOpacity>

      {/* Nome do dia */}
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        {dia}
      </Text>

      {/* Lista de exercícios */}
      <FlatList
        data={editando ? listaEditavel : treinos[dia]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
          >
            {!editando && (
              <CheckBox
                value={checks[index]}
                onValueChange={() => toggleCheck(index)}
                style={{ marginRight: 10 }}
              />
            )}

            {editando ? (
              <View style={{ flex: 1 }}>
                <TextInput
                  value={item.nome}
                  onChangeText={(txt) => {
                    const novaLista = [...listaEditavel];
                    novaLista[index].nome = txt;
                    setListaEditavel(novaLista);
                  }}
                  style={{
                    borderWidth: 1,
                    padding: 6,
                    marginBottom: 5,
                    borderRadius: 5,
                  }}
                />
                <TextInput
                  value={item.series}
                  onChangeText={(txt) => {
                    const novaLista = [...listaEditavel];
                    novaLista[index].series = txt;
                    setListaEditavel(novaLista);
                  }}
                  style={{
                    borderWidth: 1,
                    padding: 6,
                    borderRadius: 5,
                  }}
                />
              </View>
            ) : (
              <Text style={{ fontSize: 16 }}>
                {item.nome} - {item.series}
              </Text>
            )}
          </View>
        )}
      />

      {/* Botões */}
      {!editando ? (
        <>
          <TouchableOpacity
            onPress={() => setEditando(true)}
            style={{
              backgroundColor: "blue",
              padding: 12,
              borderRadius: 8,
              marginVertical: 5,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={adicionarExercicio}
            style={{
              backgroundColor: "orange",
              padding: 12,
              borderRadius: 8,
              marginVertical: 5,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Adicionar Exercício
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={excluirTodos}
            style={{
              backgroundColor: "red",
              padding: 12,
              borderRadius: 8,
              marginVertical: 5,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Excluir Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={concluirTreino}
            disabled={!todosConcluidos}
            style={{
              backgroundColor: todosConcluidos ? "green" : "gray",
              padding: 12,
              borderRadius: 8,
              marginTop: 15,
            }}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>
              Concluir Treino
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={salvarEdicao}
            style={{
              backgroundColor: "green",
              padding: 12,
              borderRadius: 8,
              marginVertical: 5,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setEditando(false)}
            style={{
              backgroundColor: "gray",
              padding: 12,
              borderRadius: 8,
              marginVertical: 5,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Cancelar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
