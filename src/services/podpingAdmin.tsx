import { getAuthCredentialsHeaders } from '~/lib/utility/auth'
import { request } from './request'

export const sendPodpingLiveStatusUpdate = async (feedUrl: string, status: 'live' | 'liveEnd') => {
  const response = await request({
    endpoint: '/podping/feed/live-update',
    method: 'post',
    body: {
      feedUrl,
      status
    },
    timeout: 90000,
    ...getAuthCredentialsHeaders()
  })

  return response && response.data
}
