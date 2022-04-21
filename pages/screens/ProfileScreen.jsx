import React, { useState, useContext } from "react";
import {
  Box,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  VStack,
  Input,
  Button,
  useToast,
} from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { UserContext } from "../../Context/UserContext";
import * as ImagePicker from "expo-image-picker";
import { baseApiUrl } from "../../constant";
import { LoadingCentered } from "../../component";

const Profilescreen = () => {
  const toast = useToast();
  const [userState, dispatch] = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [state, setState] = useState({
    ...userState?.user,
    profession: userState?.user?.profile?.profession,
  });
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (value) => {
    setState({
      ...state,
      ...value,
    });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("This action need your permission to pick an image!");
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setFile(result);
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const { profession, email, name } = state;

    if (email && name && (profession || state?.profile?.profession)) {
      const form = new FormData();

      const newProfession = profession
        ? profession
        : state?.profile?.profession;

      form.append("name", name);
      form.append("profession", newProfession);

      if (file) {
        const fileName = file.uri.split("/").pop();
        let match = /\.(\w+)$/.exec(fileName);
        let type = match ? `image/${match[1]}` : `image`;

        form.append("image", { uri: file.uri, name: fileName, type });
      }

      await fetch(`${baseApiUrl}/users/profile`, {
        method: "PATCH",
        body: form,
        headers: {
          Authorization: `Bearer ${userState?.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          setIsLoading(false);
          const { data, status, message } = responseData;

          if (status === "success") {
            dispatch({
              type: "USER_UPDATE_PROFILE",
              payload: data,
            });
          } else {
            toast.show({
              title: "Error",
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
            description: "Can't connect to server",
            background: "danger.500",
            placement: "top",
          });
        });
    } else {
      setIsLoading(false);
      toast.show({
        title: "Warning",
        description: "Please insert all form!",
        background: "danger.500",
        placement: "top",
      });
    }
  };

  const onLogout = () => {
    dispatch({
      type: "USER_LOGOUT",
    });
  };

  if (isLoading) {
    return <LoadingCentered />;
  } else {
    return (
      <ScrollView bg={"grey.50"}>
        <KeyboardAvoidingView>
          <Box safeArea flex={1} px={3}>
            <TouchableOpacity onPress={pickImage}>
              <Box
                mt={5}
                borderWidth={2}
                borderColor={"grey.900"}
                borderRadius={"full"}
                p={2}
                borderStyle={"dashed"}
                alignSelf={"center"}
              >
                <Image
                  source={
                    file?.uri
                      ? { uri: file?.uri }
                      : state?.profile?.profile_pict
                      ? { uri: state?.profile?.profile_pict }
                      : require("../../assets/add_profile.png")
                  }
                  alt={"Add Profile Image"}
                  size={"lg"}
                  borderRadius={"full"}
                />
              </Box>
            </TouchableOpacity>

            <VStack space={3} mt={6}>
              <Input
                placeholder="Enter Your Full Name"
                borderRadius={10}
                borderWidth={2}
                borderColor={"grey.200"}
                _input={{
                  fontWeight: "semibold",
                }}
                onChangeText={(text) => onChange({ name: text })}
                value={state?.name}
              />
              <Input
                placeholder="Enter Your Email"
                borderRadius={10}
                borderWidth={2}
                borderColor={"grey.200"}
                _input={{
                  fontWeight: "semibold",
                }}
                value={state?.email}
                isDisabled
              />
              <Input
                placeholder="Enter Your Profession"
                borderRadius={10}
                borderWidth={2}
                borderColor={"grey.200"}
                _input={{
                  fontWeight: "semibold",
                }}
                onChangeText={(text) => onChange({ profession: text })}
                value={state?.profession}
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
                Update
              </Button>
              <Button
                bg={"danger.400"}
                borderRadius={10}
                _text={{
                  fontWeight: "bold",
                  fontSize: 16,
                }}
                shadow={"3"}
                onPress={onLogout}
              >
                Logout
              </Button>
            </VStack>
          </Box>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
};

export default Profilescreen;
