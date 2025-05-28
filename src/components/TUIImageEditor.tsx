
import React, { useRef, useEffect } from 'react';
import ImageEditor from '@toast-ui/react-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';

interface TUIImageEditorProps {
  imageUrl: string;
  onSave: (editedImageData: string) => void;
  onClose: () => void;
}

const icona = {
  'menu.normalIcon.path': 'M-7,0 L-3,0 L-3,4 L-7,4 L-7,0 M-5,6 L-1,6 L-1,10 L-5,10 L-5,6 M1,0 L5,0 L5,4 L1,4 L1,0 M3,6 L7,6 L7,10 L3,10 L3,6',
  'menu.activeIcon.path': 'M-7,0 L-3,0 L-3,4 L-7,4 L-7,0 M-5,6 L-1,6 L-1,10 L-5,10 L-5,6 M1,0 L5,0 L5,4 L1,4 L1,0 M3,6 L7,6 L7,10 L3,10 L3,6'
};

const TUIImageEditor: React.FC<TUIImageEditorProps> = ({ imageUrl, onSave, onClose }) => {
  const editorRef = useRef<any>(null);

  const handleSave = () => {
    if (editorRef.current) {
      const imageEditor = editorRef.current.getInstance();
      const canvas = imageEditor.toDataURL();
      onSave(canvas);
    }
  };

  const editorOptions = {
    includeUI: {
      loadImage: {
        path: imageUrl,
        name: 'SampleImage'
      },
      theme: {
        'common.bi.image': '',
        'common.bisize.width': '251px',
        'common.bisize.height': '21px',
        'common.backgroundImage': 'none',
        'common.backgroundColor': '#f3f4f6',
        'common.border': '1px solid #333',
        
        // header
        'header.backgroundImage': 'none',
        'header.backgroundColor': 'transparent',
        'header.border': '0px',
        
        // main icons
        'menu.normalIcon.color': '#8a8a8a',
        'menu.activeIcon.color': '#555555',
        'menu.disabledIcon.color': '#434343',
        'menu.hoverIcon.color': '#e9e9e9',
        'submenu.normalIcon.color': '#8a8a8a',
        'submenu.activeIcon.color': '#e9e9e9',
        
        'menu.iconSize.width': '24px',
        'menu.iconSize.height': '24px',
        'submenu.iconSize.width': '32px',
        'submenu.iconSize.height': '32px',
        
        // submenu primary color
        'submenu.backgroundColor': 'transparent',
        'submenu.partition.color': '#e5e5e5',
        
        // submenu labels
        'submenu.normalLabel.color': '#858585',
        'submenu.normalLabel.fontWeight': 'normal',
        'submenu.activeLabel.color': '#000',
        'submenu.activeLabel.fontWeight': 'normal',
        
        // checkbox style
        'checkbox.border': '1px solid #ccc',
        'checkbox.backgroundColor': '#fff',
        
        // rango style
        'range.pointer.color': '#333',
        'range.bar.color': '#ccc',
        'range.subbar.color': '#606060',
        
        'range.disabledPointer.color': '#d3d3d3',
        'range.disabledBar.color': 'rgba(85,85,85,0.06)',
        'range.disabledSubbar.color': 'rgba(51,51,51,0.2)',
        
        // colorpicker style
        'colorpicker.button.border': '1px solid #1e1e1e',
        'colorpicker.title.color': '#1e1e1e'
      },
      menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
      initMenu: 'filter',
      uiSize: {
        width: '100%',
        height: '600px'
      },
      menuBarPosition: 'bottom'
    },
    cssMaxWidth: 1000,
    cssMaxHeight: 600,
    usageStatistics: false
  };

  return (
    <div className="tui-image-editor-container">
      <div className="flex justify-between items-center mb-4 p-4 bg-white border-b">
        <h2 className="text-xl font-bold text-gray-800">Edit Photo</h2>
        <div className="space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
      
      <div className="editor-wrapper">
        <ImageEditor
          ref={editorRef}
          {...editorOptions}
        />
      </div>
      
      <style jsx>{`
        .tui-image-editor-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .editor-wrapper {
          background: #f8f9fa;
        }
        
        :global(.tui-image-editor-main) {
          background-color: #f8f9fa !important;
        }
        
        :global(.tui-image-editor-menu) {
          background-color: #ffffff !important;
          border-top: 1px solid #e5e7eb !important;
        }
        
        :global(.tui-image-editor-submenu) {
          background-color: #ffffff !important;
          border-right: 1px solid #e5e7eb !important;
        }
        
        :global(.tui-image-editor-header) {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default TUIImageEditor;
