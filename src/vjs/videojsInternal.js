/*
@author: Eduardo Burgos M <eburgos>

video-js wrapper. http-streaming plugin needs window.videojs so I needed to ensure it was in there before 
trying to load http-streaming plugin
*/
import * as videojs from 'video.js/dist/video.js'
window.videojs = window.videojs || videojs;

export { videojs }