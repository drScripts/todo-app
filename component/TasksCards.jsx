import React from "react";
import { Box, HStack, Heading, Pressable } from "native-base";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Api } from "../services";

const Taskscards = ({ task, onChange, toast, navigation, setIsLoading }) => {
  const handleEdit = () => {
    navigation.navigate("edit-task", { task });
  };

  const handleDelete = async () => {
    setIsLoading(true);

    const { data: responseData, status } = await Api.delete(
      `/tasks/${task?.id}`
    ).catch((err) => err?.response);

    setIsLoading(false);

    const { message } = responseData;

    if (status === 201) {
      onChange();
    } else {
      toast.show({
        title: "Warning",
        description: message || "Can't connect to server!",
        background: "danger.500",
        placement: "top",
      });
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    const statusData = task?.status === "complete" ? "pending" : "complete";
    const body = JSON.stringify({ status: statusData });

    const { data: responseData, status } = await Api.patch(
      `/tasks/${task?.id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).catch((err) => err?.response);

    setIsLoading(false);

    const { message } = responseData;

    if (status === 201) {
      onChange();
    } else {
      toast.show({
        title: "Warning",
        description: message || "Can't connect to server!",
        background: "danger.500",
        placement: "top",
      });
    }
  };

  return (
    <Box
      px={3}
      py={5}
      background={"grey.50"}
      shadow={3}
      borderRadius={"md"}
      mb={3}
    >
      <HStack justifyContent={"space-between"} alignItems={"center"}>
        <Heading
          size={"xs"}
          w={"60%"}
          strikeThrough={task?.status === "complete"}
        >
          {task?.title}
        </Heading>
        <HStack space={2}>
          <Pressable onPress={handleEdit}>
            <FontAwesome name="edit" size={24} color="black" />
          </Pressable>
          <Pressable onPress={handleUpdate}>
            {task?.status === "complete" ? (
              <Ionicons name="close" size={24} color="red" />
            ) : (
              <FontAwesome name="check" size={24} color="green" />
            )}
          </Pressable>
          <Pressable onPress={handleDelete}>
            <FontAwesome name="trash" size={24} color="red" />
          </Pressable>
        </HStack>
      </HStack>
    </Box>
  );
};

export default Taskscards;
