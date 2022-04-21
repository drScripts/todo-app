import "react-native-gesture-handler";
import { NativeBaseProvider, extendTheme } from "native-base";
import {
  useFonts,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";
import AppLoading from "expo-app-loading";
import Navigation from "./Navigation";
import UserProvider from "./Context/UserContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  const colorConfig = {
    primary: {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#42C2FF",
    },
    grey: {
      20: "#ffff",
      50: "#FAFAF3",
      100: "#B5B5B5",
      200: "#717171",
      800: "#000000",
      900: "#000",
    },
    danger: {
      500: "#f43f5e",
    },
    card: {
      50: "#FA5555",
    },
    backdrop: {
      50: "#00000066",
    },
  };

  const fontConfig = {
    Poppins: {
      200: {
        normal: "Poppins_200ExtraLight",
      },
      300: {
        normal: "Poppins_300Light",
      },
      400: {
        normal: "Poppins_400Regular",
      },
      500: {
        normal: "Poppins_500Medium",
      },
      600: {
        normal: "Poppins_600SemiBold",
      },
      700: {
        normal: "Poppins_700Bold",
      },
      800: {
        normal: "Poppins_800ExtraBold",
      },
      900: {
        normal: "Poppins_900Black",
      },
    },
  };

  const fonts = {
    heading: "Poppins",
    body: "Poppins",
    mono: "Poppins",
  };

  const theme = extendTheme({
    fontConfig,
    colors: colorConfig,
    fonts: fonts,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <NativeBaseProvider theme={theme}>
        <UserProvider>
          <Navigation />
        </UserProvider>
      </NativeBaseProvider>
    );
  }
}
