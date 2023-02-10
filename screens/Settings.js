import {StyleSheet, Text, View, Switch, Vibration} from 'react-native';
import React, {useEffect, useState} from 'react';
import Title from '../components/title';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import {TouchableOpacity} from 'react-native-gesture-handler';

Sound.setCategory('Playback');

//preload the sound
var whoosh = new Sound('background_sound.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // loaded successfully
  console.log(
    'duration in seconds: ' +
      whoosh.getDuration() +
      'number of channels: ' +
      whoosh.getNumberOfChannels(),
  );
});

const Settings = ({navigation}) => {
  const [isVEnabled, setIsVEnabled] = useState(false);
  const [isMEnabled, setIsMEnabled] = useState(false);

  useEffect(() => {
    const setVibro = async () => {
      const result = JSON.parse(
        (await AsyncStorage.getItem('vibro')) || 'false',
      );
      setIsVEnabled(result);
    };
    setVibro();
  }, []);

  useEffect(() => {
    const setMusic = async () => {
      const result = JSON.parse(
        (await AsyncStorage.getItem('music')) || 'false',
      );
      setIsMEnabled(result);
    };
    setMusic();
  }, []);

  return (
    <View style={[styles.container]}>
      <View style={{paddingTop: 40}}>
        <Title titleText="SETTINGS" />
      </View>
      <View style={styles.container}>
        <View style={[styles.bannerContainer, styles.button]}>
          <Text style={styles.buttonText}>Vibration</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isVEnabled ? '#2e1663' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={result => {
              AsyncStorage.setItem('vibro', JSON.stringify(result));
              setIsVEnabled(result);
              if (result) {
                Vibration.vibrate();
              }
            }}
            value={isVEnabled}
          />
        </View>
        <View style={[styles.bannerContainer, styles.button]}>
          <Text style={styles.buttonText}>Music</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isMEnabled ? '#2e1663' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={result => {
              AsyncStorage.setItem('music', JSON.stringify(result));
              setIsMEnabled(result);
              if (result) {
                whoosh.play();
                whoosh.setNumberOfLoops(-1);
              } else {
                whoosh.pause();
              }
            }}
            value={isMEnabled}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            navigation.navigate('Home');
          }}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
export var whoosh;

const styles = StyleSheet.create({
  banner: {
    resizeMode: 'stretch',
    height: 300,
    width: 300,
  },
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
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
