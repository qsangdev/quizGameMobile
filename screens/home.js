import {
  Image,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  Animated,
  Easing,
  Vibration,
  AppState,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Title from '../components/title';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {whoosh} from './Settings';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';

const Home = ({navigation}) => {
  //check the state of music setting
  const checkMusic = async () => {
    let music = await AsyncStorage.getItem('music');
    if (music == 'true') {
      whoosh.play();
      console.log(music);
    } else if (music == 'false') {
      whoosh.pause();
    }
  };

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkMusic();
      } else {
        whoosh.pause();
      }
      console.log(appState.current);
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            BackHandler.exitApp();
            whoosh.pause();
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const checkVibro = async () => {
    let vibro = await AsyncStorage.getItem('vibro');
    if (vibro == 'true') {
      return true;
    } else if (vibro == 'false') {
      return false;
    }
  };

  useEffect(() => {
    checkScore();
    checkMusic();
  }, []);

  const checkScore = async () => {
    let score = await AsyncStorage.getItem('score');
    if (score) {
      navigation.navigate('Result', {score: score});
    }
  };

  //Animations

  let scaleValue1 = new Animated.Value(0);
  let scaleValue2 = new Animated.Value(0);
  let scaleValue3 = new Animated.Value(0);
  let scaleValue4 = new Animated.Value(0);

  let rotation = scaleValue4.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // degree of rotation
  });

  const cardScale1 = scaleValue1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1.1],
  });
  const cardScale2 = scaleValue2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1.1],
  });
  const cardScale3 = scaleValue3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1.1],
  });
  let transformStyle1 = {transform: [{scale: cardScale1}]};
  let transformStyle2 = {transform: [{scale: cardScale2}]};
  let transformStyle3 = {transform: [{scale: cardScale3}]};
  let transformStyle4 = {transform: [{rotate: rotation}]};
  return (
    <View style={styles.container}>
      <Title titleText="QUIZZLER" />
      <Animated.View style={[styles.bannerContainer, transformStyle4]}>
        <TouchableWithoutFeedback
          onPressIn={() => {
            Animated.timing(scaleValue4, {
              toValue: 1,
              duration: 700,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start();
            if (checkVibro) {
              Vibration.vibrate();
            }
          }}
          onPressOut={() => {
            Animated.timing(scaleValue4, {
              toValue: 0,
              duration: 350,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start();
          }}>
          <Image
            source={{
              uri: 'https://media.istockphoto.com/id/1270314078/vector/quiz-time-geometric-badge-with-question-mark-vector-illustration.jpg?s=612x612&w=0&k=20&c=_AS4drMsxnezEBMpl363ln0XZjXph1BOdeOdp3E9HQM=',
            }}
            style={[styles.banner]}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.View style={transformStyle1}>
        <TouchableWithoutFeedback
          onPressIn={() => {
            scaleValue1.setValue(0);
            Animated.timing(scaleValue1, {
              toValue: 1,
              duration: 350,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start();
            if (checkVibro) {
              Vibration.vibrate();
            }
          }}
          onPressOut={() => {
            Animated.timing(scaleValue1, {
              toValue: 0,
              duration: 150,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start();
            BackHandler.removeEventListener(
              'hardwareBackPress',
              this.handleBackButton,
            );
            navigation.navigate('Quiz');
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.View style={transformStyle2}>
        <TouchableWithoutFeedback
          onPressIn={() => {
            scaleValue2.setValue(0);
            Animated.timing(scaleValue2, {
              toValue: 1,
              duration: 350,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start();
            if (checkVibro) {
              Vibration.vibrate();
            }
          }}
          onPressOut={() => {
            Animated.timing(scaleValue2, {
              toValue: 0,
              duration: 150,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start();
            BackHandler.removeEventListener(
              'hardwareBackPress',
              this.handleBackButton,
            );
            navigation.navigate('Settings');
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.View style={transformStyle3}>
        <TouchableWithoutFeedback
          onPressIn={() => {
            scaleValue3.setValue(0);
            Animated.timing(scaleValue3, {
              toValue: 1,
              duration: 350,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start();
            if (checkVibro) {
              Vibration.vibrate();
            }
          }}
          onPressOut={() => {
            Animated.timing(scaleValue3, {
              toValue: 0,
              duration: 150,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start();
            Alert.alert('Hold on!', 'Are you sure you want to exit?', [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
              },
              {
                text: 'YES',
                onPress: () => {
                  BackHandler.exitApp();
                  whoosh.pause();
                },
              },
            ]);
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Exit</Text>
        </TouchableWithoutFeedback>
      </Animated.View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  banner: {
    resizeMode: 'stretch',
    height: 250,
    width: 250,
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
