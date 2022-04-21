import React from "react";
import { Box, HStack, Spinner, Heading } from "native-base";

const Loadingcentered = ({ backdrop = false, show = true }) => {
  if (backdrop) {
    return (
      <>
        {show ? (
          <Box
            justifyContent={"center"}
            alignItems={"center"}
            position={"absolute"}
            zIndex={10}
            w={"100%"}
            h={"100%"}
            background={"backdrop.50"}
          >
            <HStack space={2}>
              <Spinner
                accessibilityLabel="Loading posts"
                color={"primary.400"}
              />
              <Heading color="primary.400" fontSize="md">
                Loading
              </Heading>
            </HStack>
          </Box>
        ) : (
          <></>
        )}
      </>
    );
  } else {
    return (
      <>
        {show ? (
          <Box flex={1} justifyContent={"center"} alignItems={"center"}>
            <HStack space={2}>
              <Spinner accessibilityLabel="Loading posts" />
              <Heading color="primary.500" fontSize="md">
                Loading
              </Heading>
            </HStack>
          </Box>
        ) : (
          <></>
        )}
      </>
    );
  }
};

export default Loadingcentered;
