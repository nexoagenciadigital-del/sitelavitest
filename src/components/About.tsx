import React from 'react';
import { SiteSettings } from '../types';

interface AboutProps {
  siteSettings: SiteSettings | null;
}

const About: React.FC<AboutProps> = ({ siteSettings }) => {
  return (
    <section id="sobre" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img
              src="https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Sobre LaviBaby"
              className="rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
              {siteSettings?.about_title || 'Por que escolher a LaviBaby?'}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {siteSettings?.about_description || 'Somos uma loja especializada em roupas infantis que combina estilo, conforto e qualidade. Nossa missão é fazer com que cada criança se sinta especial e confiante.'}
            </p>
            <ul className="space-y-4 text-left text-gray-800 text-lg">
              <li className="flex items-center">
                <span className="text-indigo-600 mr-3 text-2xl">✓</span> Roupas de alta qualidade e durabilidade
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 mr-3 text-2xl">✓</span> Designs exclusivos e modernos
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 mr-3 text-2xl">✓</span> Conforto e segurança para os pequenos
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 mr-3 text-2xl">✓</span> Atendimento personalizado
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
