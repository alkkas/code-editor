import { EventMap } from '@/utils/types/types'
import { getDefaultEvents } from './allEvents/default'
import { getSelectionEvents } from './allEvents/selection'

export class Events {
  wrapper: HTMLDivElement

  private readonly events: EventMap

  private hiddenEventsNames: (keyof HTMLElementEventMap)[] = []

  constructor(wrapper: HTMLDivElement) {
    this.wrapper = wrapper

    // if number of events grows refactor this
    const defaultEvents = getDefaultEvents(wrapper)
    const selectionEvents = getSelectionEvents(wrapper)

    this.hiddenEventsNames.push(
      ...(defaultEvents.hiddenEventsNames ?? []),
      ...(selectionEvents.hiddenEventsNames ?? [])
    )

    this.events = {
      ...defaultEvents.events,
      ...selectionEvents.events,
    }
  }

  createAllListeners() {
    const eventsKeys = Object.keys(this.events) as (keyof HTMLElementEventMap)[]

    eventsKeys.forEach((eventKey) => {
      const listener = this.events[eventKey] as (evt: Event) => void
      if (!listener) throw Error(`No such event ${eventKey}`)
      if (this.hiddenEventsNames.includes(eventKey)) return
      this.wrapper.addEventListener(eventKey, listener)
    })
  }

  deleteAllListeners() {
    const eventsKeys = Object.keys(this.events) as (keyof HTMLElementEventMap)[]

    eventsKeys.forEach((eventKey) => {
      const listener = this.events[eventKey] as (evt: Event) => void
      if (!listener) throw Error(`No such event ${eventKey}`)
      this.wrapper.removeEventListener(eventKey, listener)
    })
  }
}
