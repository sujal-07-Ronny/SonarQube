import React from "react";

const Testimonials = () => {
  // Testimonials data with Indian names, AI-generated images, descriptions, and five-star ratings
  const testimonialsData = [
    {
      name: "Rahul Sharma",
      role: "Software Engineer",
      image: "https://i.pravatar.cc/150?img=12", // AI-generated Indian face
      stars: 5,
      text: "The service was exceptional! I loved how easy it was to use the platform. Highly recommended!",
      feedback: "Will definitely use it again.",
    },
    {
      name: "Priya Patel",
      role: "Graphic Designer",
      image: "https://i.pravatar.cc/150?img=45", // AI-generated Indian woman
      stars: 5,
      text: "Amazing experience! The team was very supportive, and the results exceeded my expectations.",
      feedback: "Great value for money.",
    },
    {
      name: "Shivani Singh",
      role: "Entrepreneur",
      image: "https://i.pravatar.cc/150?img=21", // AI-generated Indian man
      stars: 5,
      text: "Fantastic platform! It helped me grow my business efficiently. The customer support is top-notch.",
      feedback: "Highly satisfied with the service.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Heading Section */}
        <div className="flex flex-col items-center mb-16">
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800 relative z-10">
              Customer Testimonials
            </h1>
            <div className="absolute -bottom-3 left-0 right-0 h-3 bg-blue-200 opacity-50 rounded-full transform -rotate-1"></div>
          </div>
          <p className="text-gray-600 text-xl max-w-xl text-center">
            Discover what our customers have to say about their experience
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden"
            >
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -mr-12 -mt-12 z-0"></div>
              
              {/* Quote Icon */}
              <div className="text-blue-500 text-4xl absolute top-4 right-4 opacity-20">❝</div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="mr-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="rounded-full w-16 h-16 object-cover border-2 border-blue-100 shadow-md"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{testimonial.name}</h2>
                  <p className="text-blue-600 font-medium">{testimonial.role}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex mb-6">
                {Array.from({ length: testimonial.stars }).map((_, index) => (
                  <span key={index} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-4 italic relative z-10">"{testimonial.text}"</p>

              {/* Additional Feedback */}
              <p className="text-gray-500 text-sm mt-4 pt-4 border-t border-gray-100">
                {testimonial.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
