  const _onScroll = (e: any) => {
    let contentOffset = e?.nativeEvent?.contentOffset;
    let viewSize = e?.nativeEvent?.layoutMeasurement;
    let pageNum = Math.floor(contentOffset?.x / viewSize?.width);
    setState((prevState) => ({ ...prevState, activeIndex: pageNum }))
  }


 <ScrollView
        horizontal
        style={{
          marginTop: moderateScale(6),
          alignSelf: "center"
        }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {state?.data.map((item, index) => {
          return (
            <View style={styles.activeIndexView(index, state?.activeIndex)} />
          )
        })}
      </ScrollView>

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
