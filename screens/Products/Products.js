import React, { useState } from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Keyboard, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { compareProducts } from '../../services/api';
import CommonInput from "../../components/CommonInput";
import CommonButton from "../../components/CommonButton";
import CommonSelect from "../../components/CommonSelect";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Products = () => {
    const [products, setProducts] = useState([{
        name: '',
        units_per_package: '',
        package_price: '',
        quantity_per_unit: '',
        errors: {}
    }]);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [response, setResponse] = useState(null);
    const unitOptions = [
        { label: 'Metros', value: 'mt' },
        { label: 'Centímetros', value: 'cm' },
        { label: 'Kilogramos', value: 'kg' },
        { label: 'Gramos', value: 'g' },
        { label: 'Mililitros', value: 'ml' },
        { label: 'Litros', value: 'l' },
    ];

    const handleAddProduct = () => {
        setProducts([...products, {
            name: '',
            units_per_package: '',
            package_price: '',
            quantity_per_unit: '',
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

    const handleSelectChange = (option) => {
        setSelectedUnit(option.value);
    };

    const validateInputs = () => {
        const updatedProducts = products.map(product => {
            const errors = {};
            if (!product.name) errors.name = 'El nombre es requerido';
            if (!product.units_per_package) errors.units_per_package = 'Las unidades por paquete son requeridas';
            if (!product.package_price) errors.package_price = 'El precio del paquete es requerido';
            if (!product.quantity_per_unit) errors.quantity_per_unit = 'La cantidad por unidad es requerida';
            return { ...product, errors };
        });

        setProducts(updatedProducts);

        return updatedProducts.every(product => Object.keys(product.errors).length === 0);
    };

    const getUnitLabel = (value) => {
        const selectedOption = unitOptions.find(option => option.value === value);
        return selectedOption ? selectedOption.label : value;
    };

    const handleSubmit = async () => {
        const clearedProducts = products.map(product => ({
            ...product,
            errors: {}
        }));
        setProducts(clearedProducts);

        if (!validateInputs()) return;

        const formattedProducts = products.map(product => ({
            name: product.name,
            package_price: parseFloat(product.package_price),
            units_per_package: parseInt(product.units_per_package, 10),
            quantity_per_unit: parseFloat(product.quantity_per_unit),
        }));

        const payload = {
            products: formattedProducts,
            unit_type: selectedUnit,
        };

        try {
            const response = await compareProducts(payload);
            setResponse(response);
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al comparar los productos');
        }
    };

    return (
        <KeyboardAwareScrollView style={styles.container} enableOnAndroid={true} keyboardShouldPersistTaps="handled">
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
                        placeholder="Ingresa la cantidad por unidad"
                        value={product.quantity_per_unit}
                        keyboardType="numeric"
                        onChangeText={(text) => handleInputChange(index, 'quantity_per_unit', text)}
                        required={true}
                        error={product.errors.quantity_per_unit}
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
                </View>
            ))}
            <CommonSelect
                options={unitOptions}
                value={selectedUnit}
                onSelect={handleSelectChange}
                error={null}
            />
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
                    {response.plot1 && (
                        <>
                            <Text style={styles.responseTitle}>Opción más barata</Text>
                            <Text>
                                Costo por {getUnitLabel(selectedUnit)}: ${response.cheapest_option.cost_per_unit.toFixed(4)}
                            </Text>
                            <Text>Producto: {response.cheapest_option.products.join(', ')}</Text>
                            <Text>Costo total: ${response.cheapest_option.total_cost.toFixed(2)}</Text>
                            <Text>{getUnitLabel(selectedUnit)} totales: {response.cheapest_option.total_units}</Text>
                            <Image
                                source={{ uri: `data:image/png;base64,${response.plot1}` }}
                                style={styles.image}
                                resizeMode={'contain'}
                            />
                        </>
                    )}
                    {response.plot2 && (
                        <>
                            <Text style={styles.responseTitle}>Opción más conveniente</Text>
                            <Text>
                                Costo por {getUnitLabel(selectedUnit)}: ${response.convenient_option.cost_per_unit.toFixed(4)}
                            </Text>
                            <Text>Producto: {response.convenient_option.products.join(', ')}</Text>
                            <Text>Costo total: ${response.convenient_option.total_cost.toFixed(2)}</Text>
                            <Text>{getUnitLabel(selectedUnit)} totales: {response.convenient_option.total_units}</Text>
                            <Image
                                source={{ uri: `data:image/png;base64,${response.plot2}` }}
                                style={styles.image}
                                resizeMode={'contain'}
                            />
                        </>
                    )}
                    {response.plot3 && (
                        <>
                            <Text style={styles.responseTitle}>Comparación de opciones</Text>
                            <Image
                                source={{ uri: `data:image/png;base64,${response.plot3}` }}
                                style={styles.image}
                                resizeMode={'contain'}
                            />
                        </>
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
        width: '100%',
    },
    responseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: 300,
        marginTop: 16,
        resizeMode: 'contain',
    },
});

export default Products;
