import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  ScrollView
} from "react-native";

import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";

import AudioRecord from "react-native-audio-record";
import RNFS from "react-native-fs";
import Sound from "react-native-sound";

Sound.setCategory("Playback");

export default function VoiceAssistantScreen() {
  const navigation = useNavigation();

  const wsRef = useRef(null);

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordMode, setRecordMode] = useState(null);
  const [voiceHeardTexts, setVoiceHeardTexts] = useState({}); // Store what was heard for each voice message

  const soundRef = useRef(null);
  const flatListRef = useRef(null);
  const lastVoiceMode = useRef(null);

  // Suggested messages
  const suggestedMessages = [
    "Download sales report",
    "Show today's sales",
    "Open sales screen",
    "View pending requests",
    "Generate monthly report",
    "Get attendance status"
  ];

  // -------------------------------------------------------------
  // SETUP WEBSOCKET + PERMISSIONS
  // -------------------------------------------------------------
  useEffect(() => {
    let socket;

    async function setup() {
      if (Platform.OS === "android") {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);
      }

      await AudioRecord.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        audioSource: 6,
        wavFile: "record.wav"
      });

      socket = new WebSocket("ws://192.168.0.9:8000");

      socket.onopen = () => {
        console.log("WS Connected");
        socket.send(JSON.stringify({ type: "connect" }));
        // Add welcome message
        addMessage(false, "Hello! I'm your assistant. You can chat or speak with me.", null, false, true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type !== "reply") return;

          const confidence =
            data.meta && typeof data.meta.confidence === "number"
              ? data.meta.confidence
              : 1;

          const isWrongInput = confidence < 0.6;

          /**
           * 1️⃣ UPDATE THE WAITING VOICE MESSAGE
           * This replaces:
           *   "Listening..."
           * with:
           *   "Voice message"
           *   Heard: "<transcribed text>"
           */
          setMessages(prevMessages =>
            prevMessages.map(msg => {
              if (
                msg.isUser &&
                msg.status === "waiting" &&
                msg.source === "voice"
              ) {
                return {
                  ...msg,
                  text: "Voice message",
                  heard: data.text || null,
                  isWrong: isWrongInput,
                  status: "done"
                };
              }
              return msg;
            })
          );


          /**
           * 2️⃣ ADD ASSISTANT REPLY AS A NEW MESSAGE
           */
          setMessages(prevMessages => [
            {
              id: Date.now().toString(),
              isUser: false,
              text: data.reply,
              heard: null,
              isWrong: false,
              isWelcome: false,
              status: "done"
            },
            ...prevMessages
          ]);

          /**
           * 3️⃣ HANDLE INTENT NAVIGATION
           */
          if (data.intent) {
            handleIntent(data.intent, data.params);
          }

          /**
           * 4️⃣ PLAY VOICE RESPONSE (ONLY FOR VOICE→VOICE MODE)
           */
          if (data.audio && lastVoiceMode.current === "voice_voice") {
            playVoice(data.audio);
          }

        } catch (e) {
          console.log("WS message error:", e);
        }
      };

      socket.onerror = (e) => {
        console.log("WS Error:", e.message);
      };

      socket.onclose = () => {
        console.log("WS Closed – reconnecting...");
        setTimeout(setup, 2000);

      };


      wsRef.current = socket;
    }

    setup();

    // ✅ CLEANUP HERE
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.release();
      }
    };
  }, []);

  // -------------------------------------------------------------
  // PLAY AI VOICE
  // -------------------------------------------------------------
  const playVoice = async (base64Audio) => {
    try {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.release();
      }

      const path = RNFS.DocumentDirectoryPath + "/reply.wav";
      await RNFS.writeFile(path, base64Audio, "base64");

      soundRef.current = new Sound(path, "", (err) => {
        if (!err) soundRef.current.play();
      });
    } catch (e) {
      console.log("Voice playback error:", e);
    }
  };

  // -------------------------------------------------------------
  // STORE MESSAGE IN CHAT UI
  // -------------------------------------------------------------
  const addMessage = (
    isUser,
    text,
    heard = null,
    isWrong = false,
    isWelcome = false,
    status = "sent" // 👈 default
  ) => {
    const messageId = Date.now().toString();

    setMessages(prev => [
      {
        id: messageId,
        isUser,
        text,
        heard,
        isWrong,
        isWelcome,
        status
      },
      ...prev
    ]);

    return messageId;
  };


  // -------------------------------------------------------------
  // HANDLE INTENTS FOR NAVIGATION
  // -------------------------------------------------------------
  const handleIntent = (intent, params) => {
    switch (intent) {
      case "download_sales_report":
        navigation.navigate("SalesScreen", { autoDownload: true });
        break;
      case "search_user":
        navigation.navigate("UserScreen", { userId: params?.user_id || "0" });
        break;
      case "check_task_status":
        navigation.navigate("TaskScreen");
        break;
      case "open_sales_screen":
        navigation.navigate("SalesScreen");
        break;
    }
  };

  const safeSendWS = (payload, messageId) => {
    if (!wsRef.current || wsRef.current.readyState !== 1) {
      // ❌ WS not ready → mark message failed
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? { ...m, status: "failed" } : m
        )
      );
      return false;
    }

    try {
      wsRef.current.send(JSON.stringify(payload));
      return true;
    } catch (e) {
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? { ...m, status: "failed" } : m
        )
      );
      return false;
    }
  };


  // -------------------------------------------------------------
  // SEND TYPED MESSAGE
  // -------------------------------------------------------------
  const sendTextMessage = () => {
    if (!inputText.trim()) return;

    const messageId = Date.now().toString();

    const payload = {
      type: "text",
      text: inputText,
      messageId
    };
    setMessages(prev => [
      {
        id: messageId,
        isUser: true,
        text: inputText,
        status: "waiting",
        source: "text",      // ✅ ADD THIS
        payload
      },
      ...prev
    ]);


    lastVoiceMode.current = "text";

    const success = safeSendWS(payload, messageId);

    if (success) {
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? { ...m, status: "sent" } : m
        )
      );
    }

    setInputText("");
  };

  // -------------------------------------------------------------
  // SEND SUGGESTED MESSAGE
  // -------------------------------------------------------------
  const sendSuggestedMessage = (message) => {
    const messageId = Date.now().toString();

    const payload = {
      type: "text",
      text: message,
      messageId
    };

    setMessages(prev => [
      {
        id: messageId,
        isUser: true,
        text: message,
        status: "waiting",
        source: "text",      // ✅ ADD THIS
        payload
      },
      ...prev
    ]);


    lastVoiceMode.current = "text";
    safeSendWS(payload, messageId);
  };

  // -------------------------------------------------------------
  // VOICE RECORD START/STOP
  // -------------------------------------------------------------
  const startRecording = (mode) => {
    if (isRecording) return;

    setRecordMode(mode);
    setIsRecording(true);
    AudioRecord.start();
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    setIsRecording(false);

    const path = await AudioRecord.stop();
    const base64 = await RNFS.readFile(path, "base64");

    // ⏳ Show waiting message
    const messageId = addMessage(
      true,
      recordMode === "voice_text"
        ? "Listening..."
        : "Listening...",
      null,
      false,
      false,
      "waiting" // ⬅️ important
    );

    const payload = {
      type: recordMode === "voice_text" ? "audio_to_text" : "audio",
      audio: base64,
      messageId
    };

    setMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? {
            ...m,
            payload,
            source: "voice"   // ✅ ADD THIS
          }
          : m
      )
    );



    safeSendWS(payload, messageId);


    lastVoiceMode.current = recordMode;


    setRecordMode(null);
  };


  const retryMessage = (message) => {
    if (!message.payload) return;

    // mark as waiting again
    setMessages(prev =>
      prev.map(m =>
        m.id === message.id ? { ...m, status: "waiting" } : m
      )
    );

    const success = safeSendWS(message.payload, message.id);

    if (success) {
      setMessages(prev =>
        prev.map(m =>
          m.id === message.id ? { ...m, status: "sent" } : m
        )
      );
    }
  };



  // -------------------------------------------------------------
  // RENDER CHAT MESSAGE BUBBLE
  // -------------------------------------------------------------
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble,
        item.isWelcome && styles.welcomeBubble
      ]}
    >
      {/* Voice message header for user voice messages */}
      {item.isUser && item.text.includes("Voice to") && (
        <Text style={styles.voiceHeader}>
          {item.text.includes("Voice to Text") ? "🎤 Voice Message" : "🎵 Voice Message"}
        </Text>
      )}

      {/* Message text - adjust for voice messages */}
      <Text
        style={[
          styles.messageText,
          item.isUser && styles.userText,
          item.isWelcome && styles.welcomeText
        ]}
      >
        {item.text} </Text>


      {/* Show what was heard for voice messages */}
      {item.isUser && item.heard && (
        <View style={styles.heardContainer}>
          <Text style={styles.heardLabel}>Heard:</Text>
          <Text style={[
            styles.heardText,
            item.isWrong && styles.heardTextError
          ]}>
            "{item.heard}"
          </Text>
          {item.isWrong && (
            <Text style={styles.confidenceWarning}>⚠️ Low confidence</Text>
          )}
        </View>
      )}


      {/* Show what was heard for regular messages (existing functionality) */}
      {!item.isUser && item.heard && (
        <View style={styles.heardContainer}>
          <Text style={styles.heardLabel}>Heard:</Text>
          <Text style={[styles.heardText, item.isWrong && styles.heardTextError]}>
            "{item.heard}"
          </Text>
          {item.isWrong && (
            <Text style={styles.confidenceWarning}>⚠️ Low confidence</Text>
          )}
        </View>
      )}

      {/* Welcome message indicator */}
      {item.isWelcome && (
        <Text style={styles.welcomeHint}>Try speaking or typing a command</Text>
      )}

      {item.status === "waiting" && item.source === "voice" && (
        <Text style={{ fontSize: 12, color: "#ffeb3b" }}>
          ⏳ Processing voice...
        </Text>
      )}

      {/* FAILED STATE */}
      {item.isUser && item.status === "failed" && (
        <TouchableOpacity
          style={styles.retryContainer}
          onPress={() => retryMessage(item)}
        >
          <View style={styles.row}>

            <Text style={styles.retryText}>⛔Connection Failed · Tap to retry</Text>
          </View>
        </TouchableOpacity>
      )}


    </View>

  );

  // -------------------------------------------------------------
  // UI
  // -------------------------------------------------------------
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 90 : 70}
    >
      <View style={{ flex: 1 }}>
        {/* CHAT LIST */}
        <KeyboardAwareFlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 15 }}
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          inverted={true}
        />

        {/* RECORDING BANNER */}
        {isRecording && (
          <View style={styles.recordBar}>
            <Text style={styles.recordText}>
              {recordMode === "voice_text"
                ? "🎤 Please hold for Recording voice ..."
                : "🎵 Please hold for Recording voice..."
              }
            </Text>
          </View>
        )}

        {/* SUGGESTED MESSAGES - ADDED ABOVE INPUT */}
        <View style={styles.suggestionsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
          >
            {suggestedMessages.map((message, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => sendSuggestedMessage(message)}
              >
                <Text style={styles.suggestionText}>{message}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* BOTTOM BAR */}
        <View style={styles.bottomBar}>
          {/* Text Input Row */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type message"
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
              returnKeyType="send"
              onSubmitEditing={sendTextMessage}
              blurOnSubmit={false}
            />

            <TouchableOpacity
              onPress={sendTextMessage}
              style={styles.smallIconButton}
            >
              <Image
                source={require("../assets/send.png")}
                style={styles.smallIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Mic */}
          <TouchableOpacity
            style={styles.iconButton}
            onPressIn={() => startRecording("voice_text")}
            onPressOut={stopRecording}
          >
            <Image source={require("../assets/mic.png")} style={styles.icon} />
          </TouchableOpacity>

          {/* Talk */}
          <TouchableOpacity
            style={styles.iconButton}
            onPressIn={() => startRecording("voice_voice")}
            onPressOut={stopRecording}
          >
            <Image source={require("../assets/talk.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// -------------------------------------------------------------
// STYLES
// -------------------------------------------------------------
const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row"
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },

  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  welcomeBubble: {
    alignSelf: "center",
    backgroundColor: "#f0f8ff",
    borderWidth: 1,
    borderColor: "#b3d9ff",
    maxWidth: "90%",

  },

  voiceHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },

  messageText: {
    fontSize: 16,
    color: "#000"
  },

  userText: {
    color: "#fff",
    fontSize: 14
  },

  welcomeText: {
    color: "#0066cc",
    fontSize: 15,
    textAlign: "center",
  },

  heardContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#ddd",
  },

  heardLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "bold",
    marginBottom: 2,
  },

  heardText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontStyle: "italic",
  },

  heardTextError: {
    color: "#ffcccb",
    fontWeight: "bold",
  },

  confidenceWarning: {
    fontSize: 10,
    color: "#ffcccb",
    marginTop: 4,
    fontWeight: "500",
  },

  welcomeHint: {
    fontSize: 12,
    color: "#3399ff",
    marginTop: 8,
    fontStyle: "italic",
    textAlign: "center",
  },

  // New styles for suggestions
  suggestionsContainer: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  suggestionsScroll: {
    paddingHorizontal: 10,
  },

  suggestionChip: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },

  suggestionText: {
    color: "#1565c0",
    fontSize: 14,
    fontWeight: "500",
  },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginBottom: 8
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 25,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: "#333",
  },

  smallIconButton: {
    padding: 8,
    marginLeft: 5,
  },

  smallIcon: {
    width: 32,
    height: 32,
    tintColor: "#007AFF",
  },

  iconButton: {
    backgroundColor: "#40b9f1ff",
    padding: 8,
    borderRadius: 25,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  Retryicon: {
    width: 12,
    height: 12,
    color: "#ff6565ff",
  },

  icon: {
    width: 32,
    height: 32,
  },

  recordBar: {
    backgroundColor: "#ffdddd",
    padding: 8,
    alignItems: "center",
  },

  recordText: {
    color: "#d00",
    fontWeight: "bold",
    fontSize: 14,
  },
  retryContainer: {
    marginTop: 6,
    alignSelf: "flex-end"
  },

  retryText: {
    fontSize: 12,
    color: "#ff6565ff",
    fontWeight: "600",

  }

});