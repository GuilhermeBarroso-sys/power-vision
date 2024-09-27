import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { AuthContext } from '../../App';

interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

export function ProductInfoScreen({ route }: any) {
  const { productId } = route.params;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const { authToken, userId } = useContext(AuthContext);
  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`https://api.devgui.info/products/${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: IProduct = await response.json();
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price.toString());
        setQuantity(data.quantity.toString());
      } else {
        Alert.alert('Erro', 'Falha ao buscar detalhes do produto.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao buscar os detalhes do produto.');
    }
  };

  const calculateTotalPrice = () => {
    const priceNumber = parseFloat(price.replace(',', '.'));
    const quantityNumber = parseInt(quantity);
    return isNaN(priceNumber) || isNaN(quantityNumber) ? 0 : priceNumber * quantityNumber;
  };

  const handleUpdateProduct = async () => {
    const priceNumber = parseFloat(price.replace(',', '.'));
    const quantityNumber = parseInt(quantity);

    if (isNaN(priceNumber) || isNaN(quantityNumber)) {
      Alert.alert('Erro', 'Preço ou quantidade inválidos.');
      return;
    }

    const updatedProduct = {
      name,
      description,
      price: priceNumber,
      quantity: quantityNumber,
      userId
    };

    try {
      const response = await fetch(`https://api.devgui.info/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      } else {
        console.log(response.ok, response.status, await response.json(), updatedProduct)
        Alert.alert('Erro', 'Falha ao atualizar o produto.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o produto.');
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.label}>Nome do Produto</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nome do Produto"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição"
        />

        <Text style={styles.label}>Quantidade</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="Quantidade"
        />

        <Text style={styles.label}>Preço</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={(text) => setPrice(text.replace(/[^0-9.,]/g, ''))}
          keyboardType="decimal-pad"
          placeholder="Preço"
        />

        <Text style={styles.label}>Preço Total</Text>
        <Text style={styles.totalPrice}>{`R$ ${calculateTotalPrice().toFixed(2).replace('.', ',')}`}</Text>


        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProduct}>
          {/* Wrap button text in a <Text> component */}
          <Text style={styles.buttonText}>Atualizar Produto</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
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
  totalPrice: {
    fontSize: 18,
    color: '#333',
    marginVertical: 10,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
