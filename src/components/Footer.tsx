import React from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Clock, Whatsapp } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  siteSettings: SiteSettings | null;
}

const Footer: React.FC<FooterProps> = ({ siteSettings }) => {
  return (
    <footer id="contato" className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-2xl font-bold text-white mb-4">{siteSettings?.company_name || 'LaviBaby'}</h3>
          <p className="text-sm mb-4">
            {siteSettings?.about_description || 'Sua loja online de roupas infantis com estilo, conforto e qualidade.'}
          </p>
          <div className="flex space-x-4">
            {siteSettings?.instagram && (
              <a href={`https://instagram.com/${siteSettings.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
                <Instagram size={24} />
              </a>
            )}
            {siteSettings?.facebook && (
              <a href={`https://facebook.com/${siteSettings.facebook}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
                <Facebook size={24} />
              </a>
            )}
            {siteSettings?.twitter && (
              <a href={`https://twitter.com/${siteSettings.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
                <Twitter size={24} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Links Rápidos</h3>
          <ul className="space-y-2">
            <li><a href="#hero" className="hover:text-white transition duration-300">Início</a></li>
            <li><a href="#categorias" className="hover:text-white transition duration-300">Categorias</a></li>
            <li><a href="#produtos" className="hover:text-white transition duration-300">Produtos</a></li>
            <li><a href="#sobre" className="hover:text-white transition duration-300">Sobre Nós</a></li>
            <li><a href="#contato" className="hover:text-white transition duration-300">Contato</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contato</h3>
          <ul className="space-y-2">
            {siteSettings?.phone && (
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-indigo-400" /> {siteSettings.phone}
              </li>
            )}
            {siteSettings?.email && (
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-indigo-400" /> {siteSettings.email}
              </li>
            )}
            {siteSettings?.address && (
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-indigo-400 mt-1" /> {siteSettings.address}
              </li>
            )}
            {siteSettings?.working_hours && (
              <li className="flex items-center">
                <Clock size={18} className="mr-2 text-indigo-400" /> {siteSettings.working_hours}
              </li>
            )}
            {siteSettings?.whatsapp && (
              <li className="flex items-center">
                <Whatsapp size={18} className="mr-2 text-indigo-400" /> <a href={`https://wa.me/${siteSettings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-300">Fale Conosco</a>
              </li>
            )}
          </ul>
        </div>

        {/* Newsletter / App Download */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Fique Conectado</h3>
          <p className="text-sm mb-4">Receba novidades e ofertas exclusivas.</p>
          <a
            href={siteSettings?.button_links.queroDesconto || '#newsletter'}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300 font-semibold block text-center mb-4"
          >
            Assinar Newsletter
          </a>
          <p className="text-sm mb-2">Baixe nosso App:</p>
          <div className="flex space-x-2">
            <a href={siteSettings?.button_links.baixarApp || '#'} target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="App Store" className="h-10" />
            </a>
            <a href={siteSettings?.button_links.baixarApp || '#'} target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" className="h-10" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} {siteSettings?.company_name || 'LaviBaby'}. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
