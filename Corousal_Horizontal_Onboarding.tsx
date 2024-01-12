  const _onScroll = (e: any) => {
    let contentOffset = e?.nativeEvent?.contentOffset;
    let viewSize = e?.nativeEvent?.layoutMeasurement;
    let pageNum = Math.floor(contentOffset?.x / viewSize?.width);
    setState((prevState) => ({ ...prevState, activeIndex: pageNum }))
  }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

<View style={{ height: "85%" }}>
        <FlatList
          bounces={false}
          ref={flatListRef}
          data={state?.data}
          pagingEnabled={true}
          horizontal
          keyExtractor={(item: any, index: number) => String(item + index)}
          onScroll={_onScroll}
          showsHorizontalScrollIndicator={false}
          renderItem={_renderOnboarding}
        />
        <ScrollView
          horizontal
          style={styles.scrollStyle}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {state?.data.map((item, index) => {
            return (
              <View style={styles.activeIndexView(index, state?.activeIndex)} />
            )
          })}
        </ScrollView>
      </View>

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create<any>({
  activeIndexView: (currentIndex: number, activeIndex: number) => ({
    marginTop: moderateScale(20),
    height: moderateScale(10),
    width: currentIndex === activeIndex ? moderateScale(50) : moderateScale(10),
    borderRadius: moderateScale(5),
    marginStart: moderateScale(5),
    backgroundColor:
      currentIndex === activeIndex ?
        colors.themeBlue :
        colors.grey_217_1
  })
})
