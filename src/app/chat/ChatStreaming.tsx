// ChatStreaming.tsx  (integrated version)

import React, { useEffect, useRef, useState, useCallback } from "react";
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
    ActivityIndicator,
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
import { Message, usePrivateChat, useRoomChat, useTypingIndicator } from "../../../api/socket/useChat";



const { width } = Dimensions.get("window");

type ChatType = "GROUP" | "INDIVIDUAL";

interface ChatStreamingProps {
    chatType: ChatType;
    chatId: string;
    currentUserId: string;
    toUserId?: string; // required for INDIVIDUAL chats
}

const ChatStreaming = ({ route }: { route: { params: ChatStreamingProps } }) => {
    const { chatType, chatId, currentUserId, toUserId = "" } = route.params;

    const isPrivate = chatType === "INDIVIDUAL";
    const [typingDots, setTypingDots] = useState(".");
    // ── Pick the right hook based on chat type ───────────────────────────────
    const roomChat = useRoomChat(chatId, currentUserId);
    const privateChat = usePrivateChat(currentUserId, toUserId);

    const { data: messages = [], isLoading, sendMessage } = isPrivate
        ? privateChat
        : roomChat;

    // ── Typing indicator (private only) ─────────────────────────────────────
    const { isTyping: remoteTyping, emitTyping } = useTypingIndicator(
        toUserId,
        currentUserId
    );

    // ── Local state ──────────────────────────────────────────────────────────
    const [input, setInput] = useState("");
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [showOptions, setShowOptions] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Keyboard animation ───────────────────────────────────────────────────
    const bottomAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        if (!remoteTyping) return;

        const interval = setInterval(() => {
            setTypingDots(prev => {
                if (prev === "...") return ".";
                return prev + ".";
            });
        }, 400);

        return () => clearInterval(interval);
    }, [remoteTyping]);

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
        return () => { showSub.remove(); hideSub.remove(); };
    }, []);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    }, [messages]);

    // ── Typing emit helper ───────────────────────────────────────────────────
    const handleInputChange = useCallback(
        (text: string) => {
            setInput(text);

            if (isPrivate) {
                emitTyping(true);
                if (typingTimer.current) clearTimeout(typingTimer.current);
                typingTimer.current = setTimeout(() => emitTyping(false), 1500);
            }
        },
        [isPrivate, emitTyping]
    );

    // ── File compression stub ────────────────────────────────────────────────
    const compressFile = async (uri: string) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) return uri;
            return uri; // replace with real compressor
        } catch {
            return uri;
        }
    };

    // ── Send helpers ─────────────────────────────────────────────────────────
    const sendText = () => {
        console.log("Sending text:", input);
        if (!input.trim()) return;
        sendMessage.mutate({ content: input, type: "TEXT" });
        setInput("");
        if (isPrivate) emitTyping(false);
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                quality: 0.4,
            });
            if (!result.canceled) {
                const uri = await compressFile(result.assets[0].uri);
                sendMessage.mutate({ content: uri, type: "IMAGE" });
            }
        } catch (err) { console.log(err); }
    };

    const pickVideo = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["videos"],
                quality: 0.4,
            });
            if (!result.canceled) {
                const uri = await compressFile(result.assets[0].uri);
                const thumbnail = await VideoThumbnails.getThumbnailAsync(uri, { time: 1000 });
                sendMessage.mutate({ content: uri, type: "VIDEO", thumbnail: thumbnail.uri });
            }
        } catch (err) { console.log(err); }
    };

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
            if (!result.canceled) {
                const file = result.assets[0];
                const uri = await compressFile(file.uri);
                sendMessage.mutate({ content: uri, type: "FILE", fileName: file.name });
            }
        } catch (err) { console.log(err); }
    };

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (!permission.granted) return;
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
        } catch (err) { console.log(err); }
    };

    const stopRecording = async () => {
        try {
            if (!recording) return;
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            if (!uri) return;
            const compressedUri = await compressFile(uri);
            sendMessage.mutate({ content: compressedUri, type: "AUDIO" });
            setRecording(null);
        } catch (err) { console.log(err); }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    const renderMessage = ({ item }: { item: Message }) => {
        const isMine = item.senderId === currentUserId;
        // const isOptimistic = item.id.startsWith("optimistic-");

        return (
            <View
                style={[
                    styles.messageContainer,
                    isMine ? styles.myMessage : styles.otherMessage,
                    // isOptimistic && { opacity: 0.6 },
                ]}
            >
                {item.type === "TEXT" && (
                    <Text style={styles.messageText}>{item.content}</Text>
                )}
                {item.type === "IMAGE" && (
                    <Image source={{ uri: item.content }} style={styles.image} resizeMode="cover" />
                )}
                {item.type === "VIDEO" && (
                    <View>
                        {item.thumbnail && (
                            <Image source={{ uri: item.thumbnail }} style={styles.image} />
                        )}
                        <Text style={styles.fileText}>Video Attached</Text>
                    </View>
                )}
                {item.type === "AUDIO" && <Text style={styles.fileText}>🎤 Audio Message</Text>}
                {item.type === "FILE" && (
                    <Text style={styles.fileText}>📄 {item.fileName || "File"}</Text>
                )}
                <Text style={styles.timeText}>
                    {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
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
                        {chatType === "GROUP" ? "Group Chat" : "Individual Chat"}
                    </Text>
                </View>

                {/* Loading state */}
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color="#9ab17a" />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={
                            remoteTyping ? (
                                <View style={styles.typingContainer}>
                                    <Text style={styles.typingText}>
                                        typing{typingDots}
                                    </Text>
                                </View>
                            ) : null
                        }
                    />
                )}

                {/* Input */}
                <Animated.View style={[styles.bottomContainer, { bottom: bottomAnim }]}>
                    <TextInput
                        placeholder="Message..."
                        value={input}
                        onChangeText={handleInputChange}
                        style={styles.input}
                        multiline
                        placeholderTextColor="#9ab17ad1"
                    />

                    <TouchableOpacity
                        style={styles.plusButton}
                        onPress={() => setShowOptions(true)}
                    >
                        <Ionicons name="add" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={sendText}
                        style={[
                            styles.sendBtn,
                            sendMessage.isPending && { opacity: 0.5 },
                        ]}
                        disabled={sendMessage.isPending}
                    >
                        <Ionicons name="send" size={24} color="black" style={{ right: -2 }} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Attachment modal */}
                <Modal visible={showOptions} transparent animationType="fade">
                    <Pressable style={styles.modalOverlay} onPress={() => setShowOptions(false)}>
                        <View style={styles.popupContainer}>
                            <TouchableOpacity
                                style={styles.popupOption}
                                onPress={() => { setShowOptions(false); pickImage(); }}
                            >
                                <Ionicons name="image-outline" size={22} color="white" />
                                <Text style={styles.popupText}>Image</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.popupOption}
                                onPress={() => { setShowOptions(false); pickVideo(); }}
                            >
                                <Ionicons name="videocam-outline" size={22} color="white" />
                                <Text style={styles.popupText}>Video</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.popupOption}
                                onPress={() => { setShowOptions(false); pickFile(); }}
                            >
                                <Ionicons name="document-outline" size={22} color="white" />
                                <Text style={styles.popupText}>File</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.popupOption}
                                onPressIn={startRecording}
                                onPressOut={() => { stopRecording(); setShowOptions(false); }}
                            >
                                <Ionicons name="mic-outline" size={22} color="white" />
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

