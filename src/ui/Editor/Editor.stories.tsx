import type { Meta, StoryObj } from '@storybook/react'
import Editor from '@/ui/Editor/Editor'
import { fireEvent, userEvent, within } from '@storybook/test'

const meta: Meta<typeof Editor> = {
  component: Editor,
}

export default meta

type Story = StoryObj<typeof Editor>

export const EditorStory: Story = {
  args: {
    language: 'typescript',
    style: {
      width: 600,
      height: 400,
    },
  },
}

export const addSimpleText: Story = {
  args: {
    language: 'typescript',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editorElement = canvas.getByTestId('editor')

    await userEvent.click(editorElement)
    await userEvent.type(editorElement, 'let a = 4;')
    await fireEvent.keyDown(editorElement, { key: 'Enter', code: 13 })
    await userEvent.type(editorElement, "let b = 'asdfasdf';")
  },
}
