import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent lo phần setup cần thiết để App chạy được cả trong Expo Go
// lẫn khi build native, đồng thời tự gọi AppRegistry.registerComponent('main', ...).
registerRootComponent(App);
