import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView } from 'react-native';
import CommonButton from "./CommonButton";

const CommonModal = ({
                         visible,
                         onRequestClose,
                         onConfirm,
                         modalTitle,
                         modalBodyText,
                         children
                     }) => {
    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    {modalTitle && <Text style={styles.modalTitle}>{modalTitle}</Text>}
                    {modalBodyText && <Text style={styles.modalBodyText}>{modalBodyText}</Text>}
                    <ScrollView style={styles.scrollContainer}>
                        <View style={styles.childrenContainer}>
                            {children}
                        </View>
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                        {onRequestClose && (
                            <CommonButton
                                title="Cancelar"
                                onPress={onRequestClose}
                                style={styles.button}
                            />
                        )}
                        <CommonButton
                            title="Aceptar"
                            onPress={onConfirm}
                            style={styles.button}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '98%',
        maxHeight: '80%',
        paddingVertical: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    scrollContainer: {
        maxHeight: '90%',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalBodyText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    childrenContainer: {
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
});

export default CommonModal;
