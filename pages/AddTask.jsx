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

const Addtask = ({ route, navigation }) => {
  const [userState] = useContext(UserContext);
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
      await fetch(`${baseApiUrl}/tasks`, {
        body: data,
        method: "POST",
        headers: {
          Authorization: `Bearer ${userState?.token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          const { status, message } = responseData;

          if (status === "created") {
            setIsLoading(false);
            navigation.goBack();
          } else {
            toast.show({
              title: "Warning",
              description: message,
              background: "danger.500",
              placement: "top",
            });
          }
        });
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
      <ScrollView>
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
