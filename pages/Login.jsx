import {
  Box,
  Image,
  VStack,
  Input,
  Button,
  Text,
  HStack,
  KeyboardAvoidingView,
  useToast,
  ScrollView,
} from "native-base";
import React, { useState, useContext } from "react";
import { TouchableOpacity } from "react-native";
import { UserContext } from "../Context/UserContext";
import { LoadingCentered } from "../component";
import { Api } from "../services";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const [, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const onChangePassword = (text) => {
    setPassword(text);
  };

  const onChangeEmail = (text) => {
    setEmail(text);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    if (email && password) {
      const bodyData = JSON.stringify({ email, password });
      const { data: responseData, status } = await Api.post(
        "/login",
        bodyData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).catch((err) => err?.response);

      setIsLoading(false);
      const { data, message } = responseData;

      if (status === 200) {
        dispatch({
          type: "USER_SUCCESS_LOGIN",
          payload: data,
        });
      } else {
        toast.show({
          title: "Warning",
          description: message || "Can't connect to server!",
          background: "danger.500",
          placement: "top",
        });
      }
    } else {
      setIsLoading(false);
      toast.show({
        title: "Warning",
        description: "Please Fill all form!",
        background: "danger.500",
        placement: "top",
      });
    }
  };

  return (
    <>
      <LoadingCentered backdrop show={isLoading} />
      <ScrollView bg={"grey.50"}>
        <KeyboardAvoidingView>
          <Box safeArea flex={1} bg={"grey.50"} px={3}>
            <Image
              source={require("../assets/login.png")}
              size="2xl"
              alignSelf={"center"}
              alt="Illustratio login"
              mt={10}
            />

            <VStack mt={"8"} space={"3"}>
              <Input
                placeholder="Enter Your Email"
                borderRadius={10}
                borderWidth={2}
                borderColor={"grey.200"}
                _input={{
                  fontWeight: "semibold",
                }}
                value={email}
                onChangeText={onChangeEmail}
              />
              <Input
                placeholder="Enter Your Password"
                type="password"
                borderRadius={10}
                borderWidth={2}
                borderColor={"grey.200"}
                _input={{
                  fontWeight: "semibold",
                }}
                value={password}
                onChangeText={onChangePassword}
              />

              <Button
                bg={"primary.400"}
                borderRadius={10}
                _text={{
                  fontWeight: "bold",
                  fontSize: 16,
                }}
                mt={5}
                shadow={"3"}
                onPress={onSubmit}
              >
                Login
              </Button>
            </VStack>
            <HStack alignSelf={"center"} mt={4} space={1}>
              <Text fontWeight={"medium"} fontSize={13}>
                Doesn’t have an account?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.push("register");
                }}
              >
                <Text
                  fontWeight={"medium"}
                  fontSize={13}
                  underline
                  color={"primary.400"}
                >
                  Register!
                </Text>
              </TouchableOpacity>
            </HStack>
          </Box>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};

export default Login;
