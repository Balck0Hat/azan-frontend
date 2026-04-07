import { useState } from 'react';
import '../styles/liveStream.css';

const STREAMS = [
    {
        id: 'makkah',
        name: 'المسجد الحرام',
        icon: '🕋',
        youtubeId: '2n5tLQEIyxs',
        description: 'بث مباشر من مكة المكرمة'
    },
    {
        id: 'madinah',
        name: 'المسجد النبوي',
        icon: '🕌',
        youtubeId: 'cYe8oGsvOjk',
        description: 'بث مباشر من المدينة المنورة'
    },
    {
        id: 'aqsa',
        name: 'المسجد الأقصى',
        icon: '🌙',
        youtubeId: 'lzS4v__XE5g',
        description: 'بث مباشر من القدس الشريف'
    }
];

export default function LiveStream() {
    const [selectedStream, setSelectedStream] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const openStream = (stream) => {
        setSelectedStream(stream);
        setIsPlaying(true);
    };

    const closeStream = () => {
        setSelectedStream(null);
        setIsPlaying(false);
    };

    return (
        <div className="live-stream">
            <div className="stream-header">
                <h3 className="stream-title">
                    <span className="live-dot"></span>
                    بث مباشر
                </h3>
            </div>

            <div className="stream-options">
                {STREAMS.map(stream => (
                    <button
                        key={stream.id}
                        className={`stream-option ${selectedStream?.id === stream.id ? 'active' : ''}`}
                        onClick={() => openStream(stream)}
                    >
                        <span className="stream-icon">{stream.icon}</span>
                        <span className="stream-name">{stream.name}</span>
                    </button>
                ))}
            </div>

            {selectedStream && isPlaying && (
                <div className="stream-player">
                    <div className="player-header">
                        <div className="player-info">
                            <span className="player-icon">{selectedStream.icon}</span>
                            <div>
                                <span className="player-name">{selectedStream.name}</span>
                                <span className="player-desc">{selectedStream.description}</span>
                            </div>
                        </div>
                        <button className="close-player" onClick={closeStream}>✕</button>
                    </div>

                    <div className="player-wrapper">
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedStream.youtubeId}?autoplay=1&rel=0`}
                            title={selectedStream.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    <div className="player-actions">
                        <a
                            href={`https://www.youtube.com/watch?v=${selectedStream.youtubeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="youtube-link"
                        >
                            ▶️ فتح في YouTube
                        </a>
                    </div>
                </div>
            )}

            {!selectedStream && (
                <div className="stream-info">
                    <p>اختر مسجداً لمشاهدة البث المباشر</p>
                </div>
            )}
        </div>
    );
}
