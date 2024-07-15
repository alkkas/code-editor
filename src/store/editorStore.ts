import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { IEditorStore } from './editorStore.types'
import getEditorStoreGetters from './editorStore.getters'
import getEditorStoreInitialState from './editorStore.initial'
import getEditorStoreSetters from './setters/index-editor.setters'

export const useEditorStore = create(
  immer<IEditorStore>((set, get) => ({
    ...getEditorStoreInitialState(),

    ...getEditorStoreSetters(get, set),

    ...getEditorStoreGetters(get),
  }))
)
