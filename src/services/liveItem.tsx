import { LiveItemStatus, Podcast } from 'podverse-shared'
import { PV } from '~/resources'
import { EpisodeQueryParams, getEpisodesByQuery } from './episode'
import { request } from './request'

export const getPublicLiveItemsByPodcastId = async (podcastId: string) => {
  if (!podcastId) {
    return { currentlyLive: [], scheduled: [] }
  } else {
    const liveItems = await request({
      endpoint: `${PV.RoutePaths.api.live_item}/podcast/${podcastId}`,
      method: 'get'
    })

    const { data } = liveItems
    const currentlyLive = []
    const scheduled = []

    for (const liveItem of data) {
      const episode = liveItem.episode
      delete liveItem.episode
      episode.liveItem = liveItem
      if (liveItem.status === 'live') {
        currentlyLive.push(episode)
      } else {
        scheduled.push(episode)
      }
    }

    return { currentlyLive, scheduled }
  }
}

export const getEpisodesAndLiveItems = async (query: EpisodeQueryParams, podcast: Podcast, page = 1) => {
  // If a show is currently live, it will appear at the top of the episodes list.
  // Scheduled live shows appear under the About section.
  const episodesResponse = await getEpisodesByQuery(query)
  const [episodesData, episodesDataCount] = episodesResponse.data
  let combinedEpisodesData = episodesData
  let scheduledLiveItems = []

  if (podcast.hasLiveItem && page === 1) {
    const { currentlyLive, scheduled } = await getPublicLiveItemsByPodcastId(podcast.id)
    combinedEpisodesData = [...currentlyLive, ...episodesData]
    scheduledLiveItems = [...currentlyLive, ...scheduled]
  }

  return {
    combinedEpisodes: [combinedEpisodesData, episodesDataCount],
    scheduledLiveItems
  }
}

export const ariaLiveItemStatusLabel = (liveItemStatus: LiveItemStatus, t: any) => {
  let ariaLiveItemStatus = ''
  if (liveItemStatus === 'live') {
    ariaLiveItemStatus = t('Live')
  } else if (liveItemStatus === 'pending') {
    ariaLiveItemStatus = t('Live Time')
  } else if (liveItemStatus === 'ended') {
    ariaLiveItemStatus = t('Live Ended')
  }
  return ariaLiveItemStatus
}

export type LiveItemsQueryParams = {
  categories?: string[]
  hasVideo?: boolean
  includePodcast?: boolean
  liveItemStatus: LiveItemStatus
  maxResults?: boolean
  page?: number
  podcastIds?: string | string[]
  searchTitle?: string
  sort?: string
}

export const getLiveItemsByQuery = async ({
  categories,
  hasVideo,
  includePodcast,
  liveItemStatus,
  maxResults,
  page,
  podcastIds,
  searchTitle
}: LiveItemsQueryParams) => {
  const filteredQuery: LiveItemsQueryParams = {
    ...(categories ? { categories } : {}),
    ...(hasVideo ? { hasVideo } : {}),
    ...(includePodcast ? { includePodcast } : {}),
    liveItemStatus,
    ...(maxResults ? { maxResults } : {}),
    ...(page ? { page } : { page: 1 }),
    ...(podcastIds ? { podcastId: podcastIds } : {}),
    ...(searchTitle
      ? {
          searchTitle: encodeURIComponent(searchTitle)
        }
      : {})
  }

  if (podcastIds?.length === 0 || categories?.length === 0) {
    return { data: [[], 0] }
  } else {
    const liveItemResponse = await request({
      endpoint: PV.RoutePaths.api.live_item,
      method: 'get',
      query: filteredQuery
    })
    const [liveItemsData, liveItemsDataCount] = liveItemResponse.data
    return { data: [liveItemsData, liveItemsDataCount] }
  }
}
