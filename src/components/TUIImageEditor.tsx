
import React, { useRef, useEffect, useState } from 'react';
import ImageEditor from '@toast-ui/react-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import { Save, X, Palette, Crop, RotateCw, Type, Square } from 'lucide-react';

interface TUIImageEditorProps {
  imageUrl: string;
  onSave: (editedImageData: string) => void;
  onClose: () => void;
}

const TUIImageEditor: React.FC<TUIImageEditorProps> = ({ imageUrl, onSave, onClose }) => {
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add loading delay to ensure proper initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (editorRef.current) {
      try {
        const imageEditor = editorRef.current.getInstance();
        const canvas = imageEditor.toDataURL();
        onSave(canvas);
      } catch (error) {
        console.error('Error saving image:', error);
      }
    }
  };

  // Calculate proper dimensions
  const editorHeight = window.innerHeight - 80; // Account for header
  const editorWidth = window.innerWidth;

  const editorOptions = {
    includeUI: {
      loadImage: {
        path: imageUrl,
        name: 'EditImage'
      },
      theme: {
        // Main background
        'common.bi.image': '',
        'common.bisize.width': '0px',
        'common.bisize.height': '0px',
        'common.backgroundImage': 'none',
        'common.backgroundColor': '#f8fafc',
        'common.border': '0px',
        
        // Header - hide default header
        'header.backgroundImage': 'none',
        'header.backgroundColor': 'transparent',
        'header.border': '0px',
        'header.display': 'none',
        
        // Main menu styling
        'menu.backgroundColor': '#ffffff',
        'menu.border': '1px solid #e2e8f0',
        'menu.normalIcon.color': '#64748b',
        'menu.activeIcon.color': '#3b82f6',
        'menu.disabledIcon.color': '#cbd5e1',
        'menu.hoverIcon.color': '#1e40af',
        'menu.iconSize.width': '28px',
        'menu.iconSize.height': '28px',
        
        // Submenu styling
        'submenu.backgroundColor': '#ffffff',
        'submenu.border': '1px solid #e2e8f0',
        'submenu.normalIcon.color': '#64748b',
        'submenu.activeIcon.color': '#3b82f6',
        'submenu.disabledIcon.color': '#cbd5e1',
        'submenu.hoverIcon.color': '#1e40af',
        'submenu.iconSize.width': '24px',
        'submenu.iconSize.height': '24px',
        'submenu.normalLabel.color': '#475569',
        'submenu.normalLabel.fontWeight': '500',
        'submenu.activeLabel.color': '#1e40af',
        'submenu.activeLabel.fontWeight': '600',
        'submenu.partition.color': '#e2e8f0',
        
        // Range/Slider styling
        'range.pointer.color': '#3b82f6',
        'range.bar.color': '#e2e8f0',
        'range.subbar.color': '#3b82f6',
        'range.disabledPointer.color': '#cbd5e1',
        'range.disabledBar.color': '#f1f5f9',
        'range.disabledSubbar.color': '#cbd5e1',
        
        // Checkbox styling
        'checkbox.border': '2px solid #3b82f6',
        'checkbox.backgroundColor': '#ffffff',
        
        // Color picker
        'colorpicker.button.border': '2px solid #3b82f6',
        'colorpicker.title.color': '#1e293b'
      },
      menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
      initMenu: 'crop',
      uiSize: {
        width: '100%',
        height: `${editorHeight}px`
      },
      menuBarPosition: 'bottom'
    },
    cssMaxWidth: editorWidth,
    cssMaxHeight: editorHeight,
    usageStatistics: false
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      {/* Custom Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <Palette className="w-6 h-6" />
          <h1 className="text-xl font-bold">Photo Editor</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Loading Editor...</p>
          </div>
        </div>
      )}

      {/* Editor Container */}
      <div className="editor-container" style={{ height: `${editorHeight}px` }}>
        <ImageEditor
          ref={editorRef}
          {...editorOptions}
        />
      </div>

      {/* Custom CSS Overrides */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Main container styling */
          .editor-container {
            background: #f8fafc;
            width: 100%;
            overflow: hidden;
          }
          
          /* Override TOAST UI main container */
          .tui-image-editor-main {
            background-color: #f8fafc !important;
            height: 100% !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          }
          
          /* Canvas container - make it fill available space */
          .tui-image-editor-canvas-container {
            background-color: #ffffff !important;
            height: calc(100% - 60px) !important;
            border: 2px solid #e2e8f0 !important;
            border-radius: 12px !important;
            margin: 10px !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          }
          
          /* Canvas styling */
          .lower-canvas, .upper-canvas {
            border-radius: 8px !important;
          }
          
          /* Menu bar styling */
          .tui-image-editor-menu {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
            border: none !important;
            border-top: 2px solid #e2e8f0 !important;
            padding: 8px 16px !important;
            box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          }
          
          /* Menu items */
          .tui-image-editor-item {
            margin: 0 4px !important;
            border-radius: 8px !important;
            transition: all 0.2s ease !important;
          }
          
          .tui-image-editor-item:hover {
            background-color: #f1f5f9 !important;
            transform: translateY(-1px) !important;
          }
          
          .tui-image-editor-item.active {
            background-color: #dbeafe !important;
            border: 2px solid #3b82f6 !important;
          }
          
          /* Submenu styling */
          .tui-image-editor-submenu {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
            border: 2px solid #e2e8f0 !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
            margin: 10px !important;
          }
          
          /* Submenu items */
          .tui-image-editor-submenu .tui-image-editor-item {
            border-radius: 6px !important;
            margin: 4px !important;
          }
          
          /* Range sliders */
          .tui-colorpicker-range {
            margin: 8px 0 !important;
          }
          
          .tie-range-wrap {
            background-color: #f1f5f9 !important;
            border-radius: 6px !important;
            padding: 4px !important;
          }
          
          /* Input fields */
          .tui-image-editor-range-wrap input,
          .tui-image-editor-submenu input {
            border: 2px solid #e2e8f0 !important;
            border-radius: 6px !important;
            padding: 6px 10px !important;
            font-size: 14px !important;
            transition: border-color 0.2s ease !important;
          }
          
          .tui-image-editor-range-wrap input:focus,
          .tui-image-editor-submenu input:focus {
            border-color: #3b82f6 !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          
          /* Buttons */
          .tui-image-editor-button {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 8px 16px !important;
            font-weight: 600 !important;
            transition: all 0.2s ease !important;
            cursor: pointer !important;
          }
          
          .tui-image-editor-button:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          }
          
          /* Color picker */
          .tui-colorpicker-palette-hex,
          .tui-colorpicker-palette-rgb {
            border: 2px solid #e2e8f0 !important;
            border-radius: 6px !important;
          }
          
          .tui-colorpicker-palette-preview {
            border-radius: 6px !important;
            border: 2px solid #e2e8f0 !important;
          }
          
          /* Hide default header completely */
          .tui-image-editor-header {
            display: none !important;
          }
          
          /* Loading state */
          .tui-image-editor-wrap.tui-image-editor-wrap-loading {
            background-color: #f8fafc !important;
          }
          
          /* Partition lines */
          .tui-image-editor-partition {
            background-color: #e2e8f0 !important;
          }
          
          /* Labels */
          .tui-image-editor-submenu label {
            color: #374151 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }
          
          /* Scrollbars */
          .tui-image-editor-submenu::-webkit-scrollbar {
            width: 6px !important;
          }
          
          .tui-image-editor-submenu::-webkit-scrollbar-track {
            background: #f1f5f9 !important;
            border-radius: 3px !important;
          }
          
          .tui-image-editor-submenu::-webkit-scrollbar-thumb {
            background: #cbd5e1 !important;
            border-radius: 3px !important;
          }
          
          .tui-image-editor-submenu::-webkit-scrollbar-thumb:hover {
            background: #94a3b8 !important;
          }
        `
      }} />
    </div>
  );
};

export default TUIImageEditor;
