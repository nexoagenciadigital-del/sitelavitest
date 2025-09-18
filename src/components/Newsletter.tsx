import React, { useState } from 'react';
import { SiteSettings } from '../types';

interface NewsletterProps {
  siteSettings: SiteSettings | null;
}

const Newsletter: React.FC<NewsletterProps> = ({ siteSettings }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (email) {
      // Aqui você integraria com um serviço de newsletter (ex: Mailchimp, SendGrid, Supabase Functions)
      console.log('Email para newsletter:', email);
      setMessage('Obrigado por se inscrever! Fique de olho em sua caixa de entrada.');
      setEmail('');
    } else {
      setMessage('Por favor, insira um email válido.');
    }
  };

  return (
    <section id="newsletter" className="py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Receba {siteSettings?.discount_percentage || 20}% de Desconto na Primeira Compra!
        </h2>
        <p className="text-xl mb-8">
          Assine nossa newsletter e fique por dentro das novidades e promoções exclusivas.
        </p>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Digite seu melhor e-mail"
            className="flex-grow p-4 rounded-lg border-2 border-white bg-white bg-opacity-20 placeholder-white focus:outline-none focus:ring-2 focus:ring-white text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-white text-pink-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Quero Meu Desconto!
          </button>
        </form>
        {message && <p className="mt-4 text-lg">{message}</p>}
      </div>
    </section>
  );
};

export default Newsletter;
