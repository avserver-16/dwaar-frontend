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
    Modal,
    Pressable,
    Animated,
    Keyboard,
    KeyboardEvent,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import GradientBackground from "../../../styles/Background";
import { fonts } from "../../../styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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
    const [showOptions, setShowOptions] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    // Animated value for bottom offset
    const bottomAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const onShow = (e: KeyboardEvent) => {
            Animated.timing(bottomAnim, {
                toValue: e.endCoordinates.height + 10,
                duration: Platform.OS === "ios" ? e.duration || 250 : 200,
                useNativeDriver: false,
            }).start();
        };

        const onHide = (e: KeyboardEvent) => {
            Animated.timing(bottomAnim, {
                toValue: 20,
                duration: Platform.OS === "ios" ? e.duration || 250 : 200,
                useNativeDriver: false,
            }).start();
        };

        const showSub = Keyboard.addListener(showEvent, onShow);
        const hideSub = Keyboard.addListener(hideEvent, onHide);

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

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
    const navigation = useNavigation();
    return (
        <GradientBackground>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
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
                    showsVerticalScrollIndicator={false}
                />

                {/* Input — animated bottom offset */}
                <Animated.View style={[styles.bottomContainer, { bottom: bottomAnim }]}>
                    
                    <TextInput
                        placeholder="Message..."
                        value={input}
                        onChangeText={setInput}
                        style={styles.input}
                        multiline
                        placeholderTextColor="#9ab17ad1"
                    />

                    <TouchableOpacity
                        style={styles.plusButton}
                        onPress={() => setShowOptions(true)}
                    >
                        <Ionicons
                            name="add"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={sendText} style={styles.sendBtn}>
                        <Ionicons name="send" size={24} color="black" style={{ right: -2 }} />
                    </TouchableOpacity>
                </Animated.View>

                <Modal
                    visible={showOptions}
                    transparent
                    animationType="fade"
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setShowOptions(false)}
                    >
                        <View style={styles.popupContainer}>
                            <TouchableOpacity
                                style={styles.popupOption}
                                onPress={() => {
                                    setShowOptions(false);
                                    pickImage();
                                }}
                            >
                                <Ionicons
                                    name="image-outline"
                                    size={22}
                                    color="white"
                                />
                                <Text style={styles.popupText}>Image</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.popupOption}
                                onPress={() => {
                                    setShowOptions(false);
                                    pickVideo();
                                }}
                            >
                                <Ionicons
                                    name="videocam-outline"
                                    size={22}
                                    color="white"
                                />
                                <Text style={styles.popupText}>Video</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.popupOption}
                                onPress={() => {
                                    setShowOptions(false);
                                    pickFile();
                                }}
                            >
                                <Ionicons
                                    name="document-outline"
                                    size={22}
                                    color="white"
                                />
                                <Text style={styles.popupText}>File</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.popupOption}
                                onPressIn={startRecording}
                                onPressOut={() => {
                                    stopRecording();
                                    setShowOptions(false);
                                }}
                            >
                                <Ionicons
                                    name="mic-outline"
                                    size={22}
                                    color="white"
                                />
                                <Text style={styles.popupText}>Audio</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Modal>
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
    },

    header: {
        paddingTop: Platform.OS === "ios" ? 60 : 30,
        paddingBottom: 15,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
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
        // bottom is now driven by Animated.Value
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },

    input: {
        flex: 1,
        color: "white",
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 16,
        fontFamily: fonts.Eregular,
        borderWidth: 1,
        borderColor: "#9ab17ad1",
        marginRight: 10,
        backgroundColor: "black",
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

    attachWrapper: {
        marginLeft: 10,
        alignItems: "center",
    },

    plusButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#9ab17a",
        justifyContent: "center",
        alignItems: "center",
    },

    optionsContainer: {
        position: "absolute",
        bottom: 55,
        alignItems: "center",
    },

    optionButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#1A1A1A",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },

    popupContainer: {
        backgroundColor: "#1A1A1A",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingVertical: 25,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },

    popupOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
    },

    popupText: {
        color: "white",
        marginLeft: 14,
        fontSize: 15,
        fontFamily: fonts.Eregular,
    },
});