import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AnimatedText from './AnimatedText';

const Title = ({titleText}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <AnimatedText style={styles.title} text={[`${titleText}`]} />
      </Text>
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: 'black',
  },
  container: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
