import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DataTable} from 'react-native-paper';
import Title from '../components/title';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Ranking = ({navigation}) => {
  const [players, setPlayers] = useState([]);
  const allPlayers = async () => {
    const data = await AsyncStorage.getItem('players');
    const highScores = JSON.parse(data);
    setPlayers(highScores);
  };

  useEffect(() => {
    const check = async () => {
      await allPlayers();
    };
    check();
  }, []);

  const deleteData = async () => {
    try {
      await AsyncStorage.removeItem('players');
      allPlayers();
    } catch (e) {
      console.log(e);
    }
    console.log('Deleted.');
  };

  return (
    <View style={styles.container}>
      <Title titleText="RANKING" />
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Rank</DataTable.Title>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title numeric>Score</DataTable.Title>
        </DataTable.Header>
        {players === null ? (
          <DataTable.Row>
            <DataTable.Cell>No Data Players</DataTable.Cell>
          </DataTable.Row>
        ) : (
          players.map((e, id) => {
            return (
              <DataTable.Row key={id}>
                <DataTable.Cell>{players.indexOf(e) + 1}</DataTable.Cell>
                <DataTable.Cell>{e.name}</DataTable.Cell>
                <DataTable.Cell numeric>{e.score}</DataTable.Cell>
              </DataTable.Row>
            );
          })
        )}
      </DataTable>
      <View>
        <TouchableOpacity onPress={deleteData} style={styles.button}>
          <Text style={styles.buttonText}>Delete Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.button}>
          <Text style={styles.buttonText}>Back Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Ranking;

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 30,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
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
  row: {
    fontSize: 20,
  },
});
