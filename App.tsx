import {StatusBar} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MyStack from './navigation';

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#9166FE" />
      <MyStack />
    </NavigationContainer>
  );
};

export default App;
