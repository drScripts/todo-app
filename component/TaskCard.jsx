import { Heading, Text, Pressable } from "native-base";
import * as Progress from "react-native-progress";

const Taskcard = ({ project, navigation }) => {
  return (
    <Pressable
      p={2}
      background={"grey.20"}
      borderRadius={"lg"}
      w={"45%"}
      shadow={"6"}
      m={2}
      onPress={() => navigation.navigate("detail-project", { project })}
    >
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
            (project?.count_task_complete / project?.count_task).toFixed(2) *
              100 || 0
          }%`;
        }}
      />
      <Heading size="xs" fontWeight={"black"} my={3} numberOfLines={2}>
        {project?.title}
      </Heading>
      <Text
        fontWeight={"black"}
        fontSize={10}
        color={"grey.100"}
        numberOfLines={3}
        mb={3}
      >
        {project?.description}
      </Text>
      <Text fontSize={11} color={"card.50"} fontWeight={"black"}>
        {project?.count_task_complete} / {project?.count_task} Tasks Completed
      </Text>
    </Pressable>
  );
};

export default Taskcard;
