interface YT {
    Player: {
      new (elementId: string, options: YT.PlayerOptions): YT.Player;
    };
    PlayerState: {
      ENDED: number;
      PLAYING: number;
      PAUSED: number;
      BUFFERING: number;
      CUED: number;
    };
  }
  
  interface YT {
    Player: {
      prototype: YT.Player;
    };
  }
  
  interface YT {
    PlayerOptions: {
      height?: string | number;
      width?: string | number;
      videoId?: string;
      playerVars?: YT.PlayerVars;
      events?: YT.Events;
    };
  }
  
  interface YT {
    PlayerVars: {
      autoplay?: 0 | 1;
      cc_load_policy?: 1;
      color?: 'red' | 'white';
      controls?: 0 | 1 | 2;
      disablekb?: 0 | 1;
      enablejsapi?: 0 | 1;
      end?: number;
      fs?: 0 | 1;
      hl?: string;
      iv_load_policy?: 1 | 3;
      list?: string;
      listType?: 'playlist' | 'search' | 'user_uploads';
      loop?: 0 | 1;
      modestbranding?: 1;
      origin?: string;
      playlist?: string;
      playsinline?: 0 | 1;
      rel?: 0 | 1;
      showinfo?: 0 | 1;
      start?: number;
    };
  }
  
  interface YT {
    Player: {
      prototype: {
        playVideo(): void;
        pauseVideo(): void;
        stopVideo(): void;
        seekTo(seconds: number, allowSeekAhead: boolean): void;
        loadVideoById(videoId: string, startSeconds?: number): void;
        cueVideoById(videoId: string, startSeconds?: number): void;
        getPlayerState(): number;
      };
    };
  }
  
  interface YT {
    Events: {
      onReady?: (event: YT.PlayerEvent) => void;
      onStateChange?: (event: YT.OnStateChangeEvent) => void;
      onPlaybackQualityChange?: (event: YT.PlaybackQualityChangeEvent) => void;
      onPlaybackRateChange?: (event: YT.PlaybackRateChangeEvent) => void;
      onError?: (event: YT.OnErrorEvent) => void;
      onApiChange?: (event: YT.ApiChangeEvent) => void;
    };
  }
  
  interface YT {
    PlayerEvent: {
      target: YT.Player;
    };
  }
  
  interface YT {
    OnStateChangeEvent: {
      target: YT.Player;
      data: number;
    };
  }
  
  interface YT {
    PlaybackQualityChangeEvent: {
      target: YT.Player;
      data: string;
    };
  }
  
  interface YT {
    PlaybackRateChangeEvent: {
      target: YT.Player;
      data: number;
    };
  }
  
  interface YT {
    OnErrorEvent: {
      target: YT.Player;
      data: number;
    };
  }
  
  interface YT {
    ApiChangeEvent: {
      target: YT.Player;
    };
  }
  
  interface Window {
    YT: YT;
    onYouTubeIframeAPIReady: () => void;
  }