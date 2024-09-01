import React from 'react';
import { View, StyleSheet } from 'react-native';
import SquareButton from '../../components/SquareButton';

const Home = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <SquareButton title="Productos" onPress={() => navigation.navigate('Products')} />
            <SquareButton title="Ingredientes" onPress={() => navigation.navigate('Ingredients')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        flexDirection: 'row',
    },
});

export default Home;
