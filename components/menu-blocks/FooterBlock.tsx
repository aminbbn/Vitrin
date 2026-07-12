import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import { ComponentItem } from '../../types';

interface FooterBlockProps {
  element?: ComponentItem;
  brandColor: string;
  mode: 'edit' | 'live';
  isSelected?: boolean;
  onClick?: () => void;
}

export const FooterBlock: React.FC<FooterBlockProps> = ({
  element,
  brandColor,
  mode,
  isSelected = false,
  onClick,
}) => {
  const settings = element?.settings || {};
  const isEdit = mode === 'edit';

  const containerClasses = isEdit
    ? `relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all border-2 bg-white ${
        isSelected
          ? `border-${brandColor}-500 ring-4 ring-${brandColor}-500/10`
          : `border-transparent hover:border-${brandColor}-200`
      }`
    : 'px-8 py-8 text-center border-t border-slate-200 mt-6 bg-white rounded-t-[2.5rem]';

  return (
    <div onClick={onClick} className={isEdit
      ? `relative w-full rounded-[2.5rem] overflow-hidden cursor-pointer transition-all border-2 ${
          isSelected
            ? `border-${brandColor}-500 ring-4 ring-${brandColor}-500/10`
            : `border-transparent hover:border-${brandColor}-200`
        } bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800`
      : 'px-8 py-8 text-center border-t border-slate-200 dark:border-slate-800 mt-6 bg-white dark:bg-slate-900 rounded-t-[2.5rem] transition-colors duration-300'
    }>
      <div className="px-6 py-6 text-center bg-white dark:bg-slate-900 transition-colors duration-300">
        <h4 
          style={{ color: settings.color, fontSize: settings.fontSize ? `${settings.fontSize}px` : undefined }}
          className="text-xs font-black mb-4 text-slate-500 dark:text-slate-400"
        >
          {settings.title || 'اطلاعات تماس'}
        </h4>
        <div className="flex justify-center gap-4 mb-4" dir="rtl">
          {settings.phone && (
            <div
              className={`w-10 h-10 rounded-full bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400 flex items-center justify-center text-[10px] font-bold transition-colors`}
            >
              <Phone className="w-4 h-4" />
            </div>
          )}
          {settings.address && (
            <div
              className={`w-10 h-10 rounded-full bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400 flex items-center justify-center text-[10px] font-bold transition-colors`}
            >
              <MapPin className="w-4 h-4" />
            </div>
          )}
          {settings.showInstagram && (
            <div
              className={`w-10 h-10 rounded-full bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400 flex items-center justify-center text-[10px] font-bold transition-colors`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
          )}
          {settings.showTwitter && (
            <div
              className={`w-10 h-10 rounded-full bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400 flex items-center justify-center text-[10px] font-bold transition-colors`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
          )}
          {settings.showWhatsapp && (
            <div
              className={`w-10 h-10 rounded-full bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400 flex items-center justify-center text-[10px] font-bold transition-colors`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 00-3.48-8.413z" />
              </svg>
            </div>
          )}
        </div>
        {settings.customText && (
          <p 
            style={{ color: settings.color }}
            className={`font-bold mb-2 transition-colors duration-300 ${isEdit ? 'text-[10px] text-slate-500 dark:text-slate-400' : 'text-xs text-slate-500 dark:text-slate-400'}`}
          >
            {settings.customText}
          </p>
        )}
      </div>
    </div>
  );
};
