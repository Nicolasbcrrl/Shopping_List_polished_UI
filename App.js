import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, FlatList, Alert } from 'react-native';
import { useState, useEffect} from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, remove } from'firebase/database';
import { Header } from 'react-native-elements';
import { Input, Button, Icon, ListItem } from 'react-native-elements';

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
      setProduct('');
      setAmount('');
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
      <Header
        centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}
      />
      
      <Input
        label="PRODUCT"
        placeholder='Product'
        onChangeText={value => setProduct(value)}
        value={product}
      />

      <Input
        label="AMOUNT"
        placeholder='Amount'
        onChangeText={value => setAmount(value)}
        value={amount}
      />
      <Button
        containerStyle={{width: 200, marginHorizontal: 50, marginVertical: 10}}
        raised
        icon={{ name: 'save', color: 'white' }}
        title="SAVE"
        onPress={saveItem}
      />
      <View style={{ flexDirection: "column", justifyContent: 'center', alignItems: 'center', width: '100%', margin: 20 }}>
        <FlatList
            style={{ width: '100%' }}
            data={listProd}
            renderItem={({item}) =>
            
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{item.product}</ListItem.Title>
                  <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
                </ListItem.Content>
                <Button type= "clear"  icon={{name:"delete", color:"red"}} onPress={() => deleteItem(item.key)}> delete</Button>
              </ListItem>
            
            }
        />
      </View>
      
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100%'
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#397af8',
    marginBottom: 20,
    width: '100%',
    paddingVertical: 15,
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
