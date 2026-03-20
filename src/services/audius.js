const AUDIUS_API_URL = 'https://api.audius.co/v1'

/**
 * Get trending tracks from Audius
 */
export async function getTrendingTracks(limit = 30) {
  try {
    const response = await fetch(
      `${AUDIUS_API_URL}/tracks/trending?limit=${limit}`
    )
    if (!response.ok) throw new Error('Failed to fetch')
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching trending tracks:', error)
    return []
  }
}

/**
 * Search tracks by query
 */
export async function searchTracks(query, limit = 30) {
  try {
    const response = await fetch(
      `${AUDIUS_API_URL}/tracks/search?q=${encodeURIComponent(query)}&limit=${limit}`
    )
    if (!response.ok) throw new Error('Failed to search')
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error searching tracks:', error)
    return []
  }
}

/**
 * Get a single track by ID
 */
export async function getTrack(trackId) {
  try {
    const response = await fetch(`${AUDIUS_API_URL}/tracks/${trackId}`)
    if (!response.ok) throw new Error('Failed to fetch')
    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('Error fetching track:', error)
    return null
  }
}

/**
 * Get stream URL for a track
 * Audius provides stream URLs through the preview_url field
 */
export function getStreamUrl(track) {
  if (!track) return null
  
  // Method 1: Use preview_url if available (safest)
  if (track.preview_url) {
    return track.preview_url
  }
  
  // Method 2: Stream full track through Audius CDN
  if (track.streaming_url) {
    return track.streaming_url
  }
  
  // Method 3: Construct URL from track ID (fallback)
  if (track.id) {
    // Try Audius's public stream endpoint
    return `https://discovery-node-1.audius.co/v1/tracks/${track.id}/stream`
  }
  
  return null
}

/**
 * Get track artwork URL
 */
export function getArtworkUrl(track, size = '_480x480') {
  if (!track || !track.artwork) return null
  
  // artwork is an object with sizes
  if (typeof track.artwork === 'object') {
    return track.artwork[size] || track.artwork['_1000x1000'] || track.artwork['_480x480']
  }
  
  return track.artwork
}

/**
 * Get duration from track (handles different API responses)
 */
export function getTrackDuration(track) {
  if (!track) return 0
  return track.duration || track.length || track.audio_length || 0
}
