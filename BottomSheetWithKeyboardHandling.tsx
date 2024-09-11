import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomButton from '@components/atoms/CustomButton';
import CommonTextInput from '@components/atoms/CommonTextInput';

const BottomSheetWithKeyboardHandling = () => {

    const bottomSheetRef = useRef<BottomSheet>(null);

    const [snapPoints, setSnapPoints] = useState(["30%", '80%']);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setSnapPoints(["80%", '80%']);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setSnapPoints(["30%", '30%']);
        });
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    return (
        <GestureHandlerRootView>
            <View style={styles.container}>

                <SafeAreaView />
                <CustomButton
                    btnText={"Open Sheet"}
                    onPress={() => bottomSheetRef.current?.expand()}
                />

                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    enablePanDownToClose
                    keyboardBehavior={"interactive"}
                    onClose={() => bottomSheetRef.current?.close()}
                >
                    <BottomSheetView style={styles.contentContainer}>
                        <CommonTextInput

                        />

                        <CustomButton
                            btnText={"Submit"}
                            btnMainViewStyle={{
                                marginTop: 24
                            }}
                            onPress={() => { }}
                        />

                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        margin: 16
    },
});

export default BottomSheetWithKeyboardHandling;
