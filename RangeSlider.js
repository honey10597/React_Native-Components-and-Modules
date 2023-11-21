import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { PanGestureHandler } from "react-native-gesture-handler"
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';

const MultiRangeSlider = ({ sliderWidth, min, max, step, onValueChange }) => {

    const position = useSharedValue(0)
    const position2 = useSharedValue(sliderWidth)
    const zIndex = useSharedValue(1)
    const zIndex2 = useSharedValue(1)
    const opacity = useSharedValue(0)
    const opacity2 = useSharedValue(0)

    const _gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = position.value
        },
        onActive: (e, ctx) => {
            opacity.value = 1
            if (ctx.startX + e.translationX < 0) {
                position.value = 0
            } else if (ctx.startX + e.translationX > position2.value) {
                position.value = position2.value
            } else {
                position.value = ctx.startX + e.translationX
            }
            zIndex.value = 1
            zIndex2.value = 0
        },
        onEnd: (e, ctx) => {
            opacity.value = 0
            runOnJS(onValueChange)({
                min: `$${min +
                    Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step
                    }`,
                max: `$${min +
                    Math.floor(position2.value / (sliderWidth / ((max - min) / step))) *
                    step
                    }`,
            })
        },
    })

    const _gestureHandler2 = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = position2.value
        },
        onActive: (e, ctx) => {
            opacity2.value = 1
            if (ctx.startX + e.translationX > sliderWidth) {
                position2.value = sliderWidth
            } else if (ctx.startX + e.translationX < position.value) {
                position2.value = position.value
            } else {
                position2.value = ctx.startX + e.translationX
            }
            zIndex.value = 0
            zIndex2.value = 1
        },
        onEnd: (e, ctx) => {
            opacity2.value = 0;
            runOnJS(onValueChange)({
                min: `$${min +
                    Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step
                    }`,
                max: `$${min +
                    Math.floor(position2.value / (sliderWidth / ((max - min) / step))) *
                    step
                    }`,
            })
        },
    })

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
        zIndex: zIndex.value
    }))
    const animatedStyle2 = useAnimatedStyle(() => ({
        transform: [{ translateX: position2.value }],
        zIndex: zIndex2.value
    }))
    const opacityStyle1 = useAnimatedStyle(() => ({
        opacity: opacity.value
    }))
    const opacityStyle2 = useAnimatedStyle(() => ({
        opacity: opacity2.value
    }))
    const sliderFrontSide = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
        width: position2.value - position.value
    }))

    const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
    const minLabelText = useAnimatedProps(() => {
        return {
            text: `$${min +
                Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step
                }`,
        };
    });
    const maxLabelText = useAnimatedProps(() => {
        return {
            text: `$${min +
                Math.floor(position2.value / (sliderWidth / ((max - min) / step))) *
                step
                }`,
        };
    });

    return (
        <View style={[styles2.sliderContainer, { width: sliderWidth }]}>
            <View style={[styles2.sliderBack, { width: sliderWidth }]} />
            <Animated.View style={[styles2.sliderFront, sliderFrontSide]} />

            <PanGestureHandler onGestureEvent={_gestureHandler}>
                <Animated.View style={[styles2.thumb, animatedStyle]}>
                    <Animated.View style={[styles2.label, opacityStyle1]}>
                        <AnimatedTextInput
                            style={styles2.labelText}
                            animatedProps={minLabelText}
                            editable={false}
                            defaultValue={'0'}
                        />
                    </Animated.View>
                </Animated.View>
            </PanGestureHandler>

            <PanGestureHandler onGestureEvent={_gestureHandler2}>
                <Animated.View style={[styles2.thumb, animatedStyle2]}>
                    <Animated.View style={[styles2.label, opacityStyle2]}>
                        <AnimatedTextInput
                            style={styles2.labelText}
                            animatedProps={maxLabelText}
                            editable={false}
                            defaultValue={'0'}
                        />
                    </Animated.View>
                </Animated.View>
            </PanGestureHandler>
        </View>
    )
}

