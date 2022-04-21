import React from "react";
import { Box, Heading, Image } from "native-base";

const Nodata = ({ message }) => {
  return (
    <Box flex={1} justifyContent={"center"} alignItems={"center"} mt={"9"}>
      <Image
        source={require("../assets/no_data.png")}
        size={"2xl"}
        alt={"Illustration No Data"}
      />
      <Heading textAlign={"center"} mt={4}>
        {message ? message : "No Data!"}
      </Heading>
    </Box>
  );
};

export default Nodata;
