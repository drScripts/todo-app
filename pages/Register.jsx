import {
  KeyboardAvoidingView,
  Input,
  Box,
  Image,
  VStack,
  Button,
  ScrollView,
  HStack,
  Text,
  useToast,
} from "native-base";
import { useState, useContext } from "react";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../Context/UserContext";
import { LoadingCentered } from "../component";
import { baseApiUrl } from "../constant";

const Register = ({ navigation }) => {
  const [file, setFile] = useState(null);
  const [state, setstate] = useState({
    name: "",
    email: "",
    password: "",
    verifyPassword: "",
    profession: "",
  });
  const toast = useToast();
  const [, setUserState] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("This app is require permission to select image profile!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setFile(result);
    }
  };

  const onChange = (value) => {
    setstate({
      ...state,
      ...value,
    });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const { email, name, password, verifyPassword, profession } = state;
    if (
      email &&
      name &&
      password &&
      verifyPassword &&
      profession &&
      file?.uri
    ) {
      if (password !== verifyPassword) {
        return toast.show({
          title: "Warning",
          description:
            "Password and Verify Password Should have the same value!",
          background: "danger.500",
          placement: "top",
        });
      }

      const fileName = file.uri.split("/").pop();
      let match = /\.(\w+)$/.exec(fileName);
      let type = match ? `image/${match[1]}` : `image`;

      const form = new FormData();

      form.append("email", email);
      form.append("name", name);
      form.append("password", password);
      form.append("profession", profession);

      form.append("image", { uri: file.uri, name: fileName, type });

      await fetch(`${baseApiUrl}/register`, {
        method: "POST",
        body: form,
      })
        .then((res) => res.json())
        .then(async (data) => {
          setIsLoading(false);
          if (data.status == "error" || data.status == "conflict") {
            toast.show({
              title: "Warning",
              description: data?.message || "ERROR",
              background: "danger.500",
              placement: "top",
            });
          } else {
            const { data: userData } = data;

            setUserState({
              type: "USER_SUCCESS_LOGIN",
              payload: userData,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toast.show({
            title: "Warning",
            description: "Can't connect to server",
            background: "danger.500",
            placement: "top",
          });
        });
    } else {
      setIsLoading(false);
      toast.show({
        title: "Warning",
        description: "Please Fill All Form !",
        background: "danger.500",
        placement: "top",
      });
    }
  };

  return (
    <>
      <LoadingCentered backdrop show={isLoading} />
      <ScrollView bg={"grey.50"}>
        <KeyboardAvoidingView>
          <Box safeArea flex={1} px={3} pb={10}>
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
                      ? {
                          uri: file.uri,
                        }
                      : require("../assets/add_profile.png")
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
                onChangeText={(text) => onChange({ email: text })}
                value={state?.email}
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
              <Input
                placeholder="Enter Your Password"
                type="password"
                borderRadius={10}
                borderWidth={2}
                borderColor={"grey.200"}
                _input={{
                  fontWeight: "semibold",
                }}
                onChangeText={(text) => onChange({ password: text })}
                value={state?.password}
              />
              <Input
                placeholder="Enter Your Password Again"
                type="password"
                borderRadius={10}
                borderWidth={2}
                borderColor={"grey.200"}
                _input={{
                  fontWeight: "semibold",
                }}
                onChangeText={(text) => onChange({ verifyPassword: text })}
                value={state?.verifyPassword}
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
                Register
              </Button>
            </VStack>
            <HStack alignSelf={"center"} mt={4} space={1}>
              <Text fontWeight={"medium"} fontSize={13}>
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Text
                  fontWeight={"medium"}
                  fontSize={13}
                  underline
                  color={"primary.400"}
                >
                  Login!
                </Text>
              </TouchableOpacity>
            </HStack>
          </Box>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};

export default Register;
