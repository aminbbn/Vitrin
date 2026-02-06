
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Plus, 
  Trash2, 
  Settings2, 
  Maximize2, 
  ZoomIn, 
  ZoomOut,
  GripVertical,
  Layers,
  Sparkles
} from 'lucide-react';
import { COMPONENT_LIBRARY } from '../constants';
import { ComponentItem } from '../types';

const CanvasDesigner: React.FC = () => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [zoom, setZoom] = useState(100);
  const [canvasElements, setCanvasElements] = useState<ComponentItem[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const addElement = (item: any) => {
    const newEl: ComponentItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: item.type,
      label: item.label,
      settings: {
        title: item.label,
        fontSize: 16,
        padding: 16,
        animation: 'fade'
      }
    };
    setCanvasElements([...canvasElements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const removeElement = (id: string) => {
    setCanvasElements(canvasElements.filter(el => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const selectedElement = canvasElements.find(el => el.id === selectedElementId);

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden select-none">
      {/* Right Sidebar: Library */}
      <div className="w-72 bg-white border-l border-slate-200 flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            اجزای منو
          </h3>
          <Layers className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {COMPONENT_LIBRARY.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cat.category}</span>
              <div className="grid grid-cols-2 gap-2">
                {cat.items.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => addElement(item)}
                    className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all group text-center gap-2"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500 group-hover:text-emerald-600 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-medium text-slate-600 group-hover:text-emerald-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Canvas */}
      <div className="flex-1 flex flex-col bg-slate-100 relative overflow-hidden">
        {/* Toolbar */}
        <div className="h-14 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-2 bg-slate-200/50 p-1 rounded-lg">
            <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded ${device === 'mobile' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}><Smartphone className="w-4 h-4" /></button>
            <button onClick={() => setDevice('tablet')} className={`p-1.5 rounded ${device === 'tablet' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}><Tablet className="w-4 h-4" /></button>
            <button onClick={() => setDevice('desktop')} className={`p-1.5 rounded ${device === 'desktop' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}><Monitor className="w-4 h-4" /></button>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom(Math.max(50, zoom - 10))}><ZoomOut className="w-4 h-4" /></button>
              <span className="w-10 text-center">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(200, zoom + 10))}><ZoomIn className="w-4 h-4" /></button>
            </div>
            <button className="flex items-center gap-1 hover:text-emerald-600"><Maximize2 className="w-4 h-4" /> تمام صفحه</button>
          </div>
        </div>

        {/* The Frame */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-12 perspective-1000">
          <motion.div 
            layout
            style={{ 
              width: device === 'mobile' ? 375 : device === 'tablet' ? 768 : '100%', 
              height: device === 'mobile' ? 812 : '100%',
              scale: zoom / 100,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            className="bg-white rounded-[3rem] border-[8px] border-slate-900 overflow-hidden relative group"
          >
            {/* Notch */}
            {device === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20" />
            )}

            {/* Grid Overlays */}
            <div className="absolute inset-0 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
              <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>

            {/* Canvas Content */}
            <div className="p-4 pt-10 h-full overflow-y-auto space-y-4">
              {canvasElements.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 opacity-30">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-bold">برای شروع، اجزای مورد نظر را از پنل سمت راست اضافه کنید</p>
                </div>
              ) : (
                canvasElements.map((el) => (
                  <motion.div 
                    key={el.id}
                    layoutId={el.id}
                    onClick={() => setSelectedElementId(el.id)}
                    className={`relative p-6 rounded-2xl cursor-pointer border-2 transition-all ${
                      selectedElementId === el.id ? 'border-emerald-500 bg-emerald-50/30' : 'border-transparent hover:border-emerald-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded shadow-sm border border-emerald-100">{el.label}</span>
                      <GripVertical className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="text-sm text-slate-700 font-medium">
                      {el.settings.title}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Left Sidebar: Property Inspector */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-slate-500" />
          <h3 className="font-bold text-slate-800">تنظیمات المان</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {selectedElement ? (
              <motion.div
                key={selectedElement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">عنوان المان</label>
                  <input 
                    type="text" 
                    value={selectedElement.settings.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, title: val }} : el));
                    }}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">رنگ برند</label>
                  <div className="flex gap-2">
                    {['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                      <button 
                        key={color}
                        style={{ backgroundColor: color }}
                        className={`w-8 h-8 rounded-full border-2 ${selectedElement.settings.color === color ? 'border-slate-800 scale-110' : 'border-transparent'} transition-transform`}
                        onClick={() => {
                          setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, color }} : el));
                        }}
                      />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer">
                      <Plus className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold text-slate-500">اندازه فونت</label>
                    <span className="text-xs text-slate-400">{selectedElement.settings.fontSize}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="12" 
                    max="48" 
                    value={selectedElement.settings.fontSize}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, fontSize: val }} : el));
                    }}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">انیمیشن ورود</label>
                  <select 
                    value={selectedElement.settings.animation}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, animation: val }} : el));
                    }}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="fade">محو شدن (Fade)</option>
                    <option value="slide">کشویی (Slide)</option>
                    <option value="bounce">جهشی (Bounce)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => removeElement(selectedElement.id)}
                    className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف المان
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                <Smartphone className="w-12 h-12 mb-4 text-slate-300" />
                <p className="text-sm">یک المان را برای ویرایش انتخاب کنید</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CanvasDesigner;
