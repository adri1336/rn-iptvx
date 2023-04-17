import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const screenDimensions = Dimensions.get('screen');

export default function App() {
  const scale = screenDimensions.scale || 1;
  const INJECTED_JAVASCRIPT = `
    (function() {
      const meta = document.createElement('meta');
      meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=${ 1 / scale}, user-scalable=no');
      meta.setAttribute('name', 'viewport');
      document.getElementsByTagName('head')[0].appendChild(meta);
    })();
  `;

  return (
    <WebView
      source={{ uri: 'http://app.iptvx-app.com/' }}
      injectedJavaScript={ INJECTED_JAVASCRIPT }
      setBuiltInZoomControls={ false }
      javaScriptEnabled={ true }
      scrollEnabled={ false }
      style={{ width: screenDimensions.width, height: screenDimensions.height }}
    />
  );
}