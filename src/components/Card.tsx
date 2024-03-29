import Animated, {
    clamp,
    Easing,
    withTiming,
    useSharedValue,
    useAnimatedReaction,
} from "react-native-reanimated";
import { useState } from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const Card = ({ card, index, scrollY, activeCardIndex }) => {
    const translateY = useSharedValue(0);

    const [cardHeight, setCardHeight] = useState(0);

    const { height: screenHeight } = useWindowDimensions();

    useAnimatedReaction(
        () => scrollY.value,
        (current) => {
            translateY.value = clamp(-current, -index * cardHeight, 0);
        }
    );

    useAnimatedReaction(
        () => activeCardIndex.value,
        (current, pervious) => {
            if (current === pervious) {
                return;
            }
            if (activeCardIndex.value === null) {
                // Nenhum cartão selecionado, vá para a visualização de lista
                translateY.value = withTiming(
                    clamp(-scrollY.value, -index * cardHeight, 0)
                );
            } else if (activeCardIndex.value === index) {
                // Este cartão fica ativo
                translateY.value = withTiming(-index * cardHeight, {
                    easing: Easing.out(Easing.quad),
                    duration: 500,
                });
            } else {
                // Outro cartão está ativo, vá para baixo
                translateY.value = withTiming(
                    -index * cardHeight * 0.9 + screenHeight * 0.7,
                    {
                        easing: Easing.out(Easing.quad),
                        duration: 500,
                    }
                );
            }
        }
    );

    const tap = Gesture.Tap().onEnd(() => {
        if (activeCardIndex.value === null) {
            activeCardIndex.value = index;
        } else {
            activeCardIndex.value = null;
        }
    });

    return (
        <GestureDetector gesture={tap}>
            <View style={styles.container}>
                <Animated.Image
                    source={card}
                    onLayout={(event) =>
                        setCardHeight(event.nativeEvent.layout.height + 10)
                    }
                    style={[styles.image, { transform: [{ translateY }] }]}
                />
            </View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 5,
        shadowRadius: 3.84,
        shadowOpacity: 0.25,
        shadowColor: "#B387DF",
    },
    image: {
        width: "100%",
        height: undefined,
        aspectRatio: 7 / 4,
        marginVertical: 5,
    },
});

export default Card;
