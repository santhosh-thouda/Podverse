import OmniAural from 'omniaural'
import { convertToNowPlayingItem, NowPlayingItem } from 'podverse-shared'
import { getAuthCredentialsHeaders } from '~/lib/utility/auth'
import { request } from '~/services/request'

export const getNowPlayingItemOnServer = async () => {
  let item = null

  const userInfo = OmniAural.state.session.userInfo.value()
  if (!userInfo) return null

  try {
    const response = (await request({
      endpoint: '/user-now-playing-item',
      method: 'GET',
      ...getAuthCredentialsHeaders()
    })) as any

    const { episode, mediaRef, userPlaybackPosition } = response.data

    if (!episode && !mediaRef) {
      throw new Error('Response data missing both episode and mediaRef')
    }

    item = convertToNowPlayingItem(mediaRef || episode, null, null, userPlaybackPosition || 0) || {}
  } catch (error) {
    console.log('Error in getNowPlayingItemOnServer: ', error)
    item = null
  }

  return item
}

export const setNowPlayingItemOnServer = async (item: NowPlayingItem | null, playbackPosition: number) => {
  if (!item || (!item.clipId && !item.episodeId) || item.addByRSSPodcastFeedUrl) {
    return
  }

  playbackPosition = (playbackPosition && Math.floor(playbackPosition)) || 0

  const { clipId, clipIsOfficialChapter, episodeId, liveItem } = item
  const body = {
    ...(clipId && !clipIsOfficialChapter ? { clipId } : { clipId: null }),
    ...(clipId && !clipIsOfficialChapter ? { episodeId: null } : { episodeId }),
    ...(liveItem ? { liveItem } : {}),
    userPlaybackPosition: playbackPosition
  }

  await request({
    endpoint: '/user-now-playing-item',
    method: 'PATCH',
    ...getAuthCredentialsHeaders(),
    body
  })
}

export const clearNowPlayingItemOnServer = async () => {
  await request({
    endpoint: '/user-now-playing-item',
    method: 'DELETE',
    ...getAuthCredentialsHeaders()
  })
}
