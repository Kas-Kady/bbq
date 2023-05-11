import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

type Props = {
  /**
   * The initial value of the editor.
   */
  initialValue?: string;

  /**
   * The name of the textarea that will be used to store the editor's content.
   * This will be used when submitting the form.
   */
  name: string;
};

export default function Editor({ initialValue, name }: Props) {
  return (
    <>
      <TinyMCEEditor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        textareaName={name}
        initialValue={initialValue}
        init={{
          font_css:
            'https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;600;700&display=swap',
          height: 500,
          width: '100%',
          menubar: false,
          a11y_advanced_options: true,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'preview',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            `alignright alignjustify | bullist numlist outdent indent | ` +
            'removeformat | help',
          block_formats:
            'Paragraph=p; Heading 1=h2; Heading 2=h3; Heading 3=h4;',
          content_style:
            'body { font-family:Assistant,sans-serif; font-size:16px }',
        }}
      />
    </>
  );
}
