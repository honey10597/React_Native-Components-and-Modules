1. Define Style

// style={styles.banner(scrollA, safeArea)

2. Define in Stylesheet

//  banner: (scrollA, safeArea) => ({
    height: bannerHeight,
    width: '200%',
    transform: [
      {
        translateY: scrollA.interpolate({
          inputRange: [-bannerHeight, 0, bannerHeight, bannerHeight + 1],
          outputRange: [
            -bannerHeight / 2,
            0,
            bannerHeight * 0.75,
            bannerHeight * 0.75,
          ],
        }),
      },
      {
        scale: scrollA.interpolate({
          inputRange: [-bannerHeight, 0, bannerHeight, bannerHeight + 1],
          outputRange: [2, 1, 0.5, 0.5],
        }),
      },
    ],
  }),
