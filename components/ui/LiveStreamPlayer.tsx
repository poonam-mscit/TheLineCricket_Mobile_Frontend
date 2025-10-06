import { Text as ThemedText } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LiveStream {
  id: string;
  title: string;
  description: string;
  streamUrl: string;
  thumbnailUrl: string;
  isLive: boolean;
  viewers: number;
  quality: 'auto' | '720p' | '480p' | '360p';
  duration: number; // in seconds
  startTime: Date;
  endTime?: Date;
  match: {
    id: string;
    teamA: string;
    teamB: string;
    scoreA: number;
    scoreB: number;
    overs: string;
    currentBatsman: string;
    currentBowler: string;
    status: 'live' | 'paused' | 'ended';
  };
}

interface LiveStreamPlayerProps {
  stream: LiveStream;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onQualityChange: (quality: string) => void;
  onFullscreen: () => void;
  onShare: () => void;
  onChat: () => void;
  onCommentary: () => void;
}

export function LiveStreamPlayer({ 
  stream, 
  onPlay, 
  onPause, 
  onStop, 
  onQualityChange, 
  onFullscreen, 
  onShare, 
  onChat, 
  onCommentary 
}: LiveStreamPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState(stream.quality);
  
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && stream.isLive) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, stream.isLive]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      onPause();
    } else {
      setIsPlaying(true);
      onPlay();
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    onStop();
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality as any);
    onQualityChange(quality);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (stream.match.status === 'live') return '#2ed573';
    if (stream.match.status === 'paused') return '#ffa502';
    return '#ff4757';
  };

  const getStatusText = () => {
    if (stream.match.status === 'live') return 'LIVE';
    if (stream.match.status === 'paused') return 'PAUSED';
    return 'ENDED';
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#000' : '#000',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      {/* Stream Header */}
      <View style={[styles.header, { 
        backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#2c2c2c'
      }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.liveIndicator, { 
            backgroundColor: getStatusColor() 
          }]}>
            <Text style={styles.liveText}>
              {getStatusText()}
            </Text>
          </View>
          <ThemedText style={[styles.viewerCount, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            👥 {stream.viewers.toLocaleString()} viewers
          </ThemedText>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerButton, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#444'
            }]}
            onPress={onShare}
          >
            <Text style={styles.headerButtonText}>📤</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.headerButton, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#444'
            }]}
            onPress={onFullscreen}
          >
            <Text style={styles.headerButtonText}>⛶</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Video Player Area */}
      <View style={[styles.playerArea, { 
        backgroundColor: colorScheme === 'dark' ? '#000' : '#000',
        height: screenWidth * 0.56 // 16:9 aspect ratio
      }]}>
        <View style={styles.playerContent}>
          {/* Thumbnail/Video Placeholder */}
          <View style={[styles.videoPlaceholder, { 
            backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#2c2c2c'
          }]}>
            <Text style={[styles.placeholderText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              🏏 Live Cricket Stream
            </Text>
            <Text style={[styles.placeholderSubtext, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {stream.title}
            </Text>
          </View>

          {/* Play/Pause Overlay */}
          <TouchableOpacity 
            style={styles.playOverlay}
            onPress={handlePlayPause}
          >
            <View style={[styles.playButton, { 
              backgroundColor: 'rgba(0,0,0,0.7)'
            }]}>
              <Text style={styles.playButtonText}>
                {isPlaying ? '⏸️' : '▶️'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Live Match Info Overlay */}
          <View style={[styles.matchOverlay, { 
            backgroundColor: 'rgba(0,0,0,0.8)'
          }]}>
            <View style={styles.matchInfo}>
              <Text style={[styles.teamName, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {stream.match.teamA}
              </Text>
              <Text style={[styles.score, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {stream.match.scoreA}
              </Text>
            </View>
            
            <View style={styles.matchCenter}>
              <Text style={[styles.overs, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {stream.match.overs}
              </Text>
              <Text style={[styles.status, { 
                color: getStatusColor() 
              }]}>
                {stream.match.status.toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.matchInfo}>
              <Text style={[styles.teamName, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {stream.match.teamB}
              </Text>
              <Text style={[styles.score, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {stream.match.scoreB}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Player Controls */}
      <View style={[styles.controls, { 
        backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#2c2c2c'
      }]}>
        <View style={styles.controlsTop}>
          <View style={styles.timeInfo}>
            <Text style={[styles.timeText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {formatTime(currentTime)}
            </Text>
            <Text style={[styles.timeText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {stream.duration > 0 ? formatTime(stream.duration) : '∞'}
            </Text>
          </View>
          
          <View style={styles.qualityContainer}>
            <Text style={[styles.qualityLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Quality:
            </Text>
            <TouchableOpacity 
              style={[styles.qualityButton, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#444'
              }]}
              onPress={() => {
                const qualities = ['auto', '720p', '480p', '360p'];
                const currentIndex = qualities.indexOf(selectedQuality);
                const nextIndex = (currentIndex + 1) % qualities.length;
                handleQualityChange(qualities[nextIndex]);
              }}
            >
              <Text style={[styles.qualityText, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {selectedQuality.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.controlsBottom}>
          <View style={styles.controlsLeft}>
            <TouchableOpacity 
              style={[styles.controlButton, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#444'
              }]}
              onPress={handlePlayPause}
            >
              <Text style={styles.controlButtonText}>
                {isPlaying ? '⏸️' : '▶️'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#444'
              }]}
              onPress={handleStop}
            >
              <Text style={styles.controlButtonText}>⏹️</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#444'
              }]}
              onPress={handleMuteToggle}
            >
              <Text style={styles.controlButtonText}>
                {isMuted ? '🔇' : '🔊'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.controlsRight}>
            <TouchableOpacity 
              style={[styles.controlButton, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#444'
              }]}
              onPress={onChat}
            >
              <Text style={styles.controlButtonText}>💬</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#444'
              }]}
              onPress={onCommentary}
            >
              <Text style={styles.controlButtonText}>📝</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Stream Info */}
      <View style={[styles.streamInfo, { 
        backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#2c2c2c'
      }]}>
        <ThemedText style={[styles.streamTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          {stream.title}
        </ThemedText>
        
        <ThemedText style={[styles.streamDescription, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          {stream.description}
        </ThemedText>
        
        <View style={styles.streamStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              👥 {stream.viewers.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              ⏱️ {formatTime(currentTime)}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              📺 {selectedQuality.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  liveIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewerCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 16,
  },
  playerArea: {
    position: 'relative',
  },
  playerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    opacity: 0.7,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 32,
  },
  matchOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  matchInfo: {
    alignItems: 'center',
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  matchCenter: {
    alignItems: 'center',
  },
  overs: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  controls: {
    padding: 12,
  },
  controlsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  qualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qualityLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  qualityButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qualityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  controlsBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlsLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  controlsRight: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 16,
  },
  streamInfo: {
    padding: 12,
  },
  streamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  streamDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  streamStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
