import { useEffect, useRef } from 'react';
import { BackHandler, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useKeepAwake } from 'expo-keep-awake';

const screenDimensions = Dimensions.get('screen');

export default function App() {
  useKeepAwake();
  
  const webViewRef = useRef(null);
  const scale = screenDimensions.scale || 1;
  const INJECTED_JAVASCRIPT = `
    (function() {
      const meta = document.createElement('meta');
      meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=${ 1 / scale}, user-scalable=no');
      meta.setAttribute('name', 'viewport');
      document.getElementsByTagName('head')[0].appendChild(meta);
    })();
  `;

  const injectableGoBackButton = () => {
    return `
      (function() {
        window.postMessage('goBack');
      })();
    `;
  };

  const handleBackButtonPress = () => {
    try {
      if(webViewRef && webViewRef?.current)
      webViewRef.current.injectJavaScript(injectableGoBackButton());
      return true;
    }
    catch(err) { }
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonPress);
    return () => BackHandler.removeEventListener("hardwareBackPress", handleBackButtonPress);
  }, []);

  return (
    <WebView
      ref={ webViewRef }
      source={{ uri: 'http://192.168.1.138:3041/' }}
      injectedJavaScript={ INJECTED_JAVASCRIPT }
      setBuiltInZoomControls={ false }
      javaScriptEnabled={ true }
      scrollEnabled={ false }
      style={{ width: screenDimensions.width, height: screenDimensions.height }}
    />
  );
}