import { Text, View, StyleSheet } from 'react-native';
import Card from '@/components/Card/Card';
import CardList from '@/components/СardList/СardList'
export default function AboutScreen() {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>About screen</Text> */}
      {/* <Card
        question='sdfpdspfpdsfddsfdsfd[sod[ppfdkopfkdsopfopsdokfodsko dsoopdo okpos kdpso fkopdskpo fpodk popok podspofpo pokfdoks'
        onPress={() => {
          console.log('asd');
        }} /> */}
      <CardList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',

    // flex: 1,
    // backgroundColor: '#25292e',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  text: {
    // color: '#fff',
  },
});
