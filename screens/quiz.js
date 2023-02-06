import {
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import React from 'react';

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

  const getQuiz = async () => {
    setLoading(true);
    const url = 'https://opentdb.com/api.php?amount=10&encode=url3986';
    const res = await fetch(url);
    const data = await res.json();
    setQuestions(data.results);
    setOptions(optionsShuffled(data.results[0]));
    setLoading(false);
  };
  useEffect(() => {
    getQuiz();
  }, []);

  const handleNextPress = () => {
    setQues(ques + 1);
    setOptions(optionsShuffled(questions[ques + 1]));
  };

  const handlePrevPress = () => {
    setQues(ques - 1);
    setOptions(optionsShuffled(questions[ques - 1]));
  };

  const optionsShuffled = q => {
    const options = [...q.incorrect_answers];
    options.push(q.correct_answer);
    shuffleArray(options);
    return options;
  };

  const handleSelectedOption = q => {
    if (q === questions[ques].correct_answer) {
      setScore(score + 10);
    }
    if (ques !== 9) {
      setQues(ques + 1);
      setOptions(optionsShuffled(questions[ques + 1]));
    }
    if (ques === 9) {
      handleShowResult();
    }
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
              <View style={styles.buttonText}>
                <Text> Current Score: {score}</Text>
              </View>
              <Text style={styles.question}>
                Q. {decodeURIComponent(questions[ques].question)}
              </Text>
            </View>
            <View style={styles.options}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleSelectedOption(options[0])}>
                <Text style={styles.option}>
                  {decodeURIComponent(options[0])}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleSelectedOption(options[1])}>
                <Text style={styles.option}>
                  {decodeURIComponent(options[1])}
                </Text>
              </TouchableOpacity>
              {options[2] && (
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleSelectedOption(options[2])}>
                  <Text style={styles.option}>
                    {decodeURIComponent(options[2])}
                  </Text>
                </TouchableOpacity>
              )}
              {options[3] && (
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleSelectedOption(options[3])}>
                  <Text style={styles.option}>
                    {decodeURIComponent(options[3])}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.bottom}>
              {ques > 0 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={handlePrevPress}>
                  <Text style={styles.buttonText}>PREV</Text>
                </TouchableOpacity>
              )}

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
                  onPress={() => handleShowResult()}>
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
    justifyContent: 'space-between',
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
