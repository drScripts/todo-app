import React, { useState } from "react";
import {
  Box,
  HStack,
  KeyboardAvoidingView,
  ScrollView,
  Heading,
  VStack,
  Input,
  Button,
  useToast,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { LoadingCentered } from "../component";
import { Api } from "../services";

const Addproject = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [state, setState] = useState({
    title: "",
    description: "",
  });

  const onChange = (value) => {
    setState({
      ...state,
      ...value,
    });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const { title, description } = state;
    const dataBody = JSON.stringify({ title, description });

    if (title && description) {
      const { data: responseData, status } = await Api.post(
        "/projects",
        dataBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).catch((err) => err?.response);
      setIsLoading(false);
      const { message } = responseData;
      if (status === 201) {
        navigation.goBack();
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
              shadow={"1"}
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
              <Heading>Add Project</Heading>
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
                onChangeText={(text) => onChange({ title: text })}
              />
              <Input
                placeholder="Enter Project Description"
                borderRadius={10}
                borderWidth={2}
                borderColor={"grey.200"}
                _input={{
                  fontWeight: "semibold",
                }}
                onChangeText={(text) => onChange({ description: text })}
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

export default Addproject;
