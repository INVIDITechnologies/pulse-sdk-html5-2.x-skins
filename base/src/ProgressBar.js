var ProgressBar = function (div, adPlayer) {
    this._parent = div;
    this._adPlayer = adPlayer;
    this._progress = document.createElement("progress");
    this._progress.className = "pulse-progress";
    this._progress.min = 0;
    this._progress.max = 1;
    this._progress.value = 0;
    this.hide();
    div.appendChild(this._progress);
}

ProgressBar.prototype = {
    show: function() {
        this._progress.className = "pulse-progress pulse-visible";
    },
    hide: function() {
        this._progress.className = "pulse-progress";
    },
    setProgress: function(progress) {
        this._progress.value = progress;
    }
};