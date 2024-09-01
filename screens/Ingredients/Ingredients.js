import React from 'react';
import { View, StyleSheet, ActivityIndicator , Text} from 'react-native';
import CommonButton from '../../components/CommonButton';
import CommonModal from '../../components/CommonModal';
import {useIngredients} from "./useIngredients";


const Ingredients = () => {
    const {
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
    } = useIngredients();

    return (
        <View style={styles.container}>
            <CommonButton title="Subir imagen" onPress={handleUploadPress} />
            <CommonButton title="Tomar imagen" onPress={handleCameraPress} />

            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}

            <CommonModal
                visible={modalVisible}
                onRequestClose={
                    showCancelButton
                        ? () => {
                            setModalVisible(false);
                        }
                        : null
                }
                onConfirm={handleOnConfirm}
                modalTitle={modalTitle}
                modalBodyText={modalBodyText}
            >
                {riskyIngredients && riskyIngredients.length > 0 && (
                    <View style={styles.ingredientListContainer}>
                        <Text style={styles.ingredientListTitle}>Ingredientes riesgosos detectados:</Text>
                        {riskyIngredients.map((ingredient, index) => (
                            <Text key={index} style={styles.ingredientItem}>
                                - {ingredient}
                            </Text>
                        ))}
                        <Text style={styles.text}>
                            Puntuación de riesgo
                        </Text>
                        <View style={{
                            marginTop: 20,
                            marginBottom: 20,
                            padding: 10,
                            borderRadius: 10,
                            backgroundColor: riskColor,
                        }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                }}
                            >
                                {normalizedRisk}
                            </Text>
                        </View>
                        <Text style={styles.text}>
                            {classificationMessage}
                        </Text>
                    </View>
                )}
            </CommonModal>
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
    },
    ingredientListContainer: {
        marginVertical: 20,
    },
    ingredientListTitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 5,
    },
    ingredientItem: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Ingredients;
