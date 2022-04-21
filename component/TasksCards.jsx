import React, { useContext } from "react";
import { Box, HStack, Heading, Pressable } from "native-base";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { baseApiUrl } from "../constant";
import { UserContext } from "../Context/UserContext";

const Taskscards = ({ task, onChange, toast, navigation, setIsLoading }) => {
  const [userState] = useContext(UserContext);

  const handleEdit = () => {
    navigation.navigate("edit-task", { task });
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await fetch(`${baseApiUrl}/tasks/${task?.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userState?.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        const { status, message } = responseData;
        setIsLoading(false);

        if (status === "created") {
          onChange();
        } else {
          toast.show({
            title: "Warning",
            description: message,
            background: "danger.500",
            placement: "top",
          });
        }
      })
      .catch(() => {
        setIsLoading(false);
        toast.show({
          title: "Warning",
          description: "Can't connect to server",
          background: "danger.500",
          placement: "top",
        });
      });
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    const status = task?.status === "complete" ? "pending" : "complete";

    await fetch(`${baseApiUrl}/tasks/${task?.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userState?.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        const { status, message } = responseData;
        setIsLoading(false);
        if (status === "created") {
          onChange();
        } else {
          toast.show({
            title: "Warning",
            description: message,
            background: "danger.500",
            placement: "top",
          });
        }
      })
      .catch(() => {
        setIsLoading(false);
        toast.show({
          title: "Warning",
          description: "Can't connect to server",
          background: "danger.500",
          placement: "top",
        });
      });
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
