import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import {useState, useEffect} from 'react';
import {Text} from 'react-native';

const Fonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        mainFont: require('../assets/fonts/Metropolis-Bold.otf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Text style={{fontFamily: 'mainFont', fontSize: 20}}>
      Font Loaded Successfully!
    </Text>
  );
};

export default Fonts;
