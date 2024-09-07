import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Menu, Button, Text, Divider } from 'react-native-paper';
import {colors} from '../styles/colors';

const CommonSelect = ({
                          options = [],
                          value,
                          onSelect,
                          error = null,
                          required = false,
                      }) => {
    const [visible, setVisible] = React.useState(false);
    const [buttonLayout, setButtonLayout] = React.useState(null);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleSelect = (option) => {
        onSelect(option);
        closeMenu();
    };

    return (
        <View style={styles.container}>
            <View
                onLayout={(event) => setButtonLayout(event.nativeEvent.layout)}
            >
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <Button
                            onPress={openMenu}
                            style={styles.button}
                        >
                            {value ? value : 'Tipo de unidad' + (required ? '*' : '')}
                        </Button>
                    }
                    contentStyle={[styles.menu, { width: buttonLayout?.width }]}
                >
                    <ScrollView style={styles.scrollView}>
                        {options.map((option, index) => (
                            <View key={index}>
                                <Menu.Item
                                    onPress={() => handleSelect(option)}
                                    title={option.label}
                                />
                                {index < options.length - 1 && <Divider />}
                            </View>
                        ))}
                    </ScrollView>
                </Menu>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    button: {
        justifyContent: 'flex-start',
        textAlign: 'left',
        borderRadius: 5,
        paddingVertical: 3,
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: colors.blue,
        color: '#000',
    },
    menu: {
        maxHeight: 250,
    },
    scrollView: {
        maxHeight: 200,
    },
    errorText: {
        color: '#FF5252',
        marginTop: 5,
        fontSize: 12,
    },
});

export default CommonSelect;
