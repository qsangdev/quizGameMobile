/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Vibration,
  Alert,
  Animated,
} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, SIZES} from '../constants/';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const Quiz = ({navigation}) => {
  const [questions, setQuestions] = useState();
  const [ques, setQues] = useState(0);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [correctOption, setCorrectOption] = useState(null);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [count, setCount] = useState(10);
  const [startCountdown, setStartCountdown] = useState(false);

  const getQuiz = async () => {
    setLoading(true);
    const url = 'https://opentdb.com/api.php?amount=10&encode=url3986';
    const res = await fetch(url);
    const data = await res.json();

    setQuestions(data.results);
    setOptions(optionsShuffled(data.results[0]));
    setLoading(false);
    setStartCountdown(true);
  };

  useEffect(() => {
    getQuiz();
  }, []);

  useEffect(() => {
    if (startCountdown) {
      const timer = count > 0 && setInterval(() => setCount(count - 1), 1000);

      if (count === 0) {
        setStartCountdown(false);
        setCount(10);
        autoNextQuestion();
      }

      return () => clearInterval(timer);
    }
  }, [count, startCountdown]);

  const autoNextQuestion = () => {
    setCorrectOption(questions[ques].correct_answer);
    if (ques + 1 < questions.length) {
      setTimeout(() => {
        handleNextPress();
      }, 1000);
    } else {
      setStartCountdown(false);
      setTimeout(() => {
        handleShowResult();
      }, 1000);
    }
  };

  const handleNextPress = () => {
    setQues(ques + 1);
    setCount(10);
    setStartCountdown(true);
    setOptions(optionsShuffled(questions[ques + 1]));
    setCurrentOptionSelected(null);
    setCorrectOption(null);
    setIsOptionsDisabled(false);
    Animated.timing(progress, {
      toValue: ques + 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const optionsShuffled = q => {
    const optionss = [...q.incorrect_answers];
    optionss.push(q.correct_answer);
    shuffleArray(optionss);
    return optionss;
  };

  const handleSelectedOption = q => {
    setCurrentOptionSelected(q);
    setCorrectOption(questions[ques].correct_answer);
    setIsOptionsDisabled(true);
    setStartCountdown(false);
    if (q === questions[ques].correct_answer) {
      setScore(score + 10);
    }
    if (ques + 1 < questions.length) {
      setTimeout(() => {
        handleNextPress();
      }, 1000);
    } else {
      setTimeout(() => {
        handleShowResult();
      }, 1000);
    }
  };

  useEffect(() => {
    saveScore();
  }, [score]);

  const saveScore = async () => {
    await AsyncStorage.setItem('score', score.toString());
  };

  const handleShowResult = () => {
    navigation.navigate('Result');
  };

  const backHomeButton = () => {
    setStartCountdown(false);
    Alert.alert(
      'Are you sure?',
      'Scores will not be saved if you exit midway',
      [
        {
          text: 'Cancel',
          onPress: () => setStartCountdown(true),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ],
    );
  };

  const progressAnim = progress.interpolate({
    inputRange: [0, 10],
    outputRange: ['0%', '100%'],
  });

  const checkVibro = async () => {
    let vibro = await AsyncStorage.getItem('vibro');
    if (vibro === 'true') {
      return true;
    } else if (vibro === 'false') {
      return false;
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {isLoading ? (
          <View>
            <ActivityIndicator size="large" color="#9166FE" />
          </View>
        ) : (
          questions && (
            <View style={styles.parent}>
              <Text style={styles.scoreText}>
                {ques + 1}/{questions.length}
              </Text>
              <View
                style={{
                  width: '100%',
                  height: 20,
                  borderRadius: 20,
                  backgroundColor: '#00000020',
                }}>
                <Animated.View
                  style={[
                    {
                      height: 20,
                      borderRadius: 20,
                      backgroundColor: '#9166FE',
                    },
                    {
                      width: progressAnim,
                    },
                  ]}></Animated.View>
              </View>
              <View style={styles.top}>
                <View style={styles.topFlex}>
                  <Text style={styles.scoreText}>Current Score: {score}</Text>
                  <Text style={styles.scoreText}>{count}</Text>
                </View>

                <Text style={styles.question}>
                  {decodeURIComponent(questions[ques].question)}
                </Text>
              </View>
              <View style={styles.options}>
                {options.map(q => {
                  return (
                    <TouchableOpacity
                      key={q}
                      style={{
                        borderWidth: 3,
                        borderColor:
                          q === correctOption
                            ? COLORS.success
                            : q === currentOptionSelected
                            ? COLORS.error
                            : COLORS.secondary + '80',
                        backgroundColor:
                          q === correctOption
                            ? COLORS.success + '20'
                            : q === currentOptionSelected
                            ? COLORS.error + '20'
                            : COLORS.secondary + '60',
                        height: 60,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 12,
                        marginVertical: 6,
                        // paddingVertical: 12,
                      }}
                      disabled={isOptionsDisabled}
                      onPress={() => {
                        handleSelectedOption(q);
                        if (checkVibro) {
                          Vibration.vibrate();
                        }
                      }}>
                      <Text style={styles.option}>{decodeURIComponent(q)}</Text>

                      {q === correctOption ? (
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 30 / 2,
                            backgroundColor: COLORS.success,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <MaterialCommunityIcons
                            name="check"
                            style={{
                              color: COLORS.white,
                              fontSize: 20,
                            }}
                          />
                        </View>
                      ) : q === currentOptionSelected ? (
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 30 / 2,
                            backgroundColor: COLORS.error,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <MaterialCommunityIcons
                            name="close"
                            style={{
                              color: COLORS.white,
                              fontSize: 20,
                            }}
                          />
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.bottom}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={backHomeButton}>
                  <Text style={styles.buttonText}>HOME</Text>
                </TouchableOpacity>

                {ques !== 9 && (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleNextPress}>
                    <Text style={styles.buttonText}>SKIP</Text>
                  </TouchableOpacity>
                )}

                {ques === 9 && (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      handleShowResult();
                      if (checkVibro) {
                        Vibration.vibrate();
                      }
                    }}>
                    <Text style={styles.buttonText}>SHOW RESULTS</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
    height: '100%',
    justifyContent: 'center',
  },
  top: {
    marginVertical: 16,
  },
  topFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  options: {
    marginVertical: 16,
    flex: 1,
  },
  bottom: {
    marginBottom: 12,
    paddingVertical: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#9166FE',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  question: {
    fontSize: 28,
    color: 'black',
  },
  option: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  parent: {
    height: '100%',
  },
  scoreText: {
    fontWeight: '700',
    fontSize: 20,
  },
});
