import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { compareProducts } from '../../services/api';
import CommonInput from "../../components/CommonInput";
import CommonButton from "../../components/CommonButton";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Products = () => {
    const [products, setProducts] = useState([{
        name: '',
        units_per_package: '',
        package_price: '',
        meters_per_unit: '',
        errors: {}
    }]);
    const [response, setResponse] = useState(null);

    const handleAddProduct = () => {
        setProducts([...products, {
            name: '',
            units_per_package: '',
            package_price: '',
            meters_per_unit: '',
            errors: {}
        }]);
    };

    const handleRemoveProduct = () => {
        if (products.length > 1) {
            setProducts(products.slice(0, -1));
        }
    };

    const handleInputChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        updatedProducts[index].errors[field] = '';
        setProducts(updatedProducts);
    };

    const validateInputs = () => {
        const updatedProducts = products.map(product => {
            const errors = {};
            if (!product.name) errors.name = 'El nombre es requerido';
            if (!product.units_per_package) errors.units_per_package = 'Las unidades por paquete son requeridas';
            if (!product.package_price) errors.package_price = 'El precio del paquete es requerido';
            if (!product.meters_per_unit) errors.meters_per_unit = 'La cantidad por unidad es requerida';
            return { ...product, errors };
        });

        setProducts(updatedProducts);

        return updatedProducts.every(product => Object.keys(product.errors).length === 0);
    };

    const handleSubmit = async () => {
        // Limpia los errores antes de la validación
        const clearedProducts = products.map(product => ({
            ...product,
            errors: {}
        }));
        setProducts(clearedProducts);

        // Validar entradas
        if (!validateInputs()) return;

        // Formatear productos para el envío
        const formattedProducts = products.map(product => ({
            name: product.name,
            package_price: parseFloat(product.package_price),
            units_per_package: parseInt(product.units_per_package, 10),
            meters_per_unit: parseFloat(product.meters_per_unit),
        }));

        console.log('formattedProducts:', formattedProducts);

        try {
            const response = await compareProducts(formattedProducts);
            console.log('response:', response);
            setResponse(response);
        } catch (error) {
            console.error('Error comparing products:', error);
        }
    };

    return (
        <KeyboardAwareScrollView style={styles.container} enableOnAndroid={true} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Products</Text>
            {products.map((product, index) => (
                <View key={index} style={styles.productContainer}>
                    <CommonInput
                        label="Nombre"
                        placeholder="Ingresa el nombre del producto"
                        value={product.name}
                        onChangeText={(text) => handleInputChange(index, 'name', text)}
                        required={true}
                        error={product.errors.name}
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <CommonInput
                        label="Unidades"
                        placeholder="Ingresa las unidades por paquete"
                        value={product.units_per_package}
                        keyboardType="numeric"
                        onChangeText={(text) => handleInputChange(index, 'units_per_package', text)}
                        required={true}
                        error={product.errors.units_per_package}
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <CommonInput
                        label="Precio"
                        placeholder="Ingresa el precio del paquete"
                        value={product.package_price}
                        keyboardType="numeric"
                        onChangeText={(text) => handleInputChange(index, 'package_price', text)}
                        required={true}
                        error={product.errors.package_price}
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <CommonInput
                        label="Cantidad por unidad"
                        placeholder="metros, gramos, mililitros, etc."
                        value={product.meters_per_unit}
                        keyboardType="numeric"
                        onChangeText={(text) => handleInputChange(index, 'meters_per_unit', text)}
                        required={true}
                        error={product.errors.meters_per_unit}
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
                </View>
            ))}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleAddProduct} style={styles.addButton}>
                    <Icon name="add" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRemoveProduct} style={styles.removeButton}>
                    <Icon name="remove" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 30 }}>
                <CommonButton
                    title="Comparar Productos"
                    onPress={handleSubmit}
                />
            </View>

            {response && (
                <View style={styles.responseContainer}>
                    <Text style={styles.responseTitle}>Cheapest Option</Text>
                    <Text>Cost per Meter: ${response.cheapest_option.cost_per_meter.toFixed(4)}</Text>
                    <Text>Products: {response.cheapest_option.products.join(', ')}</Text>
                    <Text>Total Cost: ${response.cheapest_option.total_cost.toFixed(2)}</Text>
                    <Text>Total Meters: {response.cheapest_option.total_meters}</Text>
                    {response.plot1 && (
                        <Image
                            source={{ uri: `data:image/png;base64,${response.plot1}` }}
                            style={styles.image}
                        />
                    )}

                    <Text style={styles.responseTitle}>Most Convenient Option</Text>
                    <Text>Cost per Meter: ${response.convenient_option.cost_per_meter.toFixed(4)}</Text>
                    <Text>Products: {response.convenient_option.products.join(', ')}</Text>
                    <Text>Total Cost: ${response.convenient_option.total_cost.toFixed(2)}</Text>
                    <Text>Total Meters: {response.convenient_option.total_meters}</Text>
                    {response.plot2 && (
                        <Image
                            source={{ uri: `data:image/png;base64,${response.plot2}` }}
                            style={styles.image}
                        />
                    )}

                    <Text style={styles.responseTitle}>Comparison of Selected Products</Text>
                    {response.plot3 && (
                        <Image
                            source={{ uri: `data:image/png;base64,${response.plot3}` }}
                            style={styles.image}
                        />
                    )}
                </View>
            )}
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    productContainer: {
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#007BFF',
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    removeButton: {
        backgroundColor: '#FF5252',
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    responseContainer: {
        marginTop: 16,
    },
    responseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 300,
        marginTop: 16,
    },
});

export default Products;
