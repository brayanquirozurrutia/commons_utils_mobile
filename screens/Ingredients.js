import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CommonButton from '../components/CommonButton';
import CommonModal from '../components/CommonModal';
import { uploadImage } from '../services/api';

const Ingredients = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState('unknown');
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        checkPermission().then(r => r);
    }, []);

    const checkPermission = async () => {
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        setHasPermission(status === 'granted');
        setPermissionStatus(status);
    };

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasPermission(status === 'granted');
        setPermissionStatus(status);
        if (status === 'denied') {
            Alert.alert(
                'Permiso denegado',
                'Es necesario el acceso a tus imágenes para continuar. Puedes habilitar los permisos en la configuración de la aplicación.',
                [{ text: 'Abrir ajustes', onPress: openSettings }]
            );
        } else if (status === 'granted') {
            await pickImage();
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            if (uri) {
                try {
                    const response = await uploadImage(uri);
                    Alert.alert(response);
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
            } else {
                Alert.alert('Error', 'No se ha podido obtener la imagen');
            }
        }
    };

    const handleUploadPress = () => {
        if (hasPermission) {
            pickImage().then(r => r);
        } else {
            setModalVisible(true);
        }
    };

    const openSettings = () => {
        Linking.openSettings().then(r => r);
    };

    return (
        <View style={styles.container}>
            <CommonButton title="Subir imagen" onPress={handleUploadPress} />
            <CommonButton title="Tomar imagen" onPress={() => { /* Aquí puedes agregar la lógica para tomar una foto */ }} />

            <CommonModal
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                onConfirm={async () => {
                    setModalVisible(false);
                    await requestPermission();
                }}
                modalText={permissionStatus === 'denied'
                    ? 'Permiso necesario. Si has retirado el permiso, puedes habilitarlo en la configuración de la aplicación.'
                    : 'Se necesita acceso a tus imágenes'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
});

export default Ingredients;
