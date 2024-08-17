import { EventMap } from '@/utils/types/types'

export type GetEventsFunc = (element: HTMLElement) => {
  events: EventMap
  hiddenEventsNames?: (keyof HTMLElementEventMap)[]
}
