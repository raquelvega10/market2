import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle, Users } from 'lucide-react';
import { SiteSettings, SocialMedia } from '../lib/supabase';

interface FooterProps {
  siteSettings: SiteSettings[];
  socialMedia: SocialMedia[];
}

export function Footer({ siteSettings, socialMedia }: FooterProps) {
  const getSettingValue = (name: string) => {
    return siteSettings.find(s => s.nombre.toLowerCase() === name.toLowerCase())?.valor || '';
  };

  const getSocialLink = (name: string) => {
    return socialMedia.find(s => s.nombre.toLowerCase() === name.toLowerCase())?.link || '#';
  };

  const email = getSettingValue('email') || 'info@rmoneyglobal.com';
  const telefono = getSettingValue('telefono') || '+17868830056';
  const direccion = getSettingValue('direccion') || '7155 Rue Notre Dame 4\nMiami Beach, FL 33141';
  const horario = getSettingValue('horario') || 'Lun - Vie: 9:00 AM - 6:00 PM\nSáb: 9:00 AM - 2:00 PM\nDom: Cerrado';

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo png.png"
                alt="RMoney Market"
                className="h-12 w-auto bg-white rounded-lg p-2"
              />
              <div>
                <h3 className="text-xl font-bold">RMoney Market</h3>
                <p className="text-sm text-gray-300">Tienda Online</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tu tienda online de confianza en Cuba. Productos de calidad con pago seguro en USD y entrega garantizada en todo el país.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-green" />
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-brand-green flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-brand-green flex-shrink-0" />
                <a href={`tel:${telefono}`} className="hover:text-white transition-colors">
                  {telefono}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-green flex-shrink-0" />
                <span className="whitespace-pre-line">{direccion}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-green" />
              Horario
            </h4>
            <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
              {horario}
            </p>
            <div className="mt-6">
              <h4 className="text-lg font-bold mb-3">Métodos de Pago</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/10 rounded text-xs">PayPal</span>
                <span className="px-3 py-1 bg-white/10 rounded text-xs">Tarjeta</span>
                <span className="px-3 py-1 bg-white/10 rounded text-xs">Transferencia</span>
                <span className="px-3 py-1 bg-white/10 rounded text-xs">Efectivo</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Síguenos</h4>
            <div className="flex flex-col gap-3">
              <a
                href={getSocialLink('facebook')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg hover:bg-brand-green hover:bg-opacity-20 transition-all"
              >
                <Facebook className="w-5 h-5 text-brand-green" />
                <span className="text-sm font-medium">Facebook</span>
              </a>
              <a
                href={getSocialLink('instagram')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg hover:bg-brand-green hover:bg-opacity-20 transition-all"
              >
                <Instagram className="w-5 h-5 text-brand-green" />
                <span className="text-sm font-medium">Instagram</span>
              </a>
              <a
                href={getSocialLink('whatsapp')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg hover:bg-brand-green hover:bg-opacity-20 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-brand-green" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
              <a
                href={getSocialLink('whatsapp_group')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg hover:bg-brand-green hover:bg-opacity-20 transition-all"
              >
                <Users className="w-5 h-5 text-brand-green" />
                <span className="text-sm font-medium">Grupo WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} RMoney Market. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
              <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
