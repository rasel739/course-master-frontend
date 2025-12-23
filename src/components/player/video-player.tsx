'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  autoPlay?: boolean;
  className?: string;
}

const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /youtube\.com\/v\/([^&?/]+)/,
    /youtube\.com\/shorts\/([^&?/]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

const YouTubePlayer = ({
  videoId,
  title,
  autoPlay,
  onComplete,
  className,
}: {
  videoId: string;
  title?: string;
  autoPlay?: boolean;
  onComplete?: () => void;
  className?: string;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
    autoplay: autoPlay ? '1' : '0',
    mute: autoPlay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
    playsinline: '1',
  }).toString()}`;

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      await container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black group rounded-lg overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
    >
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title || 'YouTube video'}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
        className='w-full h-full aspect-video'
      />

      {title && (
        <div className='absolute top-0 left-0 right-0 p-4 bg-linear-to-b from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'>
          <p className='text-white font-medium'>{title}</p>
        </div>
      )}

      <Button
        variant='ghost'
        size='icon'
        onClick={toggleFullscreen}
        className='absolute bottom-4 right-4 text-white bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity'
      >
        {isFullscreen ? <Minimize className='w-5 h-5' /> : <Maximize className='w-5 h-5' />}
      </Button>
    </div>
  );
};

const CustomVideoPlayer = ({
  src,
  poster,
  title,
  onProgress,
  onComplete,
  autoPlay = false,
  className,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;

    video.muted = true;
    video
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsMuted(true);
      })
      .catch((error) => {
        console.log('Autoplay failed:', error);
        setIsPlaying(false);
      });
  }, [autoPlay, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      onProgress?.(progress);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete]);

  const resetHideTimer = () => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    setShowControls(true);
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
    resetHideTimer();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      await container.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const seek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = progressRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black group rounded-lg overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className='w-full h-full object-contain'
        autoPlay={autoPlay}
        onClick={togglePlay}
      />

      {!isPlaying && (
        <div
          className='absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer'
          onClick={togglePlay}
        >
          <div className='w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform'>
            <Play className='w-10 h-10 text-gray-900 ml-1' fill='currentColor' />
          </div>
        </div>
      )}

      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent p-4 transition-opacity',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div
          ref={progressRef}
          className='w-full h-1 bg-white/30 rounded-full cursor-pointer mb-3 group/progress'
          onClick={handleProgressClick}
        >
          <div className='relative h-full'>
            <div
              className='absolute h-full bg-blue-600 rounded-full'
              style={{ width: `${progress}%` }}
            />
            <div
              className='absolute w-3 h-3 bg-blue-600 rounded-full -top-1 opacity-0 group-hover/progress:opacity-100 transition-opacity'
              style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
            />
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={togglePlay}
              className='text-white hover:bg-white/20'
            >
              {isPlaying ? (
                <Pause className='w-5 h-5' fill='currentColor' />
              ) : (
                <Play className='w-5 h-5' fill='currentColor' />
              )}
            </Button>

            <Button
              variant='ghost'
              size='icon'
              onClick={() => seek(-10)}
              className='text-white hover:bg-white/20'
            >
              <RotateCcw className='w-5 h-5' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              onClick={() => seek(10)}
              className='text-white hover:bg-white/20'
            >
              <SkipForward className='w-5 h-5' />
            </Button>

            <div className='flex items-center space-x-1 group/volume'>
              <Button
                variant='ghost'
                size='icon'
                onClick={toggleMute}
                className='text-white hover:bg-white/20'
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className='w-5 h-5' />
                ) : (
                  <Volume2 className='w-5 h-5' />
                )}
              </Button>
              <input
                type='range'
                min='0'
                max='1'
                step='0.1'
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className='w-0 group-hover/volume:w-20 transition-all duration-200 accent-blue-600'
              />
            </div>

            <span className='text-white text-sm'>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className='flex items-center space-x-2'>
            <div className='relative'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowSettings(!showSettings)}
                className='text-white hover:bg-white/20 text-sm'
              >
                {playbackRate}x
              </Button>
              {showSettings && (
                <div className='absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg p-2 space-y-1'>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={cn(
                        'block w-full px-4 py-1 text-sm text-left rounded hover:bg-white/10',
                        playbackRate === rate ? 'text-blue-500' : 'text-white'
                      )}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant='ghost'
              size='icon'
              onClick={toggleFullscreen}
              className='text-white hover:bg-white/20'
            >
              {isFullscreen ? <Minimize className='w-5 h-5' /> : <Maximize className='w-5 h-5' />}
            </Button>
          </div>
        </div>
      </div>

      {title && showControls && (
        <div className='absolute top-0 left-0 right-0 p-4 bg-linear-to-b from-black/90 to-transparent'>
          <p className='text-white font-medium'>{title}</p>
        </div>
      )}
    </div>
  );
};

export const VideoPlayer = (props: VideoPlayerProps) => {
  const youtubeVideoId = useMemo(() => getYouTubeVideoId(props.src), [props.src]);

  if (youtubeVideoId) {
    return (
      <YouTubePlayer
        videoId={youtubeVideoId}
        title={props.title}
        autoPlay={props.autoPlay}
        onComplete={props.onComplete}
        className={props.className}
      />
    );
  }

  return <CustomVideoPlayer {...props} />;
};

export default VideoPlayer;
