var SKIN_EVENTS = [
    OO.Pulse.AdPlayer.Events.LINEAR_AD_PAUSED,
    OO.Pulse.AdPlayer.Events.LINEAR_AD_PLAYING,
    OO.Pulse.AdPlayer.Events.AD_BREAK_STARTED,
    OO.Pulse.AdPlayer.Events.AD_BREAK_FINISHED,
    OO.Pulse.AdPlayer.Events.LINEAR_AD_STARTED,
    OO.Pulse.AdPlayer.Events.LINEAR_AD_FINISHED,
    OO.Pulse.AdPlayer.Events.SHOW_SKIP_BUTTON,
    OO.Pulse.AdPlayer.Events.LINEAR_AD_SKIPPED,
    OO.Pulse.AdPlayer.Events.LINEAR_AD_PROGRESS,
    OO.Pulse.AdPlayer.Events.AD_VOLUME_CHANGED
];

var onPlayerEvent = function(event, eventData) {
    switch (event) {
        case OO.Pulse.AdPlayer.Events.AD_BREAK_STARTED:
            this._adCounter.setAdBreak(eventData.adBreak);
            this._loadingSpinner.show();
            break;
        case OO.Pulse.AdPlayer.Events.AD_BREAK_FINISHED:
            this._adCounter.hide();
            this._loadingSpinner.hide();
            break;
        case OO.Pulse.AdPlayer.Events.LINEAR_AD_STARTED:
            this._adCounter.show();
            this._adCounter.update();
            this._loadingSpinner.hide();
            this._progressBar.show();
            this._adPlayer.resize(OO.Pulse.AdPlayer.Settings.SCALING.AUTO, OO.Pulse.AdPlayer.Settings.SCALING.AUTO, this._isFullscreen);
            setTimeout(function() {
                this._adPlayer.resize(OO.Pulse.AdPlayer.Settings.SCALING.AUTO, OO.Pulse.AdPlayer.Settings.SCALING.AUTO, this._isFullscreen);
            }.bind(this), 100);

            this._skipCountdown.setAd(eventData.ad);
            if(eventData.ad.isSkippable() && eventData.ad.getSkipOffset() === 0) {
                this._skipButton.show();
            }
            break;
        case OO.Pulse.AdPlayer.Events.LINEAR_AD_FINISHED:
        case OO.Pulse.AdPlayer.Events.LINEAR_AD_SKIPPED:
            this._loadingSpinner.show();
            this._skipButton.hide();
            this._skipCountdown.hide();
            this._progressBar.hide();
            break;
        case OO.Pulse.AdPlayer.Events.LINEAR_AD_PROGRESS:
            this._progressBar.setProgress(eventData.position / eventData.duration);
            this._skipCountdown.update(eventData.position);
            break;
        case OO.Pulse.AdPlayer.Events.LINEAR_AD_PAUSED:
            this._playButton.show();
            break;
        case OO.Pulse.AdPlayer.Events.LINEAR_AD_PLAYING:
            this._playButton.hide();
            break;
        case OO.Pulse.AdPlayer.Events.SHOW_SKIP_BUTTON:
            this._skipButton.show();
            break;
        case OO.Pulse.AdPlayer.Events.AD_VOLUME_CHANGED:
            break;
        default:
            break;
    }

}.bind(this);

var addPlayerEventListeners = function(adPlayer) {
    for (var i in SKIN_EVENTS) {
        adPlayer.addEventListener(SKIN_EVENTS[i], onPlayerEvent);
    }
};

var addFullScreenListeners = function() {
    document.addEventListener("webkitfullscreenchange", function() {
        this._isFullscreen = document.webkitIsFullScreen;
        this._adPlayer.resize(OO.Pulse.AdPlayer.Settings.SCALING.AUTO, OO.Pulse.AdPlayer.Settings.SCALING.AUTO, this._isFullscreen);
    }.bind(this));

    document.addEventListener("mozfullscreenchange", function() {
        this._isFullscreen = document.mozFullScreen;
        this._adPlayer.resize(OO.Pulse.AdPlayer.Settings.SCALING.AUTO, OO.Pulse.AdPlayer.Settings.SCALING.AUTO, this._isFullscreen);
    }.bind(this));

    document.addEventListener("fullscreenchange", function() {
        this._isFullscreen = document.fullscreen;
        this._adPlayer.resize(OO.Pulse.AdPlayer.Settings.SCALING.AUTO, OO.Pulse.AdPlayer.Settings.SCALING.AUTO, this._isFullscreen);
    }.bind(this));

    document.addEventListener("msfullscreenchange", function() {
        this._isFullscreen = document.msFullscreenElement;
        this._adPlayer.resize(OO.Pulse.AdPlayer.Settings.SCALING.AUTO, OO.Pulse.AdPlayer.Settings.SCALING.AUTO, this._isFullscreen);
    }.bind(this));
}.bind(this);

var skinDiv = adPlayer.getSkinElement();
skinDiv.className = 'pulse-adplayer-skin';

this._isFullscreen = false;
this._adPlayer = adPlayer;
this._playButton = new PlayButton(skinDiv, adPlayer, this);
this._loadingSpinner = new LoadingSpinner(skinDiv, adPlayer);
this._skipButton = new SkipButton(skinDiv, adPlayer);
this._progressBar = new ProgressBar(skinDiv, adPlayer);
this._skipCountdown = new SkipCountdown(skinDiv, adPlayer);
this._adCounter = new AdCounter(skinDiv, adPlayer);
this._muteButton = new MuteButton(skinDiv, adPlayer, false);

addPlayerEventListeners(adPlayer);
addFullScreenListeners();
