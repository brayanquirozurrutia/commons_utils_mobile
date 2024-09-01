import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Image, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { compareProducts } from '../../services/api';

const Products = () => {
    const [products, setProducts] = useState([{ name: '', brand: '', units_per_package: '', package_price: '', meters_per_unit: '' }]);
    const [response, setResponse] = useState(null);

    const handleAddProduct = () => {
        setProducts([...products, { name: '', brand: '', units_per_package: '', package_price: '', meters_per_unit: '' }]);
    };

    const handleInputChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);
    };

    const handleSubmit = async () => {
        // Convert number fields to integers
        const formattedProducts = products.map(product => ({
            ...product,
            units_per_package: parseInt(product.units_per_package, 10),
            package_price: parseFloat(product.package_price),
            meters_per_unit: parseFloat(product.meters_per_unit),
        }));

        try {
            const response = await compareProducts(formattedProducts);
            setResponse(response);
        } catch (error) {
            console.error('Error comparing products:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Products</Text>
            {products.map((product, index) => (
                <View key={index} style={styles.productContainer}>
                    <Input
                        placeholder="Name"
                        value={product.name}
                        onChangeText={(text) => handleInputChange(index, 'name', text)}
                    />
                    <Input
                        placeholder="Brand"
                        value={product.brand}
                        onChangeText={(text) => handleInputChange(index, 'brand', text)}
                    />
                    <Input
                        placeholder="Units per Package"
                        keyboardType="numeric"
                        value={product.units_per_package}
                        onChangeText={(text) => handleInputChange(index, 'units_per_package', text)}
                    />
                    <Input
                        placeholder="Package Price"
                        keyboardType="numeric"
                        value={product.package_price}
                        onChangeText={(text) => handleInputChange(index, 'package_price', text)}
                    />
                    <Input
                        placeholder="Meters per Unit"
                        keyboardType="numeric"
                        value={product.meters_per_unit}
                        onChangeText={(text) => handleInputChange(index, 'meters_per_unit', text)}
                    />
                </View>
            ))}
            <View style={{ marginBottom: 30 }}>
                <Button title="Add Product" onPress={handleAddProduct} />
                <Button title="Submit" onPress={handleSubmit} />
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
        </ScrollView>
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
