/*
@author: Eduardo Burgos M <eburgos>

this module contains some components used to display video-js players
*/
import React, { Component } from 'react';
import { videojs } from './videojsInternal'
import '@videojs/http-streaming/dist/videojs-http-streaming.js'
import ads from 'videojs-contrib-ads'
import 'video.js/dist/video-js.css'

/*
This is the most basic version of a player
*/
export class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: props.width,
            height: props.height,
            poster: props.poster
        };
    }
    componentDidMount() {
        const props = this.props;
        this.player = videojs(this.playerNode, this.props.playerOptions || {}, function() {
            props.onSetSources.call(this, props.sources);
            props.onPlayerLoaded(this);
        });
    }
    componentDidUpdate() {
        this.props.onSetSources.call(this.player, this.props.sources);
    }
    render() {
        return <video
                ref={node => this.playerNode = node}
                className="video-js vjs-default-skin"
                controls
                width={this.state.width} 
                height={this.state.height}
                poster={this.state.poster}
                data-setup='{}'>
                <p className="vjs-no-js">
                To view this video please enable JavaScript, and consider upgrading to a web browser that
                    <a href="http://videojs.com/html5-video-support/" target="_blank" rel="noopener noreferrer">
                                supports HTML5 video
                    </a>
                </p>
            </video>;

    }
}

/* a videojs player capable of showing ads */
export class PlayerWithAds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sources: this.props.sources
        };
    }
    onSetSources(sources) {
        setTimeout(() => {
            this.player.src(sources);
            if (sources.length && sources[0].poster) {
                this.player.poster(sources[0].poster);
            }
            else {
                this.player.poster(null);
            }
        });
    }
    playAd() {
        const player = this.player;
        player.ads.startLinearAdMode();
        // play your linear ad content
        player.src(this.props.ads);
      
        return new Promise((resolve) => {
            // when all your linear ads have finished… do not confuse this with `ended`
            player.one('adended', function() {
                player.ads.endLinearAdMode();
                resolve();
            });
        });
    }
    stopAd() {
        const player = this.player;
        player.ads.endLinearAdMode();
    }
    onPlayerLoaded(player) {
      this.player = player;
      const self = this;
      ads.call(player);
      
      // request ads whenever there's new video content
      player.on('contentupdate', function(){
        // fetch ad inventory asynchronously, then ...
        player.trigger('adsready');
      });

      var timeoutHandler = 0;
      const clearHandler = function () {
          if (timeoutHandler) {
              clearTimeout(timeoutHandler);
          }
          timeoutHandler = 0;
      }
      const loopAds = function () {
        clearHandler();  
        timeoutHandler = setTimeout(function () {
            self.playAd().then(loopAds);
        }, self.props.adConfig.interval * 1000);
      }
      
      player.on('readyforpreroll', function() {
        var wait;  
        if (self.props.adConfig.playAtBeginning) {
            wait = self.playAd();
        }
        else {
            player.ads.skipLinearAdMode();
            wait = Promise.resolve();
        }
        if (self.props.adConfig.interval) {
            wait.then(loopAds);
        }
        player.on('play', loopAds);
        player.on('pause', clearHandler);
        player.on('stop', clearHandler);
        player.on('resume', loopAds);
      });
    }
    render() {
        const props = {
            ...this.props,
            onSetSources: this.props.onSetSources || this.onSetSources.bind(this),
            onSourcesChanged: this.props.onSourcesChanged || this.onSetSources.bind(this),
            onPlayerLoaded: this.onPlayerLoaded.bind(this)
        };
        return <Player {...props} ></Player>;
    }
}

/*
A component that wraps a player and allows to assign sources to it via file uploading
*/
export class WithVideoPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            poster: props.poster,
            sources: props.sources
        };
    }
    onInputChange(e) {
        const blobs = Array.prototype.map.call(this.inputNode.files, f => {
            return {
                src: window.URL.createObjectURL(f),
                type: f.type,
                poster: null
            };
        });
        this.props.onInputChanged(blobs);
        this.props.onSourcesChanged(blobs);
    }
    render() {
        const props = this.props;
        const Implementation = props.Player || Player;
        return <div>
            <Implementation ref={o => this.player = o} {...props} ></Implementation>
            <div className="withPadding">
                {props.children}
                <br /><br />
                <div>... or provide your own</div>
                <br />
                <input ref={node => this.inputNode = node} type="file" onChange={this.onInputChange.bind(this)} />
            </div>
        </div>;
    }
}

Player.defaultProps = {
    onSetSources: function (sources) {
        this.src(sources);
        if (sources.length && sources[0].poster) {
            this.poster(sources[0].poster);
        }
        else {
            this.poster(null);
        }
    },
    onPlayerLoaded: function () {},
};

WithVideoPicker.defaultProps = {
    onSourcesChanged: function () {}
};