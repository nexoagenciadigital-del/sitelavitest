import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    rating: 5,
    comment: "Produtos de excelente qualidade! Meu bebê adora os brinquedos educativos.",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Ana Costa",
    rating: 5,
    comment: "Atendimento excepcional e entrega super rápida. Recomendo muito!",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Carla Santos",
    rating: 5,
    comment: "Os produtos chegaram perfeitos e minha filha ficou encantada!",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Veja os depoimentos de mães que confiam na LaVi Baby
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Quote className="w-8 h-8 text-pink-200 absolute -top-2 -left-2" />
                <p className="text-gray-600 italic pl-6">
                  "{testimonial.comment}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const message = `Olá! Gostaria de deixar minha avaliação sobre os produtos da LaviBaby 👶⭐`;
              window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
            }}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            ⭐ Deixar Avaliação
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
