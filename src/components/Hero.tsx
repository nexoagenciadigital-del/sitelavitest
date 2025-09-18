import React from 'react';
import { SiteSettings } from '../types';

interface HeroProps {
  siteSettings: SiteSettings | null;
}

const Hero: React.FC<HeroProps> = ({ siteSettings }) => {
  return (
    <section id="hero" className="relative bg-gradient-to-r from-purple-100 to-pink-100 py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4 animate-fade-in-up">
            {siteSettings?.hero_title || 'Roupas que fazem os pequenos brilharem'}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 animate-fade-in-up delay-200">
            {siteSettings?.hero_subtitle || 'Descubra nossa coleção exclusiva de roupas infantis. Conforto, estilo e qualidade para os momentos especiais dos seus pequenos.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-400">
            <a
              href={siteSettings?.button_links.verColecao || '#categorias'}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Ver Coleção
            </a>
            <a
              href={siteSettings?.button_links.ofertas || '#produtos'}
              className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-50 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Ver Ofertas
            </a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end animate-fade-in-right delay-600">
          <img
            src="https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Criança feliz com roupa LaviBaby"
            className="rounded-full w-64 h-64 md:w-96 md:h-96 object-cover shadow-xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
    </section>
  );
};

export default Hero;
