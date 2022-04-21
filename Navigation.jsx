import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainPage from "./pages/MainPage";
import Addproject from "./pages/AddProject";
import Detailproject from "./pages/DetailProject";
import Editproject from "./pages/EditProject";
import Addtask from "./pages/AddTask";
import Edittask from "./pages/EditTask";
import { UserContext } from "./Context/UserContext";
import { useContext } from "react";

const Stack = createStackNavigator();

const Navigation = () => {
  const [userState] = useContext(UserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{
          headerShown: false,
        }}
      >
        {userState?.isLogin ? (
          <>
            <Stack.Screen name="main" component={MainPage} />
            <Stack.Screen name="add-project" component={Addproject} />
            <Stack.Screen name="detail-project" component={Detailproject} />
            <Stack.Screen name="edit-project" component={Editproject} />
            <Stack.Screen name="add-task" component={Addtask} />
            <Stack.Screen name="edit-task" component={Edittask} />
          </>
        ) : (
          <>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