// ── Styles (unchanged from original) ─────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1 },
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
    list: { paddingTop: 15, paddingBottom: 100 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    // typingText: {
    //     color: "rgba(255,255,255,0.4)",
    //     fontSize: 12,
    //     fontStyle: "italic",
    //     paddingHorizontal: 16,
    //     paddingBottom: 8,
    //     fontFamily: fonts.Eregular,
    // },
    messageContainer: {
        maxWidth: "80%",
        marginBottom: 12,
        padding: 12,
        borderRadius: 15,
    },
    myMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#9ab17a7b",
        borderWidth: 1,
        borderColor: "#9ab17ad1",
    },
    otherMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#1A1A1A",
        padding: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    messageText: { color: "white", fontSize: 15, fontFamily: fonts.Eregular },
    image: { width: width * 0.55, height: 220, borderRadius: 12 },
    fileText: { color: "white", marginTop: 8, fontFamily: fonts.Ebold },
    bottomContainer: {
        position: "absolute",
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
    plusButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#9ab17a",
        justifyContent: "center",
        alignItems: "center",
    },
    timeText: {
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: 8,
        fontFamily: fonts.Eregular,
        marginTop: 12,
        alignSelf: "flex-end",
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
    popupOption: { flexDirection: "row", alignItems: "center", paddingVertical: 16 },
    popupText: {
        color: "white",
        marginLeft: 14,
        fontSize: 15,
        fontFamily: fonts.Eregular,
    },
    typingContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },

    typingText: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 13,
        fontStyle: "italic",
        fontFamily: fonts.Eregular,
    },
});