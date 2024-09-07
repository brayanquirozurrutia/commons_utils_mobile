import {useState} from "react";
import {compareProducts} from "../../services/api";
import {Alert} from "react-native";


export const useProducts = () => {
    const [products, setProducts] = useState([{
        name: '',
        units_per_package: '',
        package_price: '',
        quantity_per_unit: '',
        errors: {}
    }]);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
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

        setLoading(true);

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
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        selectedUnit,
        response,
        unitOptions,
        loading,
        handleAddProduct,
        handleRemoveProduct,
        handleInputChange,
        handleSelectChange,
        getUnitLabel,
        handleSubmit,
    };
}
