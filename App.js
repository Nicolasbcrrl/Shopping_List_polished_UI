import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert } from 'react-native';
import { useState, useEffect} from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, remove } from'firebase/database';

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [listProd, setListProd] = useState([]);
  const firebaseConfig = {
    apiKey: "AIzaSyBM2rZPcIWxiSDjq6CanHcyMiUiMYQD_ag",
    authDomain: "shoppingfirebase-9e4a2.firebaseapp.com",
    databaseURL: "https://shoppingfirebase-9e4a2-default-rtdb.firebaseio.com",
    projectId: "shoppingfirebase-9e4a2",
    storageBucket: "shoppingfirebase-9e4a2.appspot.com",
    messagingSenderId: "608752225221",
    appId: "1:608752225221:web:c4e705b1b21e6408c959ac",
    measurementId: "G-5SV9WMBY46"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  // create a function to save the item into firebase
  const saveItem = () => { 
    if(product !== '' && amount !== '') {
      push(    
        ref(database, 'items/'),     
        { 'product': product, 'amount': amount 
      });
    }
    else {
      Alert.alert('Please enter product and amount');
    }
  }
  
  useEffect(() => {
    const itemsRef = ref(database, 'items/');  
    onValue(itemsRef, (snapshot) => {const data = snapshot.val(); 
      if(data !== null) {
       //const prods = Object.values(data);
        const prods = Object.keys(data).map((key) => ({
          key: key,
          product: data[key].product,
          amount: data[key].amount
        }));
        setListProd(prods);
      }
    })
  }, []);

  // create a function to delete the item from firebase
  const deleteItem = (key) => {
    const itemsRef = ref(database, 'items/' + key);
    console.log(key);
    remove(itemsRef);
  }
 

  
  return (
    <View style={styles.container}>

      <TextInput
        style={styles.textInputStyle}
        placeholder='Product'
        onChangeText={value => setProduct(value)}
        value={product}
      />

      <TextInput
        style={styles.textInputStyle}
        placeholder='Amount'
        onChangeText={value => setAmount(value)}
        value={amount}
      />

      <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', width: '75%' }}>
        <Button
            style={styles.buttonStyle}
            title="Save"
            onPress={saveItem}
        />
      </View>
      

      <View style={{ flexDirection: "column", justifyContent: 'center', alignItems: 'center', width: '100%', margin: 20 }}>
        <Text style= {{ color: 'blue', fontSize: 16, fontWeight: 'bold' }} >Shopping List</Text>
        <FlatList
            data={listProd}
            renderItem={({item}) =>
              <View style={styles.listContainer}>
                <Text>{item.product}, {item.amount}</Text>
                <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.key)}> delete</Text>
              </View>
            }
            keyExtractor={(item, index) => index.toString()}
        />
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100%'
  },
  inputStyle:{
    width:200,
    borderColor:'gray',
    borderWidth:1, 
    fontSize: 20
  },
  vue: {
    //mettre en page les trois vues dans la vues principale
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100%' 
  },
  buttonStyle: {
    width: 10,
    height: 10,
    margin: 20,
    alignContent: 'center',
  },
  textInputStyle: {
    width: 250,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin:10
  },
  listContainer: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }
});
