import React, { useContext, useState } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Box,
  HStack,
  VStack,
  Input,
  Heading,
  Button,
  useToast,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { baseApiUrl } from "../constant";
import { UserContext } from "../Context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { LoadingCentered } from "../component";

const Edittask = ({ route, navigation }) => {
  const { task } = route.params;
  const [userState] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  if (!task) {
    return navigation.goBack();
  }

  const [state, setState] = useState({
    title: task?.title,
  });

  const onSubmit = async () => {
    setIsLoading(true);
    const { title } = state;
    const data = JSON.stringify({ title });
    if (title) {
      await fetch(`${baseApiUrl}/tasks/${task?.id}`, {
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${userState?.token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          setIsLoading(false);
          const { status, message } = responseData;

          if (status === "created") {
            navigation.goBack();
          } else {
            toast.show({
              title: "Error",
              description: message,
              background: "danger.500",
              placement: "top",
            });
          }
        })
        .catch(() => {
          setIsLoading(false);
          toast.show({
            title: "Error",
            description: "Can't connect to server!",
            background: "danger.500",
            placement: "top",
          });
        });
    } else {
      setIsLoading(false);
      toast.show({
        title: "Warning",
        description: "Please Fill All Form !",
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
          <Box flex={1}>
            <HStack
              safeArea
              background={"grey.50"}
              px={3}
              py={5}
              shadow={"5"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Box size={"8"} justifyContent={"center"} alignItems={"center"}>
                  <Ionicons name="chevron-back" size={24} color="black" />
                </Box>
              </TouchableOpacity>
              <Heading>Edit Tasks</Heading>
              <Box size={"8"}></Box>
            </HStack>
            <VStack space={3} mt={6} px={3}>
              <Input
                placeholder="Enter Project Title"
                borderRadius={10}
                borderWidth={2}
                borderColor={"grey.200"}
                _input={{
                  fontWeight: "semibold",
                }}
                onChangeText={(text) => setState({ title: text })}
                value={state?.title}
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
                Submit
              </Button>
            </VStack>
          </Box>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};

export default Edittask;
