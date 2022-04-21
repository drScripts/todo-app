import {
  FlatList,
  Box,
  HStack,
  VStack,
  Heading,
  Text,
  Fab,
  useToast,
} from "native-base";
import { useState, useCallback } from "react";
import * as Progress from "react-native-progress";
import { Header, TaskCard, NoData, LoadingCentered } from "../../component";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Api } from "../../services";

const HomeScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [almostProject, setAlmostProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const getProjects = async () => {
    setIsLoading(true);

    const { data: responseData, status } = await Api.get("/projects").catch(
      (err) => err?.response
    );

    const { data, message } = responseData;
    if (status === 200) {
      let countHigher = 0;
      const almostFinished = data?.projects?.filter((project) => {
        const length = project?.tasks?.length;
        if (length >= countHigher) {
          countHigher = length;
          return project;
        }
      });
      setAlmostProject(almostFinished[0]);
      setProjects(data?.projects);
    } else {
      toast.show({
        title: "Warning",
        description: message || "Can't connect to server",
        background: "danger.500",
        placement: "top",
      });
    }

    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      getProjects();
    }, [])
  );

  const _getHeader = () => {
    return (
      <>
        <Header />
        {almostProject ? (
          <>
            <Text bold fontSize={"md"} mb={2}>
              Almost There!
            </Text>
            <Box
              px={3}
              py={5}
              borderRadius={"lg"}
              background={"grey.20"}
              w={"100%"}
              shadow={"6"}
            >
              <HStack space={3} justifyContent={"space-between"}>
                <Progress.Circle
                  progress={
                    almostProject?.count_task
                      ? almostProject?.count_task_complete /
                        almostProject?.count_task
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
                      (
                        almostProject?.count_task_complete /
                        almostProject?.count_task
                      ).toFixed(2) * 100 || 0
                    }%`;
                  }}
                />
                <VStack justifyContent={"space-between"}>
                  <Heading
                    size="sm"
                    width={"50%"}
                    fontWeight={"black"}
                    numberOfLines={2}
                  >
                    {almostProject?.title}
                  </Heading>
                  <Text
                    fontWeight={"black"}
                    fontSize={11}
                    width={"50%"}
                    color={"grey.100"}
                    numberOfLines={3}
                  >
                    {almostProject?.description}
                  </Text>
                  <Text color={"card.50"} fontWeight={"black"}>
                    {almostProject?.count_task_complete} /
                    {almostProject?.count_task} Tasks Completed
                  </Text>
                </VStack>
              </HStack>
            </Box>
            <Text bold fontSize={"md"} mt={3}>
              Your Tasks
            </Text>
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  if (isLoading) {
    return <LoadingCentered />;
  } else {
    return (
      <>
        <Fab
          renderInPortal={false}
          shadow={2}
          size={"sm"}
          icon={<AntDesign name="plus" size={24} color="white" />}
          onPress={() => navigation.push("add-project")}
          bg={"primary.400"}
        />
        <FlatList
          data={projects}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => {
            return <TaskCard project={item} navigation={navigation} />;
          }}
          ListHeaderComponent={_getHeader}
          p={3}
          numColumns={2}
          ListEmptyComponent={<NoData message={"No Project Data"} />}
          ListFooterComponent={<Box mb={5}></Box>}
          bg={"grey.50"}
        />
      </>
    );
  }
};

export default HomeScreen;
