import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const MainPage = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <MaterialCommunityIcons
                name="view-dashboard"
                size={35}
                color="black"
              />
            ) : (
              <MaterialCommunityIcons
                name="view-dashboard-outline"
                size={35}
                color="black"
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Ionicons name="person-circle-sharp" size={35} color="black" />
            ) : (
              <Ionicons name="person-circle-outline" size={35} color="black" />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainPage;
