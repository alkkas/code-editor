import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { IEditorStore } from '@/entities/editor-store/model/editorStore.types'
import getEditorStoreGetters from './editorStore.getters'
import getEditorStoreInitialState from './editorStore.initial'
import getEditorStoreSetters from './editorStore.setters'

export const useEditorStore = create(
  immer<IEditorStore>((set, get) => ({
    ...getEditorStoreInitialState(),

    ...getEditorStoreSetters(get, set),

    ...getEditorStoreGetters(get),
  }))
)
