
import React, { useRef, useEffect, useState } from 'react';
import ImageEditor from '@toast-ui/react-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import { Save, X, Palette, Crop, RotateCw, Type, Square, Brush, Eraser, Filter, FlipHorizontal, MousePointer, Shapes, Image as ImageIcon } from 'lucide-react';

interface TUIImageEditorProps {
  imageUrl: string;
  onSave: (editedImageData: string) => void;
  onClose: () => void;
}

const TUIImageEditor: React.FC<TUIImageEditorProps> = ({ imageUrl, onSave, onClose }) => {
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('crop');
  const [editorInstance, setEditorInstance] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (editorRef.current) {
        const instance = editorRef.current.getInstance();
        setEditorInstance(instance);
        console.log('Editor instance ready:', instance);
      }
    }, 2000); // Increased delay to ensure editor is fully loaded
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (editorInstance) {
      try {
        const canvas = editorInstance.toDataURL();
        onSave(canvas);
      } catch (error) {
        console.error('Error saving image:', error);
      }
    }
  };

  const handleMenuClick = (menuType: string) => {
    console.log('Menu clicked:', menuType);
    setActiveMenu(menuType);
    
    if (editorInstance) {
      try {
        // Clear any active selections first
        editorInstance.clearUndoStack();
        editorInstance.clearRedoStack();
        
        // Activate the selected tool based on menu type
        switch (menuType) {
          case 'crop':
            editorInstance.startDrawingMode('CROPPER');
            break;
          case 'draw':
            editorInstance.startDrawingMode('FREE_DRAWING');
            break;
          case 'shape':
            editorInstance.startDrawingMode('SHAPE');
            break;
          case 'text':
            editorInstance.startDrawingMode('TEXT');
            break;
          case 'rotate':
            editorInstance.rotate(90);
            break;
          case 'flip':
            editorInstance.flipX();
            break;
          case 'filter':
            // Apply a sample filter
            editorInstance.applyFilter('blur', { blur: 0.1 });
            break;
          case 'mask':
            editorInstance.startDrawingMode('FREE_DRAWING');
            editorInstance.setBrush({
              width: 20,
              color: 'rgba(255,255,255,0.8)'
            });
            break;
          default:
            editorInstance.stopDrawingMode();
            break;
        }
        console.log('Tool activated:', menuType);
      } catch (error) {
        console.error('Error activating tool:', error);
      }
    } else {
      console.log('Editor instance not ready yet');
    }
  };

  const headerHeight = 80;
  const sidebarWidth = 280;
  const editorHeight = window.innerHeight - headerHeight;
  const editorWidth = window.innerWidth - sidebarWidth;

  const menuItems = [
    { id: 'crop', label: 'Crop', icon: Crop, color: 'text-green-600' },
    { id: 'flip', label: 'Flip', icon: FlipHorizontal, color: 'text-blue-600' },
    { id: 'rotate', label: 'Rotate', icon: RotateCw, color: 'text-purple-600' },
    { id: 'draw', label: 'Draw', icon: Brush, color: 'text-red-600' },
    { id: 'shape', label: 'Shapes', icon: Shapes, color: 'text-orange-600' },
    { id: 'icon', label: 'Icons', icon: ImageIcon, color: 'text-pink-600' },
    { id: 'text', label: 'Text', icon: Type, color: 'text-indigo-600' },
    { id: 'mask', label: 'Mask', icon: Eraser, color: 'text-gray-600' },
    { id: 'filter', label: 'Filter', icon: Filter, color: 'text-yellow-600' }
  ];

  const editorOptions = {
    includeUI: {
      loadImage: {
        path: imageUrl,
        name: 'EditImage'
      },
      theme: {
        'common.bi.image': '',
        'common.bisize.width': '0px',
        'common.bisize.height': '0px',
        'common.backgroundImage': 'none',
        'common.backgroundColor': '#f8fafc',
        'common.border': '0px',
        'header.display': 'none',
        'menu.display': 'none'
      },
      menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
      initMenu: 'crop',
      uiSize: {
        width: `${editorWidth}px`,
        height: `${editorHeight}px`
      },
      menuBarPosition: 'bottom'
    },
    cssMaxWidth: editorWidth,
    cssMaxHeight: editorHeight,
    usageStatistics: false
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden" style={{ height: '100vh' }}>
      {/* Custom Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" style={{ height: `${headerHeight}px` }}>
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

      <div className="flex" style={{ height: `${editorHeight}px` }}>
        {/* Editor Container */}
        <div className="flex-1 relative" style={{ width: `${editorWidth}px` }}>
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Loading Editor...</p>
              </div>
            </div>
          )}

          <div className="editor-container" style={{ height: '100%', width: '100%' }}>
            <ImageEditor
              ref={editorRef}
              {...editorOptions}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="bg-white border-l border-gray-200 shadow-lg" style={{ width: `${sidebarWidth}px` }}>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Editing Tools</h3>
            
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeMenu === item.id
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${activeMenu === item.id ? 'text-blue-600' : item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Tips</h4>
              <p className="text-xs text-gray-600">
                Select a tool from above to start editing your photo. Use the canvas to make adjustments.
              </p>
            </div>

            {/* Tool Instructions */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Tool Guide</h4>
              <div className="text-xs text-gray-600 space-y-1">
                {activeMenu === 'crop' && <p>Click and drag on the image to select crop area</p>}
                {activeMenu === 'draw' && <p>Click and drag to draw freely on the image</p>}
                {activeMenu === 'text' && <p>Click on the image to add text</p>}
                {activeMenu === 'shape' && <p>Select from various shapes to add</p>}
                {activeMenu === 'rotate' && <p>Click to rotate image 90 degrees</p>}
                {activeMenu === 'flip' && <p>Click to flip image horizontally</p>}
                {activeMenu === 'filter' && <p>Apply various filters to enhance your image</p>}
                {activeMenu === 'mask' && <p>Use eraser tool to mask parts of the image</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Overrides */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .editor-container {
            background: #f8fafc;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          .tui-image-editor-main {
            background-color: #f8fafc !important;
            height: 100% !important;
            width: 100% !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          }
          
          /* Canvas container - reduced size by 25% */
          .tui-image-editor-canvas-container {
            background-color: #ffffff !important;
            height: calc(75% - 40px) !important;
            width: calc(75% - 40px) !important;
            border: 2px solid #e2e8f0 !important;
            border-radius: 12px !important;
            margin: 20px auto !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          .lower-canvas, .upper-canvas {
            border-radius: 8px !important;
            max-height: 100% !important;
            max-width: 100% !important;
          }
          
          /* Hide default menu */
          .tui-image-editor-menu {
            display: none !important;
          }
          
          /* Hide default submenu */
          .tui-image-editor-submenu {
            display: none !important;
          }
          
          /* Hide default header */
          .tui-image-editor-header {
            display: none !important;
          }
          
          .tui-image-editor-wrap {
            height: 100% !important;
            width: 100% !important;
          }
          
          /* Center the canvas */
          .tui-image-editor-main-container {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 100% !important;
          }
          
          /* Hide default controls that might interfere */
          .tui-image-editor-controls {
            display: none !important;
          }
          
          .tui-image-editor-controls-buttons {
            display: none !important;
          }
          
          /* Style the canvas area */
          .tui-image-editor-canvas {
            border-radius: 8px !important;
          }
        `
      }} />
    </div>
  );
};

export default TUIImageEditor;
