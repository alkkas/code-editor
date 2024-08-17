import { EventMap } from '@/utils/types/types'
import { getDefaultEvents } from './allEvents/default'
import { getSelectionEvents } from './allEvents/selection'
import { GetEventsFunc } from './allEvents/events.model'

export class Events {
  wrapper: HTMLDivElement

  private events!: EventMap

  private hiddenEventsNames: (keyof HTMLElementEventMap)[] = []

  private initEvents(...getEvents: GetEventsFunc[]) {
    const hiddenEventsNames: (keyof HTMLElementEventMap)[] = []

    getEvents.forEach((getEvent) => {
      const newEvents = getEvent(this.wrapper)
      this.events = { ...this.events, ...newEvents.events }
      hiddenEventsNames.push(...(newEvents.hiddenEventsNames ?? []))
    })

    this.hiddenEventsNames = hiddenEventsNames
  }

  constructor(wrapper: HTMLDivElement) {
    this.wrapper = wrapper

    this.initEvents(getDefaultEvents, getSelectionEvents)
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
