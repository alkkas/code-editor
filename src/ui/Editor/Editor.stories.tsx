import type { Meta, StoryObj } from '@storybook/react'
import Editor from '@/ui/Editor/Editor'
import { fireEvent, userEvent, within } from '@storybook/test'
import { EditorProps } from '@/model/editor-types'

const meta: Meta<typeof Editor> = {
  component: Editor,
}

export default meta

type Story = StoryObj<typeof Editor>

const props: EditorProps = {
  language: 'typescript',
  initialValue: "let a = 4;\nlet b = 'asdfasdf';",
  style: {
    width: 600,
    height: 400,
    borderRadius: 5,
  },
}

export const EditorStory: Story = {
  args: props,
}

export const AddSimpleText: Story = {
  args: props,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editorElement = canvas.getByTestId('editor')

    await userEvent.click(editorElement)
    await userEvent.type(editorElement, 'let a = 4;')
    await fireEvent.keyDown(editorElement, { key: 'Enter', code: 13 })
    await userEvent.type(editorElement, "let b = 'asdfasdf';")
  },
}
