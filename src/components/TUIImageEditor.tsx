
import React, { useRef, useEffect, useState } from 'react';
import ImageEditor from '@toast-ui/react-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import { Save, X, Palette, Crop, RotateCw, Type, Brush, Eraser, Filter, FlipHorizontal, Shapes, ChevronLeft } from 'lucide-react';

interface TUIImageEditorProps {
  imageUrl: string;
  onSave: (editedImageData: string) => void;
  onClose: () => void;
}

const TUIImageEditor: React.FC<TUIImageEditorProps> = ({ imageUrl, onSave, onClose }) => {
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('crop');
  const [showSubOptions, setShowSubOptions] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (editorRef.current) {
        const instance = editorRef.current.getInstance();
        setEditorInstance(instance);
        console.log('Editor instance ready:', instance);
      }
    }, 2000);
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
    setShowSubOptions(['filter', 'shape', 'text', 'draw'].includes(menuType));
    
    if (editorInstance) {
      try {
        switch (menuType) {
          case 'crop':
            editorInstance.startDrawingMode('CROPPER');
            break;
          case 'draw':
            editorInstance.startDrawingMode('FREE_DRAWING');
            editorInstance.setBrush({
              width: 5,
              color: '#ff0000'
            });
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
          default:
            editorInstance.stopDrawingMode();
            break;
        }
        console.log('Tool activated:', menuType);
      } catch (error) {
        console.error('Error activating tool:', error);
      }
    }
  };

  const handleSubOptionClick = (option: string, value: any) => {
    if (!editorInstance) return;

    try {
      switch (activeMenu) {
        case 'filter':
          switch (option) {
            case 'blur':
              editorInstance.applyFilter('blur', { blur: 0.1 });
              break;
            case 'sharpen':
              editorInstance.applyFilter('sharpen');
              break;
            case 'vintage':
              editorInstance.applyFilter('vintage');
              break;
            case 'sepia':
              editorInstance.applyFilter('sepia');
              break;
            case 'grayscale':
              editorInstance.applyFilter('grayscale');
              break;
            case 'invert':
              editorInstance.applyFilter('invert');
              break;
            case 'brightness':
              editorInstance.applyFilter('brightness', { brightness: value });
              break;
            case 'contrast':
              editorInstance.applyFilter('contrast', { contrast: value });
              break;
          }
          break;
        case 'shape':
          editorInstance.startDrawingMode('SHAPE');
          switch (option) {
            case 'rect':
              editorInstance.setDrawingShape('rect');
              break;
            case 'circle':
              editorInstance.setDrawingShape('circle');
              break;
            case 'triangle':
              editorInstance.setDrawingShape('triangle');
              break;
          }
          break;
        case 'text':
          editorInstance.startDrawingMode('TEXT');
          if (option === 'size') {
            editorInstance.changeTextStyle({
              fontSize: value
            });
          } else if (option === 'color') {
            editorInstance.changeTextStyle({
              fill: value
            });
          }
          break;
        case 'draw':
          editorInstance.startDrawingMode('FREE_DRAWING');
          if (option === 'width') {
            editorInstance.setBrush({
              width: value
            });
          } else if (option === 'color') {
            editorInstance.setBrush({
              color: value
            });
          }
          break;
      }
    } catch (error) {
      console.error('Error applying sub-option:', error);
    }
  };

  const headerHeight = 80;
  const sidebarWidth = 320;
  const editorHeight = window.innerHeight - headerHeight;
  const editorWidth = window.innerWidth - sidebarWidth;

  const menuItems = [
    { id: 'crop', label: 'Crop', icon: Crop, color: 'text-green-600' },
    { id: 'flip', label: 'Flip', icon: FlipHorizontal, color: 'text-blue-600' },
    { id: 'rotate', label: 'Rotate', icon: RotateCw, color: 'text-purple-600' },
    { id: 'draw', label: 'Draw', icon: Brush, color: 'text-red-600' },
    { id: 'shape', label: 'Shapes', icon: Shapes, color: 'text-orange-600' },
    { id: 'text', label: 'Text', icon: Type, color: 'text-indigo-600' },
    { id: 'filter', label: 'Filter', icon: Filter, color: 'text-yellow-600' }
  ];

  const filterOptions = [
    { id: 'blur', label: 'Blur' },
    { id: 'sharpen', label: 'Sharpen' },
    { id: 'vintage', label: 'Vintage' },
    { id: 'sepia', label: 'Sepia' },
    { id: 'grayscale', label: 'Grayscale' },
    { id: 'invert', label: 'Invert' }
  ];

  const shapeOptions = [
    { id: 'rect', label: 'Rectangle' },
    { id: 'circle', label: 'Circle' },
    { id: 'triangle', label: 'Triangle' }
  ];

  const drawColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'];
  const textColors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00'];

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
      menu: [],
      uiSize: {
        width: `${editorWidth}px`,
        height: `${editorHeight}px`
      }
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
        <div className="bg-white border-l border-gray-200 shadow-lg overflow-y-auto" style={{ width: `${sidebarWidth}px` }}>
          <div className="p-4">
            {!showSubOptions ? (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Editing Tools</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`aspect-square flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 ${
                        activeMenu === item.id && !showSubOptions
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <item.icon className={`w-6 h-6 mb-2 ${activeMenu === item.id && !showSubOptions ? 'text-blue-600' : item.color}`} />
                      <span className="text-sm font-medium text-center">{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Tips</h4>
                  <p className="text-xs text-gray-600">
                    Select a tool from above to start editing your photo. Use the canvas to make adjustments.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => setShowSubOptions(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg mr-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 capitalize">{activeMenu} Options</h3>
                </div>

                {/* Filter Sub-options */}
                {activeMenu === 'filter' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {filterOptions.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => handleSubOptionClick(filter.id, null)}
                          className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Brightness</label>
                        <input
                          type="range"
                          min="-1"
                          max="1"
                          step="0.1"
                          defaultValue="0"
                          onChange={(e) => handleSubOptionClick('brightness', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Contrast</label>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          step="1"
                          defaultValue="0"
                          onChange={(e) => handleSubOptionClick('contrast', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Shape Sub-options */}
                {activeMenu === 'shape' && (
                  <div className="grid grid-cols-2 gap-2">
                    {shapeOptions.map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => handleSubOptionClick(shape.id, null)}
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        {shape.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Draw Sub-options */}
                {activeMenu === 'draw' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Brush Size</label>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        defaultValue="5"
                        onChange={(e) => handleSubOptionClick('width', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Color</label>
                      <div className="grid grid-cols-4 gap-2">
                        {drawColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleSubOptionClick('color', color)}
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Text Sub-options */}
                {activeMenu === 'text' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Font Size</label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        defaultValue="24"
                        onChange={(e) => handleSubOptionClick('size', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Text Color</label>
                      <div className="grid grid-cols-3 gap-2">
                        {textColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleSubOptionClick('color', color)}
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
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
