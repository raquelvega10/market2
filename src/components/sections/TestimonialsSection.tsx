import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'María González',
      location: 'Miami, USA',
      text: 'Excelente servicio. Mis padres en Cuba recibieron todo en perfectas condiciones. ¡Muy recomendado!',
      rating: 5
    },
    {
      name: 'Carlos Rodríguez',
      location: 'Madrid, España',
      text: 'La mejor forma de ayudar a mi familia en Cuba. Proceso sencillo y entregas rápidas.',
      rating: 5
    },
    {
      name: 'Ana Martínez',
      location: 'México DF, México',
      text: 'Gracias por hacer posible que mi abuela reciba sus productos. Servicio confiable y profesional.',
      rating: 5
    }
  ];

  return (
    <section id="testimonios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Miles de familias confían en nosotros para enviar productos a Cuba
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 relative">
              <Quote className="absolute top-4 right-4 w-12 h-12 text-brand-green opacity-20" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[rgb(0,204,51)] text-brand-green" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">&quot;{testimonial.text}&quot;</p>
              <div>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
