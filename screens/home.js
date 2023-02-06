import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import Title from '../components/title';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
  useEffect(() => {
    checkScore();
  }, []);
  const checkScore = async () => {
    let score = await AsyncStorage.getItem('score');
    if (score) {
      navigation.navigate('Result', {score: score});
    }
  };
  return (
    <View style={styles.container}>
      <Title titleText="QUIZZLER" />
      <View style={styles.bannerContainer}>
        <Image
          source={{
            uri: 'https://media.istockphoto.com/id/1270314078/vector/quiz-time-geometric-badge-with-question-mark-vector-illustration.jpg?s=612x612&w=0&k=20&c=_AS4drMsxnezEBMpl363ln0XZjXph1BOdeOdp3E9HQM=',
          }}
          style={styles.banner}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Quiz')}
        style={styles.button}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  banner: {
    resizeMode: 'stretch',
    height: 300,
    width: 300,
  },
  bannerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
    height: '100%',
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    backgroundColor: '#9166FE',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
});
