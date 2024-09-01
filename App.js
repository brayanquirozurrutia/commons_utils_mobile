import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home/Home';
import Ingredients from "./screens/Ingredients/Ingredients";
import Products from "./screens/Products/Products";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Ingredients" component={Ingredients} />
            <Stack.Screen name="Products" component={Products} />
          </Stack.Navigator>
      </NavigationContainer>
  );
}
