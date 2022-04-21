import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("usrtkn");
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem("usrtkn", token);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("usrtkn");
  } catch (err) {
    console.log(err);
    return null;
  }
};
