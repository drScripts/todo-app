import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { LoadingCentered } from "../component";
import { Api } from "../services";

const Addtask = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { project } = route.params;
  const toast = useToast();
  const [state, setState] = useState({
    title: "",
  });

  if (!project) {
    return navigation.goBack();
  }

  const onSubmit = async () => {
    const { title } = state;
    const { id: project_id } = project;

    const data = JSON.stringify({ title, project_id });

    if (title) {
      setIsLoading(true);

      const { data: responseData, status } = await Api.post("/tasks", data, {
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((err) => err?.response);

      setIsLoading(false);
      const { message } = responseData;

      if (status === 201) {
        navigation.goBack();
      } else {
        toast.show({
          title: "Warning",
          description: message || "Can't connect to server !",
          background: "danger.500",
          placement: "top",
        });
      }
    } else {
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
              <Heading>Add Tasks</Heading>
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

export default Addtask;