const styles2 = StyleSheet.create({
    sliderContainer: {
        justifyContent: 'center',
        alignSelf: "center"
    },
    sliderBack: {
        height: 8,
        backgroundColor: "#DFEAFB",
        borderRadius: 20,
        width: 300
    },
    sliderFront: {
        height: 8,
        backgroundColor: "#3F4CF6",
        borderRadius: 20,
        width: 300,
        position: "absolute"
    },
    thumb: {
        position: "absolute",
        left: -10,
        width: 20,
        height: 20,
        backgroundColor: "white",
        borderColor: "#3F4CF6",
        borderWidth: 5,
        borderRadius: 10
    },
    label: {
        position: "absolute",
        top: -40,
        bottom: 20,
        backgroundColor: "black",
        borderRadius: 5,
        alignSelf: "center",
        justifyContent: 'center',
        alignItems: "center"
    },
    labelText: {
        color: "white",
        padding: 5,
        fontWeight: "bold",
        width: "100%",
        fontSize: 16
    }
})

const SingleRangeSlider = ({ sliderWidth, min, max, step, onValueChange }) => {

    const position = useSharedValue(0)
    const zIndex = useSharedValue(1)
    const opacity = useSharedValue(0)

    const _gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = position.value
        },
        onActive: (e, ctx) => {
            opacity.value = 1
            if (ctx.startX + e.translationX < 0) {
                position.value = 0
            } else if (ctx.startX + e.translationX >= sliderWidth) {

            } else {
                position.value = ctx.startX + e.translationX
            }
            zIndex.value = 1
        },
        onEnd: (e, ctx) => {
            opacity.value = 0
            runOnJS(onValueChange)({
                min: `$${min +
                    Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step
                    }`,
            })
        },
    })

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
        zIndex: zIndex.value
    }))
    const opacityStyle1 = useAnimatedStyle(() => ({
        opacity: opacity.value
    }))
    const sliderFrontSide = useAnimatedStyle(() => ({
        // transform: [{ translateX: position.value }],
        width: position.value
    }))

    const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
    const minLabelText = useAnimatedProps(() => {
        return {
            text: `$${min +
                Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step
                }`,
        };
    });

    return (
        <View style={[styles2.sliderContainer, { width: sliderWidth }]}>

            <View style={[styles2.sliderBack, { width: sliderWidth }]} />
            <Animated.View style={[styles2.sliderFront, sliderFrontSide]} />



            <PanGestureHandler onGestureEvent={_gestureHandler}>
                <Animated.View style={[styles2.thumb, animatedStyle]}>
                    <Animated.View style={[styles2.label, opacityStyle1]}>
                        <AnimatedTextInput
                            style={styles2.labelText}
                            animatedProps={minLabelText}
                            editable={false}
                            defaultValue={'0'}
                        />
                    </Animated.View>
                </Animated.View>
            </PanGestureHandler>

        </View>
    )
}

const SliderComp = ({ }) => {
    const MIN_DEFAULT = 10;
    const MAX_DEFAULT = 500;
    const [minValue, setMinValue] = useState(MIN_DEFAULT);
    const [maxValue, setMaxValue] = useState(MAX_DEFAULT);
    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.content}>
                    <Text style={styles.text}>{"Price Slide"}</Text>
                    <MultiRangeSlider
                        sliderWidth={300}
                        min={18}
                        max={99}
                        step={1}
                        onValueChange={range => {
                            setMinValue(range.min);
                            setMaxValue(range.max);
                        }}
                    />
                    <SingleRangeSlider
                        sliderWidth={300}
                        min={18}
                        max={99}
                        step={1}
                        onValueChange={range => {
                            setMinValue(range.min);
                            setMaxValue(range.max);
                        }}
                    />
                    <View style={styles.tableContainer}>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.colorBlack}>{"Min Price"}</Text>
                            <View style={styles.table}>
                                <Text style={styles.colorBlack}>{minValue}</Text>
                            </View>
                        </View>

                        <View>
                            <Text style={styles.colorBlack}>{"Min Price"}</Text>
                            <View style={styles.table}>
                                <Text style={styles.colorBlack}>{maxValue}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default SliderComp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "#EBECF2"
    },
    contentContainer: {
        width: "90%",
        height: 300,
        backgroundColor: "white",
        borderRadius: 25
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 16
    },
    text: {
        color: "black",
        fontSize: 20
    },
    tableContainer: {
        flexDirection: "column",
        justifyContent: 'space-between',
    },
    table: {
        borderColor: "#EBECF2",
        borderWidth: 1,
        padding: 10,
        marginTop: 5,
        borderRadius: 5
    },
    colorBlack: {
        color: "black"
    }
})
