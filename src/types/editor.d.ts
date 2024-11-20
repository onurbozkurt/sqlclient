import { editor } from 'monaco-editor';

declare global {
  interface Window {
    editor?: editor.IStandaloneCodeEditor;
  }
}
