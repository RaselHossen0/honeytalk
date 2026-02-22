'use client';

import { useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  minHeight?: number;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  label,
  minHeight = 320,
  placeholder = 'Enter content...',
}: RichTextEditorProps) {
  const editorRef = useRef<null>(null);

  const handleEditorChange = useCallback(
    (content: string) => {
      onChange(content);
    },
    [onChange]
  );

  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Box
          component="label"
          sx={{
            display: 'block',
            fontSize: 14,
            fontWeight: 500,
            color: 'text.primary',
            mb: 1,
          }}
        >
          {label}
        </Box>
      )}
      <Editor
        onInit={(_, editor) => {
          (editorRef as React.MutableRefObject<unknown>).current = editor;
        }}
        value={value}
        onEditorChange={handleEditorChange}
        {...(process.env.NEXT_PUBLIC_TINYMCE_API_KEY && { apiKey: process.env.NEXT_PUBLIC_TINYMCE_API_KEY })}
        init={{
          height: minHeight,
          menubar: true,
          placeholder,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table blockquote hr | forecolor backcolor | removeformat | fullscreen code',
          toolbar_mode: 'wrap',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
    </Box>
  );
}
