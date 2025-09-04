
import { FormatCategory } from './types';

export const CONVERSION_FORMATS: FormatCategory[] = [
  {
    name: 'Audio',
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' },
      { value: 'aac', label: 'AAC' },
      { value: 'flac', label: 'FLAC' },
      { value: 'ogg', label: 'OGG' },
    ],
  },
  {
    name: 'Video',
    formats: [
      { value: 'mp4', label: 'MP4' },
      { value: 'avi', label: 'AVI' },
      { value: 'mov', label: 'MOV' },
      { value: 'mkv', label: 'MKV' },
      { value: 'webm', label: 'WebM' },
    ],
  },
  {
    name: 'Image',
    formats: [
      { value: 'jpg', label: 'JPG' },
      { value: 'png', label: 'PNG' },
      { value: 'gif', label: 'GIF' },
      { value: 'webp', label: 'WebP' },
      { value: 'svg', label: 'SVG' },
    ],
  },
   {
    name: 'Document',
    formats: [
      { value: 'pdf', label: 'PDF' },
      { value: 'docx', label: 'DOCX' },
      { value: 'txt', label: 'TXT' },
      { value: 'html', label: 'HTML' },
    ],
  },
];
