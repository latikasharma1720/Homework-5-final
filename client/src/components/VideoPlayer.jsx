import { useState } from "react";

export default function VideoPlayer({ src }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="video-wrap">
      <video src={src} controls onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} width="360" />
      <small>{playing ? "🎬 Playing" : "⏸️ Paused"}</small>
    </div>
  );
}
