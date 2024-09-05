import { height, moderateScale, width } from '@constants/responsiveSize';
import { showSuccess } from '@utils/helperFunctions';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image, TouchableOpacity, } from 'react-native';
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

    const IMAGES = [
        "https://i.pinimg.com/1200x/b1/6d/e3/b16de3dc60a7ef4bd29f1858ea91aa2d.jpg",
        "https://i.pinimg.com/1200x/80/ae/f6/80aef6a1a7f3f022f844b7c2bdb8a318.jpg",
        "https://i.pinimg.com/1200x/ee/a2/98/eea298815692e7a575cf6d13731111e3.jpg",
        "https://i.pinimg.com/1200x/f5/e9/b7/f5e9b763fb7bfee0b405cade2c53101c.jpg"
    ]

    const [barWidths, setBarWidths] = useState([
        useSharedValue(0),
        useSharedValue(0),
        useSharedValue(0),
        useSharedValue(0),
    ]);
    const imageOpacity = useSharedValue(1);
    const imageScale = useSharedValue(1);

    const timeRef = useRef<any>(null)
    const [count, setCount] = useState(1)
    const [startAnimate, setStartAnimate] = useState(false)

    useEffect(() => {
        if (!startAnimate) return;
        if (count === barWidths.length + 1) {
            return _reset();
        } else {
            barWidths[count - 1].value = withTiming(WIDTH, {
                duration: DURATION,
                easing: Easing.linear,
            });
            timeRef.current = setTimeout(() => {
                setCount(count + 1);
                imageOpacity.value = 0.5; // Start fade-out
                // imageScale.value = 0.9; // Start shrink animation

                setTimeout(() => {
                    imageOpacity.value = withTiming(1, { duration: 500 }); // Fade-in
                    // imageScale.value = withTiming(1, { duration: 100 }); // Scale back
                }, 100);
            }, DURATION + 50);
        }
        return () => {
            clearInterval(timeRef.current);
        };
    }, [count, startAnimate]);

    const _onPressButton = () => {
        if (startAnimate) {
            _reset()
        } else {
            setStartAnimate(true)
        }
    }

    const _reset = () => {
        barWidths[0].value = 0
        barWidths[1].value = 0
        barWidths[2].value = 0
        barWidths[3].value = 0
        setStartAnimate(false)
        setCount(1)
    }

    const imageStyle = useAnimatedStyle(() => ({
        opacity: imageOpacity.value,
        transform: [{ scale: imageScale.value }],
    }));

    return (
        <View style={styles.wrapper}>
            <SafeAreaView />
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

            <View style={{
                height: height * 0.74,
                marginTop: 24,
            }}>
                <Animated.Image
                    source={{ uri: IMAGES[count - 1] }}
                    style={[{
                        height: "100%",
                        width: "100%",
                        borderRadius: 16,
                    }, imageStyle]}
                    resizeMode="cover"
                />
            </View>

            <TouchableOpacity
                onPress={_onPressButton}
                activeOpacity={0.8}
                style={{
                    marginTop: 16,
                    backgroundColor: "rgba(41, 35, 101, 1)",
                    justifyContent: 'center',
                    alignItems: "center",
                    paddingVertical: 14,
                    borderRadius: 8
                }}
            >
                <Text style={{
                    fontSize: 16,
                    color: "white"
                }}>{startAnimate ? "RE-SET" : "START"}</Text>
            </TouchableOpacity>

        </View>
    );
};

export default ZZZ;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        // justifyContent: 'center',
        margin: 20,
    },
    main: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    container: {
        height: 8,
        width: 0,
        backgroundColor: "rgba(41, 35, 101, 1)",
        borderRadius: 4,
    },
    fixCont: {
        height: 8,
        width: WIDTH,
        backgroundColor: 'rgba(41, 35, 101, 0.1)',
        borderRadius: 4,
        position: 'absolute',
    },
});
