import React from "react";
import { KeyboardAvoidingView,View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';


export default function LoginScreen() {
    const navigation = useNavigation();

    return (
       <KeyboardAvoidingView
       style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
            <View style={sty.container}>
                <View style={sty.loginContainer}>

                    <Text style={sty.header}>Voice Assistance</Text>
                    <Text style={sty.content}>Welcome please login to continue</Text>


                    <Text style={sty.headerSub}>Username</Text>
                    <View style={sty.inputContainer}>
                        <TextInput
                            placeholder="Enter the username"
                            placeholderTextColor={"grey"}
                            style={sty.input}
                        />

                    </View>


                    <Text style={sty.headerSub}>Password</Text>
                    <View style={sty.inputContainer}>
                        <TextInput
                            placeholder="Enter the Password"
                            placeholderTextColor={"grey"}
                            secureTextEntry
                            style={sty.input}
                        />
                    </View>

                    <TouchableOpacity
                        style={sty.loginBtn}
                        onPress={() => navigation.navigate("HomeScreen")}
                    >
                        <Text style={sty.btnText}>Login </Text>
                    </TouchableOpacity>


                </View>
            </View>
            </KeyboardAvoidingView>
    );
}

const sty = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#d3d3d3ff",
        justifyContent: "center",
        alignItems: "center"
    },

    loginContainer: {
        width: "85%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        justifyContent: "center"

    },

    header: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 5,
    },
    content: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 12,
        color: "grey"
    },
    headerSub: {
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 5
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 8,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 20,
        marginBottom: 10,
        paddingHorizontal: 15,
        backgroundColor: '#F9F9F9',
    },
    loginBtn: {
        alignItems: "center",
        borderRadius: 20,
        borderWidth: 2,
        padding: 10,
        borderColor: "black",
        marginTop: 10,
        marginHorizontal: 70
    },
    btnText: {


    }



});
