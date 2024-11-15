import { getAuthCredentialsHeaders } from '~/lib/utility/auth'
import { PV } from '~/resources'
import { request } from '~/services/request'

export const getMediaRefById = async (id: string) => {
  return request({
    endpoint: `${PV.RoutePaths.api.mediaRef}/${id}`,
    method: 'get'
  })
}

type MediaRefQueryParams = {
  categories?: string[]
  episodeId?: string | string[]
  hasVideo?: boolean
  includeEpisode?: boolean
  includePodcast?: boolean
  page?: number
  podcastIds?: string | string[]
  searchTitle?: string
  sort?: string
}

export const getMediaRefsByQuery = async ({
  categories,
  episodeId,
  hasVideo,
  includeEpisode,
  includePodcast,
  page,
  podcastIds,
  searchTitle,
  sort
}: MediaRefQueryParams) => {
  const filteredQuery: MediaRefQueryParams = {
    ...(categories ? { categories } : {}),
    ...(episodeId ? { episodeId } : {}),
    ...(hasVideo ? { hasVideo } : {}),
    ...(includeEpisode ? { includeEpisode } : {}),
    ...(includePodcast ? { includePodcast } : {}),
    ...(page ? { page } : { page: 1 }),
    ...(podcastIds ? { podcastId: podcastIds } : {}),
    ...(searchTitle
      ? {
          searchTitle: encodeURIComponent(searchTitle)
        }
      : {}),
    ...(sort ? { sort } : { sort: PV.Filters.sort._mostRecent })
  }

  if (podcastIds?.length === 0 || categories?.length === 0) {
    return { data: [[], 0] }
  } else {
    return request({
      endpoint: PV.RoutePaths.api.mediaRef,
      method: 'get',
      query: filteredQuery
    })
  }
}

export const getUserMediaRefs = async (userId: string, query: any = {}) => {
  const response = await request({
    endpoint: `/user/${userId}/mediaRefs`,
    query
  })

  return response && response.data
}

export const getLoggedInUserMediaRefs = async (bearerToken?: string, query: any = {}) => {
  const response = await request({
    endpoint: '/user/mediaRefs',
    ...getAuthCredentialsHeaders(bearerToken),
    query
  })

  return response && response.data
}

export const retrieveLatestChaptersForEpisodeId = async (id: string) => {
  const response = await request({
    endpoint: `/episode/${id}/retrieve-latest-chapters`
  })

  return response && response.data
}

type MediaRefCreateBody = {
  endTime?: number
  episodeId: string
  isPublic: boolean
  startTime: number
  title?: string
}

export const createMediaRef = async (body: MediaRefCreateBody) => {
  const response = await request({
    endpoint: '/mediaRef',
    method: 'POST',
    ...getAuthCredentialsHeaders(),
    body
  })

  return response && response.data
}

export const deleteMediaRef = async (id: string) => {
  const response = await request({
    endpoint: `/mediaRef/${id}`,
    method: 'DELETE',
    ...getAuthCredentialsHeaders()
  })

  return response && response.data
}

type MediaRefUpdateBody = {
  endTime?: number
  episodeId: string
  id: string
  isPublic: boolean
  startTime: number
  title?: string
}

export const updateMediaRef = async (body: MediaRefUpdateBody) => {
  const response = await request({
    endpoint: '/mediaRef',
    method: 'PATCH',
    ...getAuthCredentialsHeaders(),
    body
  })

  return response && response.data
}
