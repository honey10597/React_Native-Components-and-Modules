 
<WebView
          originWhitelist={['*']}
          source={{ uri: `${urls.base}pay?order_id=${this.state.orderId}` }}
          style={{ marginTop: moderateScale(16) }}
          domStorageEnabled={true}
          automaticallyAdjustContentInsets={false}
          startInLoadingState
          // scalesPageToFit
          textZoom={100}
          showsVerticalScrollIndicator={false}
          javaScriptEnabled={true}
          decelerationRate="normal"
          onNavigationStateChange={webViewState =>
            this._onNavigationStateChange(webViewState)
          }
        />
