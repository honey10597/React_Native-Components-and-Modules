import { width } from '@constants/responsiveSize';
import { showSuccess } from '@utils/helperFunctions';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, } from 'react-native';
import Animated, { useAnimatedStyle, Easing, useSharedValue, withTiming } from 'react-native-reanimated';

interface ZZZProps { }

const WIDTH = width / 5
const DURATION = 3000

const BarComp = ({ barStyle }: any) => {
    return (
        <View style={{ width: WIDTH }}>
            <View style={styles.fixCont} />
            <Animated.View style={[styles.container, barStyle]} />
        </View>
    );
};

const ZZZ = ({ }) => {

    const barWidths = [
        useSharedValue(0),
        useSharedValue(0),
        useSharedValue(0),
        useSharedValue(0),
    ];

    const timeRef = useRef<any>(null)
    const [count, setCount] = useState(1)

    useEffect(() => {
        if (count === barWidths.length + 1) {
            showSuccess("complete")
            return;
        } else {
            barWidths[count - 1].value = withTiming(WIDTH, {
                duration: DURATION,
                easing: Easing.linear,
            });
            timeRef.current = setTimeout(() => {
                setCount(count + 1)
                showSuccess("Hreek complete")
            }, DURATION + 100);
        }
        return () => {
            clearInterval(timeRef.current)
        }
    }, [count]);


    return (
        <View style={styles.wrapper}>
            <View style={styles.main}>
                {barWidths.map((barWidth, index) => {
                    const barStyle = useAnimatedStyle(() => ({
                        width: barWidth.value,
                    }));

                    return (
                        <BarComp
                            key={index}
                            barStyle={barStyle}
                        />
                    );
                })}
            </View>
        </View>
    );
};

export default ZZZ;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        margin: 20,
    },
    main: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    container: {
        height: 8,
        width: 0,
        backgroundColor: 'black',
        borderRadius: 4,
    },
    fixCont: {
        height: 8,
        width: WIDTH,
        backgroundColor: 'grey',
        borderRadius: 4,
        position: 'absolute',
    },
});
