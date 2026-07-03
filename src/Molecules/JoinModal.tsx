import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface Room {
  label: string;
  value: string;
}

interface Category {
  label: string;
  value: string;
}

interface Props {
  visible: boolean;
  username: string;
  categories: Category[];
  rooms: Room[];
  onClose: () => void;
  onJoin: (category: string, room: string) => void;
}

const JoinRoomModal = ({
  visible,
  username,
  categories,
  rooms,
  onClose,
  onJoin,
}: Props) => {
  const [category, setCategory] = useState("");
  const [room, setRoom] = useState("");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Join a Room</Text>

          <Text style={styles.label}>Username</Text>

          <View style={styles.readonlyBox}>
            <Text style={styles.readonlyText}>{username}</Text>
          </View>

          <Text style={styles.label}>Select Category</Text>

          <Dropdown
            style={styles.dropdown}
            data={categories}
            labelField="label"
            valueField="value"
            placeholder="Choose Category"
            value={category}
            onChange={(item: Category) => setCategory(item.value)}
            iconColor="#000"
            containerStyle={styles.dropdownContainer}
            itemTextStyle={{color:"#9AB17A"}}
          />

          <Text style={styles.label}>Select Room</Text>

          <Dropdown
            style={styles.dropdown}
            data={rooms}
            search
            searchPlaceholder="Search room..."
            labelField="label"
            valueField="value"
            placeholder="Choose Room"
            value={room}
            onChange={(item: Room) => setRoom(item.value)}
            iconColor="#000"
            containerStyle={styles.dropdownContainer}
            itemTextStyle={{color:"#9AB17A"}}
            inputSearchStyle={{borderWidth:0}}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
            >
              <Text style={[styles.btnText, { color: "#9AB17A" }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.joinBtn}
              onPress={() => onJoin(category, room)}
            >
              <Text style={styles.btnText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default JoinRoomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "90%",
    backgroundColor: "#3f4831",
    borderRadius: 18,
    padding: 20,
  },

  heading: {
    color: "#000",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  label: {
    color: "#000",
    marginBottom: 6,
    marginTop: 12,
    fontSize: 14,
  },

  readonlyBox: {
    backgroundColor: "transparent",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },

  readonlyText: {
    color: "#000",
    fontSize: 16,
  },

  dropdown: {
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingHorizontal: 12,  
    height: 52,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#000",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },

  joinBtn: {
    flex: 1,
    backgroundColor: "#9AB17A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
  },

  btnText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 15,
  },
  dropdownContainer: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#9AB17A",
    borderRadius:24,
    color:"#9AB17A"
  },
});