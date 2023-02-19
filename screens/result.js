import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Keyboard,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Title from '../components/title';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Result = ({navigation}) => {
  const [score, setScore] = useState('');
  const [name, setName] = useState('');
  const startValue = useRef(new Animated.Value(0)).current;
  const endValue = 1;
  const duration = 3000;

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Scores will not be saved if you exit!', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => navigation.navigate('Home')},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    loadScore();
  }, [score]);

  const loadScore = async () => {
    const finallyScore = await AsyncStorage.getItem('score');
    setScore(finallyScore);
  };

  const backHome = () => {
    Alert.alert('Hold on!', 'Return without saving your points?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => navigation.navigate('Home')},
    ]);
  };

  const saveValue = async () => {
    try {
      const data = JSON.parse(await AsyncStorage.getItem('players')) || [];
      if (name) {
        const newPlayer = {name: name, score: score};
        data.push(newPlayer);
        data.sort((a, b) => b.score - a.score);
        data.splice(5);
        await AsyncStorage.setItem('players', JSON.stringify(data));
        alert('Player Saved');
        setName('');
        Keyboard.dismiss();
        navigation.navigate('Home');
      } else {
        alert('Please enter your name..');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    Animated.timing(startValue, {
      toValue: endValue,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }, [startValue]);

  const resultBanner =
    score > 20
      ? 'https://as1.ftcdn.net/v2/jpg/02/75/45/20/1000_F_275452071_YRRXaB6LsXQZU7eyhvRHkfmttlJrPT4n.jpg'
      : 'https://static.vecteezy.com/system/resources/previews/015/087/747/non_2x/cartoon-flat-style-drawing-arab-businessman-descends-into-the-hole-concept-of-failure-to-take-advantage-of-business-opportunities-depressed-and-business-failure-graphic-design-illustration-vector.jpg';
  return (
    <View style={styles.container}>
      <Title titleText="RESULT" />
      <Text style={styles.scoreValue}>{score}/100</Text>
      <Animated.View
        style={[
          styles.bannerContainer,
          {
            transform: [
              {
                scale: startValue,
              },
            ],
          },
        ]}>
        <Image
          source={{
            uri: resultBanner,
          }}
          style={styles.banner}
        />
      </Animated.View>
      <View>
        <TextInput
          value={name}
          style={styles.textInput}
          placeholder="Enter your name.."
          onChangeText={data => setName(data)}
        />
        <TouchableOpacity style={styles.button} onPress={saveValue}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={backHome} style={styles.button}>
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
    marginBottom: 20,
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
  textInput: {
    fontSize: 24,
    padding: 10,
    borderRadius: 14,
    marginBottom: 20,
    backgroundColor: 'white',
    textAlign: 'center',
  },
});
