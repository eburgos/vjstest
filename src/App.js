import React, { Component } from 'react';
import { WithVideoPicker, PlayerWithAds } from './vjs/players'

//static files
import './App.css';
import hereweare from './videos/echo-hereweare.mp4';
import small from './videos/small.mp4';

class App extends Component {
  constructor(props) {
    super(props);
    this.playAdNow = this.playAdNow.bind(this);
    this.stopAdNow = this.stopAdNow.bind(this);
    this.state = {
      playAtBeginning: false,
      interval: 2,
      sources: [
        {
          src: "//vjs.zencdn.net/v/oceans.mp4",
          type: "video/mp4",
          poster: "//vjs.zencdn.net/v/oceans.png"
        }
      ],
      adSources: [
        {
          src: small,
          type: "video/mp4"
        }
      ],
      adPickerSources: [
        {
          src: small,
          type: "video/mp4"
        }
      ]
    };
  }
  changeSources(sources) {
    this.setState({ ...this.state, sources: sources });
  }
  onAdSourcesChanged(sources) {
    this.setState({ ...this.state, adSources: sources, adPickerSources: sources });
  }
  playAdNow() {
    return this.withAds.player.playAd();
  }
  stopAdNow() {
    return this.withAds.player.stopAd();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Video.js live streaming with ads sample. by <a href='https://github.com/eburgos'>eburgos</a></h1>
        </header>
        <p className="App-intro">
          TL;DR <b>IF your name is Claudio just click <i>Play</i>.</b> <br /><br />
          Video will play and every {this.state.interval} seconds an ad will show up. When the ad is shown the original video is paused.
        </p>
        <WithVideoPicker
          ref={node => this.withAds = node}
          Player={PlayerWithAds}
          width={720}
          height={300}
          ads={this.state.adSources}
          adConfig={{ playAtBeginning: this.state.playAtBeginning, interval: this.state.interval }}
          sources={this.state.sources}
          onInputChanged={(blobs) => {
            this.setState({ ...this.state, sources: blobs });
          }}>
          <div>
            <input type="checkbox" checked={this.state.playAtBeginning}
              onChange={(e) => this.setState({ ...this.state, playAtBeginning: e.target.checked })} /> <span>Play at the beginning</span><br />
            <input type="number" places="0" step="1" pattern="\d+" min={2} value={this.state.interval}
              onChange={(e) => this.setState({ ...this.state, interval: e.target.value })} /> <span>Interval (seconds)</span>
            <br />
            <button type="button" onClick={this.playAdNow}>Play Ad now!</button>
            <button type="button" onClick={this.stopAdNow}>Stop Ad now!</button>
            <br /><br />
          </div>
          <span>Choose a video source</span>
          <ul>
            <li className="videoLink" onClick={(e) => {
              this.changeSources([{
                src: "//vjs.zencdn.net/v/oceans.mp4",
                type: "video/mp4",
                poster: "//vjs.zencdn.net/v/oceans.png"
              }]);
            }}>Ocean (mp4, 45 seconds)</li>
          </ul>
          <ul>
            <li className="videoLink" onClick={(e) => {
              this.changeSources([{
                src: 'http://' + window.location.hostname + ":8000/streams/bipbopall.m3u8",
                type: "application/x-mpegURL"
              }]);
              e.stopPropagation();
            }}>Bip! (HTTP Live Streaming video, streams for about 150 seconds)</li>
          </ul>
        </WithVideoPicker>
        <p className="App-intro">
          Now choose your Ad.
        </p>
        <WithVideoPicker
          width={360}
          height={150}
          sources={this.state.adPickerSources}
          onSourcesChanged={this.onAdSourcesChanged.bind(this)}
          onInputChanged={(blobs) => {
            this.setState({ ...this.state, sources: blobs });
          }}>
          <span>Choose an Ad</span>
          <ul>
            <li className="videoLink" onClick={(e) => {
              this.onAdSourcesChanged([{ src: hereweare, type: "video/mp4" }]);
              e.stopPropagation();
            }}>Here we are (mp4, Some music, 45 seconds)</li>
            <li className="videoLink" onClick={(e) => {
              this.onAdSourcesChanged([{ src: small, type: "video/mp4" }]);
              e.stopPropagation();
            }}>Small (mp4, 5 seconds)</li>
          </ul>
        </WithVideoPicker>

      </div>
    );
  }
}

export default App;
