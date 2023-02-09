import {
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Vibration,
} from 'react-native';
import {useEffect, useState} from 'react';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const checkVibro = async () => {
    let vibro = await AsyncStorage.getItem('vibro');
    if (vibro == 'true') {
      return true;
    } else if (vibro == 'false') {
      return false;
    }
  };

  const getQuiz = async () => {
    setLoading(true);
    // const url = 'https://opentdb.com/api.php?amount=10&encode=url3986';
    // const res = await fetch(url);
    // const data = await res.json();
    const data = [
      {
        category: 'Entertainment%3A%20Video%20Games',
        type: 'multiple',
        difficulty: 'easy',
        question:
          'Which%20game%20did%20NOT%20get%20financed%20via%20Crowdfunding%3F',
        correct_answer: 'Enter%20the%20Gungeon',
        incorrect_answers: ['Town%20of%20Salem', 'Undertale', 'Tower%20Unite'],
      },
      {
        category: 'General%20Knowledge',
        type: 'multiple',
        difficulty: 'easy',
        question:
          'Which%20one%20of%20the%20following%20rhythm%20games%20was%20made%20by%20Harmonix%3F',
        correct_answer: 'Rock%20Band',
        incorrect_answers: [
          'Meat%20Beat%20Mania',
          'Guitar%20Hero%20Live',
          'Dance%20Dance%20Revolution',
        ],
      },
      {
        category: 'Entertainment%3A%20Video%20Games',
        type: 'boolean',
        difficulty: 'hard',
        question:
          'In%20the%20game%20%22Melty%20Blood%20Actress%20Again%20Current%20Code%22%2C%20you%20can%20enter%20Blood%20Heat%20mode%20in%20Half%20Moon%20style.',
        correct_answer: 'False',
        incorrect_answers: ['True'],
      },
      {
        category: 'General%20Knowledge',
        type: 'multiple',
        difficulty: 'hard',
        question:
          'Which%20of%20the%20following%20is%20not%20another%20name%20for%20the%20eggplant%3F',
        correct_answer: 'Potimarron',
        incorrect_answers: ['Brinjal', 'Guinea%20Squash', 'Melongene'],
      },
      {
        category: 'Entertainment%3A%20Books',
        type: 'multiple',
        difficulty: 'medium',
        question:
          'In%20the%20year%201818%2C%20novelist%20Mary%20Shelly%20is%20credited%20with%20writing%20a%20fiction%20novel%20and%20creating%20this%20infamous%20character.',
        correct_answer: 'Frankenstein%27s%20monster',
        incorrect_answers: ['Dracula', 'The%20Thing', 'The%20Invisible%20Man'],
      },
      {
        category: 'Entertainment%3A%20Video%20Games',
        type: 'multiple',
        difficulty: 'hard',
        question:
          'Which%20of%20these%20Pok%C3%A9mon%20cannot%20learn%20Surf%3F',
        correct_answer: 'Arbok',
        incorrect_answers: ['Linoone', 'Tauros', 'Nidoking'],
      },
      {
        category: 'Science%3A%20Computers',
        type: 'multiple',
        difficulty: 'hard',
        question:
          'Who%20is%20the%20original%20author%20of%20the%20realtime%20physics%20engine%20called%20PhysX%3F',
        correct_answer: 'NovodeX',
        incorrect_answers: ['Ageia', 'Nvidia', 'AMD'],
      },
      {
        category: 'Entertainment%3A%20Video%20Games',
        type: 'multiple',
        difficulty: 'hard',
        question:
          'Which%20of%20these%20games%20was%20NOT%20developed%20by%20Markus%20Persson%3F',
        correct_answer: 'Dwarf%20Fortress',
        incorrect_answers: ['Minecraft', 'Wurm%20Online', '0x10c'],
      },
      {
        category: 'General%20Knowledge',
        type: 'multiple',
        difficulty: 'hard',
        question:
          'According%20to%20Fair%20Works%20Australia%2C%20how%20long%20do%20you%20have%20to%20work%20to%20get%20Long%20Service%20Leave%3F',
        correct_answer: '7%20years',
        incorrect_answers: ['2%20years', '8%20years', '6%20months'],
      },
      {
        category: 'Science%3A%20Mathematics',
        type: 'multiple',
        difficulty: 'hard',
        question:
          'What%20is%20the%20plane%20curve%20proposed%20by%20Descartes%20to%20challenge%20Fermat%27s%20extremum-finding%20techniques%20called%3F',
        correct_answer: 'Folium%20of%20Descartes',
        incorrect_answers: [
          'Elliptic%20Paraboloid%20of%20Descartes',
          'Cartesian%20Coordinates',
          'Descarte%27s%20Helicoid',
        ],
      },
    ];
    setQuestions(data);
    setOptions(optionsShuffled(data[0]));
    setLoading(false);
  };

  useEffect(() => {
    getQuiz();
  }, []);

  const handleNextPress = () => {
    setQues(ques + 1);
    setOptions(optionsShuffled(questions[ques + 1]));
  };

  const optionsShuffled = q => {
    const options = [...q.incorrect_answers];
    options.push(q.correct_answer);
    shuffleArray(options);
    return options;
  };

  const handleSelectedOption = q => {
    if (q === questions[ques].correct_answer) {
      setScore(score => score + 10);
    }
    if (ques !== 9) {
      setQues(ques + 1);
      setOptions(optionsShuffled(questions[ques + 1]));
    }
    if (ques === 9) {
      handleShowResult();
    }
  };

  useEffect(() => {
    saveScore();
  }, [score]);

  const saveScore = async () => {
    await AsyncStorage.setItem('score', score.toString());
  };

  const handleShowResult = () => {
    navigation.navigate('Result', {score: score});
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View>
          <ActivityIndicator size="large" color="#9166FE" />
        </View>
      ) : (
        questions && (
          <View style={styles.parent}>
            <View style={styles.top}>
              <View style={[styles.buttonText]}>
                <Text>Current Score: {score}</Text>
              </View>
              <Text style={styles.question}>
                {ques + 1}. {decodeURIComponent(questions[ques].question)}
              </Text>
            </View>
            <View style={styles.options}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  handleSelectedOption(options[0]);
                  if (checkVibro) {
                    Vibration.vibrate();
                  }
                }}>
                <Text style={styles.option}>
                  {decodeURIComponent(options[0])}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  handleSelectedOption(options[1]);
                  if (checkVibro) {
                    Vibration.vibrate();
                  }
                }}>
                <Text style={styles.option}>
                  {decodeURIComponent(options[1])}
                </Text>
              </TouchableOpacity>
              {options[2] && (
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    handleSelectedOption(options[2]);
                    if (checkVibro) {
                      Vibration.vibrate();
                    }
                  }}>
                  <Text style={styles.option}>
                    {decodeURIComponent(options[2])}
                  </Text>
                </TouchableOpacity>
              )}
              {options[3] && (
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    handleSelectedOption(options[3]);
                    if (checkVibro) {
                      Vibration.vibrate();
                    }
                  }}>
                  <Text style={styles.option}>
                    {decodeURIComponent(options[3])}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.bottom}>
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
  options: {
    marginVertical: 16,
    flex: 1,
  },
  bottom: {
    marginBottom: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#9166FE',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 18,
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
  optionButton: {
    paddingVertical: 12,
    marginVertical: 6,
    backgroundColor: '#9166FE',
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  parent: {
    height: '100%',
  },
});
