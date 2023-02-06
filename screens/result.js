import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Title from '../components/title';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Result = ({navigation, route}) => {
  const [score, setScore] = useState(route.params.score);
  useEffect(() => {
    saveScore();
  }, []);
  const saveScore = async () => {
    await AsyncStorage.setItem('score', score.toString());
  };

  const resultBanner =
    score > 20
      ? 'https://as1.ftcdn.net/v2/jpg/02/75/45/20/1000_F_275452071_YRRXaB6LsXQZU7eyhvRHkfmttlJrPT4n.jpg'
      : 'https://static.vecteezy.com/system/resources/previews/015/087/747/non_2x/cartoon-flat-style-drawing-arab-businessman-descends-into-the-hole-concept-of-failure-to-take-advantage-of-business-opportunities-depressed-and-business-failure-graphic-design-illustration-vector.jpg';
  return (
    <View style={styles.container}>
      <Title titleText="RESULT" />
      <Text style={styles.scoreValue}>{score}</Text>
      <View style={styles.bannerContainer}>
        <Image
          source={{
            uri: resultBanner,
          }}
          style={styles.banner}
        />
      </View>
      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.removeItem('score');
          navigation.navigate('Home');
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Result;

const styles = StyleSheet.create({
  banner: {
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
  scoreValue: {
    fontSize: 24,
    fontWeight: '800',
    alignSelf: 'center',
  },
});
