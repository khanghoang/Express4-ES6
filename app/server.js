import App from './App';
import config from './config/config';

let app = App.sharedInstance();
app.config = config;
app.run();
