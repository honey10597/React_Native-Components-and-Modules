    const _onScroll = (e) => {

        let contentOffset = e?.nativeEvent?.contentOffset;
        let viewSize = e?.nativeEvent?.layoutMeasurement;

        let pageNum = Math.floor(contentOffset?.x / viewSize?.width);
        console.log('scrolled to page', pageNum);

        setCurrentIndex(pageNum)
    }
