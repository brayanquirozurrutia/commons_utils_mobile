import React, { useState, useEffect } from 'react';
import {View, StyleSheet, Alert, Linking, ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CommonButton from '../components/CommonButton';
import CommonModal from '../components/CommonModal';
import { uploadImage } from '../services/api';

const Ingredients = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [responseModalVisible, setResponseModalVisible] = useState(false);
    const [permissions, setPermissions] = useState({
        mediaLibrary: { status: 'unknown', granted: false },
        camera: { status: 'unknown', granted: false },
    });
    const [imageUri, setImageUri] = useState(null);
    const [ingredients, setIngredients] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkPermissions().then(r => r);
    }, []);

    const checkPermissions = async () => {
        const mediaLibraryPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
        const cameraPermission = await ImagePicker.getCameraPermissionsAsync();

        setPermissions({
            mediaLibrary: {
                status: mediaLibraryPermission.status,
                granted: mediaLibraryPermission.status === 'granted',
            },
            camera: {
                status: cameraPermission.status,
                granted: cameraPermission.status === 'granted',
            },
        });
    };

    const requestPermission = async (type) => {
        let permission;
        if (type === 'mediaLibrary') {
            permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        } else if (type === 'camera') {
            permission = await ImagePicker.requestCameraPermissionsAsync();
        }

        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [type]: {
                status: permission.status,
                granted: permission.status === 'granted',
            },
        }));

        if (permission.status === 'denied') {
            Alert.alert(
                'Permiso denegado',
                `Es necesario el acceso a ${type === 'mediaLibrary' ? 'tus imágenes' : 'la cámara'} para continuar. Puedes habilitar los permisos en la configuración de la aplicación.`,
                [{ text: 'Abrir ajustes', onPress: openSettings }]
            );
        } else if (permission.status === 'granted') {
            type === 'mediaLibrary' ? await handleImageSelection('library') : await handleImageSelection('camera');
        }
    };

    const handleImageSelection = async (source) => {
        const result = source === 'camera'
            ? await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            })
            : await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            if (uri) {
                setLoading(true);
                try {
                    const response = await uploadImage(uri);
                    if (response.ingredients && response.ingredients.length > 0) {
                        setIngredients(response.ingredients);
                        setResponseModalVisible(true);
                    } else {
                        Alert.alert('Error', 'No se ha podido subir la imagen');
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                Alert.alert('Error', 'No se ha podido obtener la imagen');
            }
        }
    };

    const handleUploadPress = () => {
        permissions.mediaLibrary.granted
            ? handleImageSelection('library')
            : setModalVisible(true);
    };

    const handleCameraPress = () => {
        permissions.camera.granted
            ? handleImageSelection('camera')
            : setModalVisible(true);
    };

    const openSettings = () => {
        Linking.openSettings().then(r => r);
    };

    return (
        <View style={styles.container}>
            <CommonButton title="Subir imagen" onPress={handleUploadPress} />
            <CommonButton title="Tomar imagen" onPress={handleCameraPress} />

            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}

            <CommonModal
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                onConfirm={async () => {
                    setModalVisible(false);
                    await requestPermission('mediaLibrary');
                }}
                modalText={permissions.mediaLibrary.status === 'denied'
                    ? 'Permiso necesario. Si has retirado el permiso, puedes habilitarlo en la configuración de la aplicación.'
                    : 'Se necesita acceso a tus imágenes'}
            />
            <CommonModal
                visible={responseModalVisible}
                onRequestClose={() => setResponseModalVisible(false)}
                modalText={ingredients}
                onConfirm={() => setResponseModalVisible(false)}
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
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    }
});

export default Ingredients;
