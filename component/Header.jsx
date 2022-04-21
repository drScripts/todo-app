import { HStack, VStack, Heading, Text, Image } from "native-base";
import { UserContext } from "../Context/UserContext";
import { useContext } from "react";

const Header = () => {
  const [userState] = useContext(UserContext);
  return (
    <HStack
      alignItems={"center"}
      justifyContent={"space-between"}
      mb={6}
      safeArea
    >
      <VStack>
        <Heading numberOfLines={2} ellipsizeMode={"tail"}>
          Hey, Good Morning {"\n"}
          {userState?.user?.name} !
        </Heading>
        <Text mt={3} color={"grey.100"} fontWeight={"bold"} fontSize={13}>
          let's make your task structured!
        </Text>
      </VStack>
      <Image
        source={
          userState?.user?.profile?.profile_pict
            ? { uri: userState?.user?.profile?.profile_pict }
            : require("../assets/avatar.png")
        }
        size={"sm"}
        borderRadius={"lg"}
        alt={"Avatar Profile"}
      />
    </HStack>
  );
};

export default Header;
