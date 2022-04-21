import React, { useCallback, useContext, useState } from "react";
import {
  HStack,
  VStack,
  Heading,
  Text,
  Fab,
  useToast,
  Button,
  FlatList,
} from "native-base";
import * as Progress from "react-native-progress";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { baseApiUrl } from "../constant";
import { UserContext } from "../Context/UserContext";
import { Taskscards, LoadingCentered } from "../component";

const Detailproject = ({ route, navigation }) => {
  const [userState] = useContext(UserContext);
  const toast = useToast();
  const { project: currentProject } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  if (!currentProject) {
    return navigation.navigate("main");
  }

  const [project, setProject] = useState(currentProject);

  const getProject = async () => {
    setIsLoading(true);
    await fetch(`${baseApiUrl}/projects/${currentProject?.id}`, {
      headers: {
        Authorization: `Bearer ${userState?.token}`,
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        const { data, status, message } = responseData;
        setIsLoading(false);

        if (status === "created") {
          const { project } = data;
          setProject(project);
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
          title: "Error",
          description: "can't connect to server!",
          background: "danger.500",
          placement: "top",
        });
      });
  };

  const _getHeader = () => {
    return (
      <>
        <HStack space={3} alignItems={"center"} mt={3} safeArea>
          <Progress.Circle
            progress={
              project?.count_task
                ? project?.count_task_complete / project?.count_task
                : 0
            }
            size={90}
            showsText={true}
            color={"#FA5555"}
            borderWidth={5}
            strokeCap={"round"}
            thickness={5}
            formatText={() => {
              return `${
                (project?.count_task_complete / project?.count_task).toFixed(
                  2
                ) * 100 || 0
              }%`;
            }}
          />
          <VStack>
            <Heading fontWeight={"black"} my={3} numberOfLines={2}>
              {project?.title}
            </Heading>
            <Text
              fontWeight={"black"}
              fontSize={12}
              color={"grey.100"}
              numberOfLines={3}
              mb={3}
              w={"70%"}
            >
              {project?.description}
            </Text>
            <Text fontSize={11} color={"card.50"} fontWeight={"black"}>
              {project?.count_task_complete} / {project?.count_task} Tasks
              Completed
            </Text>
          </VStack>
        </HStack>
        <HStack
          justifyContent={"space-between"}
          alignItems={"center"}
          mt={10}
          mb="5"
        >
          <Heading size={"md"}>Your Tasks</Heading>
          <Button
            borderRadius={"md"}
            background={"primary.400"}
            onPress={() => navigation.navigate("add-task", { project })}
          >
            <Feather name="plus" size={24} color="white" />
          </Button>
        </HStack>
      </>
    );
  };

  const deleteProject = async () => {
    setIsLoading(true);
    await fetch(`${baseApiUrl}/projects/${project?.id}`, {
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
          navigation.goBack();
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
          description: "Can't connect to server!",
          background: "danger.500",
          placement: "top",
        });
      });
  };

  const _getFooter = () => {
    return (
      <Button background={"danger.500"} onPress={deleteProject}>
        <Heading size={"sm"} color={"grey.50"}>
          Delete Project
        </Heading>
      </Button>
    );
  };

  const onChange = async () => {
    await getProject();
  };

  useFocusEffect(
    useCallback(() => {
      getProject();
    }, [])
  );

  return (
    <>
      <LoadingCentered backdrop show={isLoading} />
      {!isLoading && (
        <Fab
          icon={<MaterialIcons name="edit" size={24} color="white" />}
          renderInPortal={false}
          shadow={2}
          size={"sm"}
          background={"primary.400"}
          onPress={() => navigation.navigate("edit-project", { project })}
        />
      )}

      <FlatList
        data={project?.tasks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={_getHeader}
        ListFooterComponent={_getFooter}
        bg={"grey.50"}
        renderItem={({ item }) => (
          <Taskscards
            task={item}
            onChange={onChange}
            toast={toast}
            navigation={navigation}
            setIsLoading={setIsLoading}
          />
        )}
        px={3}
      />
    </>
  );
};

export default Detailproject;
