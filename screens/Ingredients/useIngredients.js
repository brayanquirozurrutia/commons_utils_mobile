import {useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {uploadImage} from "../../services/api";
import {Alert, Linking} from "react-native";

export const useIngredients = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [showCancelButton, setShowCancelButton] = useState(false);
    const [showSettingsButton, setShowSettingsButton] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBodyText, setModalBodyText] = useState('');
    const [normalizedRisk, setNormalizedRisk] = useState(0);
    const [riskyIngredients, setRiskyIngredients] = useState([]);
    const [classificationMessage, setClassificationMessage] = useState('');
    const [riskColor, setRiskColor] = useState('');

    const [permissions, setPermissions] = useState({
        mediaLibrary: { status: 'unknown', granted: false },
        camera: { status: 'unknown', granted: false },
    });

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
            setModalTitle('Permiso denegado');
            setModalBodyText(
                `Es necesario el acceso a ${
                    type === 'mediaLibrary' ? 'tus imágenes' : 'la cámara'
                } para continuar.`
            );
            setShowCancelButton(true);
            setModalVisible(true);
            setShowSettingsButton(true);
        } else if (permission.status === 'granted') {
            type === 'mediaLibrary' ? await handleImageSelection(
                'library'
            ) : await handleImageSelection('camera');
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

            setModalTitle('');
            setModalBodyText('');

            if (uri) {
                setLoading(true);

                try {
                    const response = await uploadImage(uri);

                    if (response){
                        const normalizedRiskValue = response.normalized_risk;
                        const classification = response.classification;

                        setNormalizedRisk(normalizedRiskValue);
                        setRiskyIngredients(response.risky_ingredients);
                        setClassificationMessage(response.classification_message);

                        if (normalizedRiskValue <= 20) {
                            setRiskColor('green');
                        } else if (normalizedRiskValue <= 40) {
                            setRiskColor('lightgreen');
                        } else if (normalizedRiskValue <= 60) {
                            setRiskColor('yellow');
                        } else if (normalizedRiskValue <= 80) {
                            setRiskColor('orange');
                        } else {
                            setRiskColor('red');
                        }

                        setModalTitle(`Alimento de ${classification}`);

                    } else {
                        setModalTitle('Sin ingredientes');
                        setModalBodyText('No se han detectado ingredientes en la imagen');
                    }
                } catch (error) {
                    setModalTitle('Error');
                    setModalBodyText('Ocurrió un error al subir la imagen.');
                } finally {
                    setLoading(false);
                    setModalVisible(true);
                }
            } else {
                Alert.alert('Error', 'No se ha podido obtener la imagen');
            }
        }
    };

    const handleUploadPress = () => {
        if (permissions.mediaLibrary.granted) {
            handleImageSelection('library').then(r => r);
        } else {
            requestPermission('mediaLibrary').then(r => r);
        }
    };

    const handleCameraPress = () => {
        if (permissions.camera.granted) {
            handleImageSelection('camera').then(r => r);
        } else {
            requestPermission('camera').then(r => r);
        }
    };

    const openSettings = () => {
        Linking.openSettings().then(r => r);
    };

    const handleOnConfirm = () => {
        if (showSettingsButton) {
            openSettings()
        } else {
            setModalVisible(false);
        }
    }

    return {
        modalVisible,
        setModalVisible,
        showCancelButton,
        loading,
        modalTitle,
        modalBodyText,
        handleUploadPress,
        handleCameraPress,
        handleOnConfirm,
        normalizedRisk,
        riskColor,
        riskyIngredients,
        classificationMessage,
    };
}
