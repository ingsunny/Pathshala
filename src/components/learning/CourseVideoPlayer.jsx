"use client";

import {
  ArrowsPointingOutIcon,
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  RectangleGroupIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return hours ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}` : `${minutes}:${seconds}`;
}

export default function CourseVideoPlayer({ src, title, poster, onEnded }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);
    setWaiting(true);
    setError(false);
    video.load();
  }, [src]);

  useEffect(() => () => clearTimeout(hideTimerRef.current), []);

  function revealControls() {
    setControlsVisible(true);
    clearTimeout(hideTimerRef.current);
    if (playing) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 2600);
    }
  }

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }

  function seekTo(value) {
    const nextTime = Number(value);
    videoRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function skip(seconds) {
    const video = videoRef.current;
    seekTo(Math.min(Math.max(video.currentTime + seconds, 0), duration || 0));
  }

  function changeVolume(value) {
    const nextVolume = Number(value);
    videoRef.current.volume = nextVolume;
    videoRef.current.muted = nextVolume === 0;
    setVolume(nextVolume);
    setMuted(nextVolume === 0);
  }

  function toggleMute() {
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setMuted(nextMuted);
  }

  function changeRate(value) {
    const nextRate = Number(value);
    videoRef.current.playbackRate = nextRate;
    setRate(nextRate);
  }

  async function toggleFullscreen() {
    if (!document.fullscreenElement) {
      await playerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }

  async function togglePictureInPicture() {
    const video = videoRef.current;
    if (!document.pictureInPictureEnabled || !video) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  }

  function handleKeyboard(event) {
    if (["INPUT", "SELECT", "BUTTON"].includes(event.target.tagName)) return;
    const key = event.key.toLowerCase();
    if (key === " " || key === "k") {
      event.preventDefault();
      togglePlayback();
    } else if (key === "arrowleft") {
      event.preventDefault();
      skip(-10);
    } else if (key === "arrowright") {
      event.preventDefault();
      skip(10);
    } else if (key === "m") {
      toggleMute();
    } else if (key === "f") {
      toggleFullscreen();
    }
  }

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={playerRef}
      className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl shadow-slate-950/20 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
      tabIndex={0}
      onKeyDown={handleKeyboard}
      onMouseMove={revealControls}
      onMouseLeave={() => playing && setControlsVisible(false)}
      aria-label={`${title} video player`}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        preload="metadata"
        playsInline
        poster={poster}
        onClick={togglePlayback}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
          setWaiting(false);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => {
          setPlaying(true);
          setWaiting(false);
          revealControls();
        }}
        onPause={() => {
          setPlaying(false);
          setControlsVisible(true);
        }}
        onWaiting={() => setWaiting(true)}
        onCanPlay={() => setWaiting(false)}
        onEnded={() => {
          setPlaying(false);
          setControlsVisible(true);
          onEnded?.();
        }}
        onError={() => {
          setError(true);
          setWaiting(false);
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className={`pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent px-5 pb-10 pt-4 transition-opacity ${controlsVisible ? "opacity-100" : "opacity-0"}`}>
        <p className="truncate text-sm font-semibold text-white">{title}</p>
      </div>

      {!playing && !waiting && !error && (
        <button
          onClick={togglePlayback}
          className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-slate-950 shadow-xl transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label="Play video"
        >
          <PlayIcon className="ml-1 h-7 w-7" />
        </button>
      )}

      {waiting && !error && (
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-4 border-white/30 border-t-white" aria-label="Video loading" />
      )}

      {error && (
        <div className="absolute inset-0 grid place-items-center bg-slate-950 px-6 text-center text-white">
          <div>
            <p className="font-semibold">This lesson could not be loaded</p>
            <p className="mt-2 text-sm text-slate-400">Check your connection, then refresh the page.</p>
          </div>
        </div>
      )}

      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 pb-3 pt-14 text-white transition-opacity sm:px-5 sm:pb-4 ${controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <label className="block">
          <span className="sr-only">Video progress</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={(event) => seekTo(event.target.value)}
            className="h-1.5 w-full cursor-pointer accent-sky-500"
            aria-label="Seek video"
            style={{ backgroundSize: `${progress}% 100%` }}
          />
        </label>

        <div className="mt-2 flex items-center gap-1 sm:gap-2">
          <ControlButton label={playing ? "Pause" : "Play"} onClick={togglePlayback}>
            {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
          </ControlButton>
          <ControlButton label="Back 10 seconds" onClick={() => skip(-10)} className="hidden sm:grid">
            <BackwardIcon className="h-5 w-5" />
          </ControlButton>
          <ControlButton label="Forward 10 seconds" onClick={() => skip(10)} className="hidden sm:grid">
            <ForwardIcon className="h-5 w-5" />
          </ControlButton>
          <ControlButton label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
            {muted || volume === 0 ? <SpeakerXMarkIcon className="h-5 w-5" /> : <SpeakerWaveIcon className="h-5 w-5" />}
          </ControlButton>
          <label className="hidden items-center sm:flex">
            <span className="sr-only">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={(event) => changeVolume(event.target.value)}
              className="w-20 cursor-pointer accent-sky-500"
            />
          </label>
          <span className="ml-1 text-xs font-medium tabular-nums text-white/90">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <label className="flex items-center">
              <span className="sr-only">Playback speed</span>
              <select
                value={rate}
                onChange={(event) => changeRate(event.target.value)}
                className="cursor-pointer rounded-lg bg-white/10 px-2 py-2 text-xs font-bold text-white outline-none hover:bg-white/20"
                aria-label="Playback speed"
              >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((value) => (
                  <option key={value} value={value} className="text-slate-900">{value}x</option>
                ))}
              </select>
            </label>
            <ControlButton label="Picture in picture" onClick={togglePictureInPicture} className="hidden sm:grid">
              <RectangleGroupIcon className="h-5 w-5" />
            </ControlButton>
            <ControlButton label="Toggle fullscreen" onClick={toggleFullscreen}>
              <ArrowsPointingOutIcon className="h-5 w-5" />
            </ControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButton({ label, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-lg text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400 ${className}`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
