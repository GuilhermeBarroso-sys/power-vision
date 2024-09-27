import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { AuthContext } from '../../App';
import { useIsFocused } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { AntDesign } from '@expo/vector-icons';

interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export function ProductScreen({ navigation }: any) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { authToken, userId } = useContext(AuthContext);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleDeleteModal = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://api.devgui.info/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        Alert.alert('Erro', 'Falha ao buscar produtos.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao buscar os produtos.');
    }
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchProducts();
    }
  }, [isFocused]);

  const openProductInfo = (productId: string) => {
    navigation.navigate('ProductInfo', { productId });
  };

  const addProduct = async () => {
    if (!name || !price || !quantity) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      imageUrl: null,
      userId,
    };

    try {
      const response = await fetch('https://api.devgui.info/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
        toggleModal();
        fetchProducts();
        setName('');
        setDescription('');
        setPrice('');
        setQuantity('');
      } else {
        Alert.alert('Erro', 'Falha ao adicionar o produto.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar o produto.');
    }
  };

  const confirmDelete = (productId: string) => {
    setSelectedProductId(productId);
    toggleDeleteModal();
  };

  const deleteProduct = async () => {
    if (selectedProductId) {
      try {
        const response = await fetch(`https://api.devgui.info/products/${selectedProductId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          Alert.alert('Sucesso', 'Produto excluído com sucesso!');
          toggleDeleteModal();
          fetchProducts();
        } else {
          Alert.alert('Erro', 'Falha ao excluir o produto.');
        }
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao excluir o produto.');
      }
    }
  };

  const exportCSV = async () => {
    try {
      const csvHeader = 'Nome,Descrição,Preço,Quantidade\n';
      const csvRows = products
        .map(product =>
          `${product.name},${product.description},${product.price},${product.quantity}`
        )
        .join('\n');
      const csvData = csvHeader + csvRows;

      const fileUri = `${FileSystem.documentDirectory}products.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Erro', 'Compartilhamento de arquivo não disponível.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao exportar os dados.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.exportButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
          <Text style={styles.addButtonText}>Adicionar Produto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportButton} onPress={exportCSV}>
          <Text style={styles.exportButtonText}>Exportar CSV</Text>

        </TouchableOpacity>

      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <TouchableOpacity onPress={() => openProductInfo(item.id)}>
              <View style={styles.productItemTitle}>

                <Text style={styles.productText}>{item.name}</Text>
                {/* <Text>-</Text> */}

                {/* <Text style={styles.productTextBold}>{item.quantity}</Text> */}
              </View>
            </TouchableOpacity>
            <View style={styles.productDetails}>
              <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                <AntDesign name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />




      {/* Confirm Delete Modal */}
      <Modal visible={isDeleteModalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
              <Text>Tem certeza de que deseja excluir este produto?</Text>

              <TouchableOpacity style={styles.modalButton} onPress={deleteProduct}>
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={toggleDeleteModal}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Add Product Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Novo Produto</Text>

              <Text style={styles.label}>Nome do Produto</Text>
              <TextInput
                placeholder="Nome do Produto"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>Descrição do Produto</Text>
              <TextInput
                placeholder="Descrição do Produto"
                style={styles.input}
                value={description}
                onChangeText={setDescription}
              />

              <Text style={styles.label}>Preço</Text>
              <TextInput
                placeholder="Preço"
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />

              <Text style={styles.label}>Quantidade</Text>
              <TextInput
                placeholder="Quantidade"
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />

              <TouchableOpacity style={styles.modalButton} onPress={addProduct}>
                <Text style={styles.modalButtonText}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={toggleModal}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 1,
    backgroundColor: '#f5f5f5',
  },
  productItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  productItemTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productText: {
    fontSize: 18,
    color: '#333',
  },
  productTextBold: {
    fontSize: 18,
    color: '#333',
    fontWeight: "600"
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  exportButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    width: "40%",
    alignItems: 'center',
    marginTop: 20,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  exportButtonContainer: {
    display: "flex",
    marginBottom: 20,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    color: '#4CAF50',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
    color: '#4CAF50',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalButtonCancel: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
});
