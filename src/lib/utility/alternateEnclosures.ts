import { EpisodeAlternateEnclosure, EpisodeAlternateEnclosureSource } from 'podverse-shared'

export const generateAlternateEnclosureDropdownOptions = (alternateEnclosures: EpisodeAlternateEnclosure[]) => {
  const dropdownOptions = []
  for (let i = 0; i < alternateEnclosures.length; i++) {
    const alternateEnclosure = alternateEnclosures[i]
    let label = alternateEnclosure.title
    if (alternateEnclosure.height > 0) {
      label += ` - ${alternateEnclosure.height}p`
    } else if (!label) {
      label = alternateEnclosure.type
    }
    dropdownOptions.push({ label, key: i })
  }

  return dropdownOptions
}

export const generateAlternateEnclosureSourceOptions = (sources: EpisodeAlternateEnclosureSource[]) => {
  const dropdownOptions = []
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i]
    const label = source.uri
    dropdownOptions.push({ label, key: i })
  }

  return dropdownOptions
}

export const alertForUnsupportedFileTypes = (src: string, t: any) => {
  if (src && src.endsWith('torrent')) {
    window.alert(t('Unsupported file type alert'))
  }
}
