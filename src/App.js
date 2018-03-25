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
      playAtBeginning: true,
      interval: 30,
      sources: [
        {
          src: 'http://' + window.location.hostname + ":8000/streams/bipbopall.m3u8",
          type: "application/x-mpegURL"
        }
      ],
      adSources: [
        { 
          src: "//vjs.zencdn.net/v/oceans.mp4", 
          type: "video/mp4",
          poster: "//vjs.zencdn.net/v/oceans.png"
        }
      ],
      adPickerSources: [
        { 
          src: "//vjs.zencdn.net/v/oceans.mp4", 
          type: "video/mp4",
          poster: "//vjs.zencdn.net/v/oceans.png"
        },
        { 
          src: "//vjs.zencdn.net/v/oceans.webm", 
          type: "video/webm",
          poster: "//vjs.zencdn.net/v/oceans.png"
        },
        { 
          src: "//vjs.zencdn.net/v/oceans.ogv", 
          type: "video/ogg",
          poster: "//vjs.zencdn.net/v/oceans.png"
        }
      ]
    };
  }
  changeSources(sources) {
    this.setState({...this.state, sources: sources});
  }
  onAdSourcesChanged(sources) {
    this.setState({...this.state, adSources: sources, adPickerSources: sources});
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
          Pick your video source (or choose one already there).
          If you choose a local source please enable local streamer <b>npm run streamer</b> in a separate terminal
        </p>
        <div className="withPadding">
          <input type="checkbox" checked={this.state.playAtBeginning} 
            onChange={(e) => this.setState({...this.state, playAtBeginning: e.target.checked})} /> <span>Play at the beginning</span><br/>
          <input type="number" places="0" step="1" pattern="\d+" min={5} value={this.state.interval}
            onChange={(e) => this.setState({...this.state, interval: e.target.value})} /> <span>Interval (seconds)</span>
          <br />
          <button type="button" onClick={this.playAdNow}>Play Ad now!</button>  
          <button type="button" onClick={this.stopAdNow}>Stop Ad now!</button>  
          <br/><br />  
        </div>
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
        <span>Choose a video source</span>
          <ul>
            <li className="videoLink" onClick={(e) => { 
              this.changeSources([{
                src: 'http://' + window.location.hostname + ":8000/streams/bipbopall.m3u8",
                type: "application/x-mpegURL"
              }]); 
              e.stopPropagation(); 
            }}>Bip!</li>
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
            }}>Here we are</li>
            <li className="videoLink" onClick={(e) => { 
              this.onAdSourcesChanged([{ src: "//vjs.zencdn.net/v/oceans.mp4", type: "video/mp4",  poster: "//vjs.zencdn.net/v/oceans.png" }]); 
              e.stopPropagation(); 
            }}>Ocean</li>
            <li className="videoLink" onClick={(e) => { 
              this.onAdSourcesChanged([{ src: small, type: "video/mp4" }]); 
              e.stopPropagation(); 
            }}>Small</li>
          </ul>
        </WithVideoPicker>
        
      </div>
    );
  }
}

export default App;
