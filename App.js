import * as React from 'react';
import { View ,FlatList} from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc } from 'firebase/firestore';
import {Appbar, Button, TextInput} from 'react-native-paper';
import TodoC from './todo';


const firebaseConfig = {
  apiKey: "AIzaSyD7-poBZ3nfyuZvpjg4UyZR0cqwkjogIJI",
  authDomain: "fir-react-1dad7.firebaseapp.com",
  projectId: "fir-react-1dad7",
  storageBucket: "fir-react-1dad7.appspot.com",
  messagingSenderId: "315501459723",
  appId: "1:315501459723:web:268b8a32d8cbc36f518a0e"
};

initializeApp(firebaseConfig);

const firestore = getFirestore();

export default function App() {

  const [Todo,settodo] = React.useState('');
  const [loading,setLoading]=React.useState(true);
  const [todos,settodos] = React.useState([]);
  
  const addtodo = async () => {
    const todoCollection = collection(firestore, "todos");
    await addDoc(todoCollection, {
      title: Todo,
      complet: false,
    });
  }


  React.useEffect(() => {
      const unsubscribe = onSnapshot(collection(firestore, "todos"), querySnapshot => {
        const list = [];
        querySnapshot.forEach(doc => {
          const { title, complete } = doc.data();
          list.push({
            id:doc.id,
            title,
            complete,
          });
      });

      settodos(list);
      setLoading(false);
    });
    return()=> unsubscribe();
  });
  if(loading){
    return null;
  }

  return (
    <View style={{flex:1}}>
    <Appbar>
      <Appbar.Content title={'TODOs List'} />
    </Appbar>
    <FlatList 
        style={{flex: 1}}
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TodoC {...item} />}
      />
    <TextInput label={'New Todo'} value={Todo} onChangeText={(text) => settodo(text)} />
    <Button onPress={addtodo}>Add To Do</Button>
  </View>

  );
}
