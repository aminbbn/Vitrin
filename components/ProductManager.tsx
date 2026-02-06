
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  MoveRight, 
  Image as ImageIcon, 
  ChevronDown, 
  Info,
  DollarSign,
  Layers,
  Pizza
} from 'lucide-react';
import { Product } from '../types';

const ProductManager: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    id: '1',
    name: 'پیتزا پپرونی',
    description: 'پیتزای کلاسیک با پپرونی تند، پنیر موزارلا و سس گوجه‌فرنگی مخصوص',
    price: 245000,
    image: 'https://picsum.photos/400/300',
    modifiers: [
      {
        id: 'm1',
        name: 'سایز پیتزا',
        type: 'mandatory',
        options: [
          { id: 'o1', name: 'کوچک', price: 0 },
          { id: 'o2', name: 'متوسط', price: 50000 },
          { id: 'o3', name: 'بزرگ', price: 100000 },
        ]
      },
      {
        id: 'm2',
        name: 'نوع خمیر',
        type: 'mandatory',
        options: [
          { id: 'o4', name: 'خمیر نازک (ایتالیایی)', price: 0 },
          { id: 'o5', name: 'خمیر ضخیم (آمریکایی)', price: 15000 },
        ]
      },
      {
        id: 'm3',
        name: 'افزودنی‌ها',
        type: 'optional',
        options: [
          { id: 'o6', name: 'پنیر اضافه', price: 35000 },
          { id: 'o7', name: 'قارچ تازه', price: 20000 },
          { id: 'o8', name: 'زیتون سیاه', price: 15000 },
        ]
      }
    ]
  });

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumbs & Title */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <span>محصولات</span>
              <MoveRight className="w-3 h-3" />
              <span>پیتزاها</span>
              <MoveRight className="w-3 h-3" />
              <span className="text-emerald-600 font-medium">پیتزا پپرونی</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">مدیریت محصول</h1>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">انصراف</button>
            <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">ذخیره محصول</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Pizza className="w-5 h-5 text-emerald-600" />
                اطلاعات اصلی
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-slate-600">نام محصول</label>
                  <input 
                    type="text" 
                    value={product.name}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-slate-600">قیمت پایه (تومان)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={product.price}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all pl-10"
                    />
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-bold text-slate-600">توضیحات کوتاه</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >{product.description}</textarea>
                </div>
              </div>
            </div>

            {/* Modifiers Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  گروه‌های اصلاح‌کننده (Modifiers)
                </h2>
                <button className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-100 transition-colors">
                  <Plus className="w-4 h-4" /> افزودن گروه
                </button>
              </div>

              <div className="space-y-6">
                {product.modifiers.map((group) => (
                  <motion.div 
                    key={group.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 relative group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                        <h3 className="font-bold text-slate-700">{group.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${group.type === 'mandatory' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                          {group.type === 'mandatory' ? 'اجباری' : 'اختیاری'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.options.map((opt) => (
                        <div key={opt.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-emerald-200 transition-colors shadow-sm">
                          <span className="text-sm font-medium text-slate-700">{opt.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">+{opt.price.toLocaleString()} تومان</span>
                            <button className="p-1.5 text-slate-300 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ))}
                      <button className="p-4 border border-dashed border-slate-300 rounded-xl text-slate-400 text-sm flex items-center justify-center gap-2 hover:bg-white hover:text-emerald-600 hover:border-emerald-300 transition-all">
                        <Plus className="w-4 h-4" /> افزودن گزینه جدید
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Media & Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                تصویر محصول
              </h2>
              <div className="aspect-video bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-xs font-bold text-slate-500">آپلود تصویر جدید</p>
                <p className="text-[10px] text-slate-400 mt-1">فرمت‌های مجاز: PNG, JPG (حداکثر ۵ مگابایت)</p>
              </div>
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-2xl shadow-sm border border-slate-100" />
            </div>

            <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <h2 className="text-lg font-bold flex items-center gap-2 relative z-10">
                <Info className="w-5 h-5" />
                نکته سیستم
              </h2>
              <p className="text-sm leading-relaxed text-emerald-100 opacity-80 relative z-10">
                استفاده از گروه‌های اصلاح‌کننده می‌تواند تا ۲۰٪ میانگین فاکتورهای شما را افزایش دهد. پیشنهاد می‌شود افزودنی‌های پرطرفدار را در گروه‌های اختیاری قرار دهید.
              </p>
              <button className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 rounded-xl text-xs font-bold transition-colors relative z-10">مشاهده راهنمای بهینه‌سازی</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
