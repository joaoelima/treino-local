import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";

export default function DiaTreinoScreen({
  dia,
  treinos,
  salvarTreinos,
  registrarTreino,
  voltar,
}) {
  const [editando, setEditando] = useState(false);
  const [listaEditavel, setListaEditavel] = useState([...treinos[dia]]);

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

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <TouchableOpacity onPress={voltar} style={{ marginBottom: 10 }}>
        <Text style={{ color: "blue" }}>⬅ Voltar</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        {dia}
      </Text>

      <FlatList
        data={editando ? listaEditavel : treinos[dia]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
          >
            {editando ? (
              <>
                <TextInput
                  value={item.nome}
                  onChangeText={(txt) => {
                    const novaLista = [...listaEditavel];
                    novaLista[index].nome = txt;
                    setListaEditavel(novaLista);
                  }}
                  style={{
                    borderWidth: 1,
                    padding: 8,
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
                    padding: 8,
                    borderRadius: 5,
                  }}
                />
              </>
            ) : (
              <Text style={{ fontSize: 16 }}>
                {item.nome} - {item.series}
              </Text>
            )}
          </View>
        )}
      />

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

      {!editando && (
        <TouchableOpacity
          onPress={registrarTreino}
          style={{
            backgroundColor: "green",
            padding: 12,
            borderRadius: 8,
            marginTop: 15,
          }}
        >
          <Text style={{ textAlign: "center", color: "#fff" }}>
            Concluir Treino
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
