import { WebApp } from 'meteor/webapp';

import { protectAvatars } from './auth';

import './browserVersion';

WebApp.connectHandlers.use('/avatar/', protectAvatars);
WebApp.connectHandlers.use('/avatar/uid/', protectAvatars);
