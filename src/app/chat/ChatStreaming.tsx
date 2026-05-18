// ChatStreaming.tsx

import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
    Dimensions,
    Platform,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import GradientBackground from "../../../styles/Background";
import { fonts } from "../../../styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type ChatType = "GROUP" | "INDIVIDUAL";

type MessageType =
    | "TEXT"
    | "IMAGE"
    | "VIDEO"
    | "AUDIO"
    | "FILE";

interface ChatStreamingProps {
    chatType: ChatType;
    chatId: string;
    currentUserId: string;
}

interface Message {
    id: string;
    senderId: string;
    type: MessageType;
    content: string;
    fileName?: string;
    thumbnail?: string;
    createdAt: string;
}

const ChatStreaming = ({ route }: { route: { params: ChatStreamingProps } }) => {
    const {
        chatType,
        chatId,
        currentUserId,
    } = route.params;
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    const [recording, setRecording] = useState<Audio.Recording | null>(null);

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        // Hardcoded Initial Return Message
        setMessages([
            {
                id: "1",
                senderId: "system",
                type: "TEXT",
                content: "Return Message",
                createdAt: new Date().toISOString(),
            },
        ]);
    }, []);

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    // =========================
    // Compressor Utility
    // =========================

    const compressFile = async (uri: string) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);

            if (!fileInfo.exists) return uri;

            // Mock Compression Logic
            // You can replace with ffmpeg/image-manipulator later

            console.log("Original Size:", fileInfo.size);

            return uri;
        } catch (err) {
            console.log(err);
            return uri;
        }
    };

    // =========================
    // Send Message
    // =========================

    const pushMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);

        // HARDCODED AUTO RESPONSE
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    senderId: "bot",
                    type: "TEXT",
                    content: "Return Message",
                    createdAt: new Date().toISOString(),
                },
            ]);
        }, 700);
    };

    const sendText = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: currentUserId,
            type: "TEXT",
            content: input,
            createdAt: new Date().toISOString(),
        };

        pushMessage(newMessage);
        setInput("");
    };

    // =========================
    // Pick Image
    // =========================

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                quality: 0.4,
            });

            if (!result.canceled) {
                const compressedUri = await compressFile(result.assets[0].uri);

                pushMessage({
                    id: Date.now().toString(),
                    senderId: currentUserId,
                    type: "IMAGE",
                    content: compressedUri,
                    createdAt: new Date().toISOString(),
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    // =========================
    // Pick Video
    // =========================

    const pickVideo = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["videos"],
                quality: 0.4,
            });

            if (!result.canceled) {
                const videoUri = await compressFile(result.assets[0].uri);

                const thumbnail = await VideoThumbnails.getThumbnailAsync(videoUri, {
                    time: 1000,
                });

                pushMessage({
                    id: Date.now().toString(),
                    senderId: currentUserId,
                    type: "VIDEO",
                    content: videoUri,
                    thumbnail: thumbnail.uri,
                    createdAt: new Date().toISOString(),
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    // =========================
    // Pick File
    // =========================

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                const file = result.assets[0];

                const compressedUri = await compressFile(file.uri);

                pushMessage({
                    id: Date.now().toString(),
                    senderId: currentUserId,
                    type: "FILE",
                    content: compressedUri,
                    fileName: file.name,
                    createdAt: new Date().toISOString(),
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    // =========================
    // Audio Recording
    // =========================

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();

            if (!permission.granted) return;

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
        } catch (err) {
            console.log(err);
        }
    };

    const stopRecording = async () => {
        try {
            if (!recording) return;

            await recording.stopAndUnloadAsync();

            const uri = recording.getURI();

            if (!uri) return;

            const compressedUri = await compressFile(uri);

            pushMessage({
                id: Date.now().toString(),
                senderId: currentUserId,
                type: "AUDIO",
                content: compressedUri,
                createdAt: new Date().toISOString(),
            });

            setRecording(null);
        } catch (err) {
            console.log(err);
        }
    };

    // =========================
    // Render Message
    // =========================

    const renderMessage = ({ item }: { item: Message }) => {
        const isMine = item.senderId === currentUserId;

        return (
            <View
                style={[
                    styles.messageContainer,
                    isMine ? styles.myMessage : styles.otherMessage,
                ]}
            >
                {item.type === "TEXT" && (
                    <Text style={styles.messageText}>{item.content}</Text>
                )}

                {item.type === "IMAGE" && (
                    <Image
                        source={{ uri: item.content }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}

                {item.type === "VIDEO" && (
                    <View>
                        {item.thumbnail && (
                            <Image
                                source={{ uri: item.thumbnail }}
                                style={styles.image}
                            />
                        )}
                        <Text style={styles.fileText}>Video Attached</Text>
                    </View>
                )}

                {item.type === "AUDIO" && (
                    <Text style={styles.fileText}>🎤 Audio Message</Text>
                )}

                {item.type === "FILE" && (
                    <Text style={styles.fileText}>
                        📄 {item.fileName || "File"}
                    </Text>
                )}
                <Text style={styles.timeText}>9:00 AM</Text>
            </View>
        );
    };

    return (
        <GradientBackground>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        {chatType === "GROUP"
                            ? "Group Chat"
                            : "Individual Chat"}
                    </Text>
                </View>

                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.list}
                />

                {/* Input */}
                <View style={styles.bottomContainer}>
                    <TextInput
                        placeholder="Message..."
                        value={input}
                        onChangeText={setInput}
                        style={styles.input}
                        multiline
                        placeholderTextColor="#9ab17ad1"
                    />

                    <TouchableOpacity onPress={pickImage} style={styles.actionBtn}>
                        <Text>🖼️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={pickVideo} style={styles.actionBtn}>
                        <Text>🎥</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={pickFile} style={styles.actionBtn}>
                        <Text>📎</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPressIn={startRecording}
                        onPressOut={stopRecording}
                        style={styles.actionBtn}
                    >
                        <Text>🎤</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={sendText} style={styles.sendBtn}>
                       <Ionicons name="send" size={24} color="black"  style={{right:-2}}/>
                    </TouchableOpacity>
                </View>
            </View>
        </GradientBackground>
    );
};

export default ChatStreaming;

// =========================
// Styles
// =========================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#0E0E0E",
    },

    header: {
        paddingTop: Platform.OS === "ios" ? 60 : 30,
        paddingBottom: 15,
        // paddingHorizontal: 20,
        // backgroundColor: "#151515",
    },

    headerTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
        fontFamily: fonts.Ebold,
    },

    list: {
        paddingTop: 15,
        paddingBottom: 100,
    },

    messageContainer: {
        maxWidth: "80%",
        marginBottom: 12,
        padding: 12,
        borderRadius: 15,
        fontFamily: fonts.Ebold,
    },

    myMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#9ab17a7b",
        fontFamily: fonts.Eregular,
        borderWidth: 1,
        borderColor: "#9ab17ad1",
    },

    otherMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#1A1A1A",
        fontFamily: fonts.Eregular,
        padding: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },

    messageText: {
        color: "white",
        fontSize: 15,
        fontFamily: fonts.Eregular,
    },

    image: {
        width: width * 0.55,
        height: 220,
        borderRadius: 12,
    },

    fileText: {
        color: "white",
        marginTop: 8,
        fontFamily: fonts.Ebold,
    },

    bottomContainer: {
        position: "absolute",
        bottom: 20,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        // backgroundColor: "#151515",
    },

    input: {
        flex: 1,
        // backgroundColor: "#262626",
        color: "white",
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 16,
        // maxHeight: 100,
        fontFamily: fonts.Eregular,
        borderWidth: 1,
        borderColor: "#9ab17ad1",
    },

    actionBtn: {
        marginLeft: 8,
    },

    sendBtn: {
        marginLeft: 10,
        backgroundColor: "#9ab17a",
        borderRadius: 20,
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ rotate: "-45deg" }],
    },

  
    
    timeText: {
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: 8,
        fontFamily: fonts.Eregular,
        marginTop: 12,
        alignSelf: "flex-end",
    },
});