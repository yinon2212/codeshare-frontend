import { io } from 'socket.io-client';
import {URL} from './Globals/consts';
import socketIO from 'socket.io-client';

export const socket = socketIO.connect(URL);