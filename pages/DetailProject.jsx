import React, { useCallback, useState } from "react";
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
import { Taskscards, LoadingCentered } from "../component";
import { Api } from "../services";

const Detailproject = ({ route, navigation }) => {
  const toast = useToast();
  const { project: currentProject } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  if (!currentProject) {
    return navigation.navigate("main");
  }

  const [project, setProject] = useState(currentProject);

  const getProject = async () => {
    setIsLoading(true);

    const { data: responseData, status } = await Api.get(
      `/projects/${currentProject?.id}`
    ).catch((err) => err?.response);

    const { data, message } = responseData;

    setIsLoading(false);
    if (status === 200) {
      setProject(data?.project);
    } else {
      toast.show({
        title: "Warning",
        description: message || "Can't connect to server",
        background: "danger.500",
        placement: "top",
      });
    }
  };

  const deleteProject = async () => {
    setIsLoading(true);

    const { data: responseData, status } = await Api.delete(
      `/projects/${project?.id}`
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
