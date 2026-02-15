import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Booking & Payment",
      questions: [
        {
          q: "How do I book an event?",
          a: "Click on any event in the calendar, then click the 'Book Now' button. Fill out the booking form with your details and submit. You'll receive a confirmation email within 24 hours."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept credit cards, debit cards, bank transfers, KakaoPay, and cash (for walk-in bookings at our office). Payment is required to confirm your booking."
        },
        {
          q: "When is payment due?",
          a: "Full payment is required at the time of booking to secure your spot. For group bookings (10+ people), we can arrange a payment plan."
        },
        {
          q: "Can I get a refund if I cancel?",
          a: "Yes. Full refund for cancellations made 7+ days before the event. 50% refund for 3-6 days before. No refund for cancellations within 48 hours of the event."
        }
      ]
    },
    {
      category: "Event Details",
      questions: [
        {
          q: "What's included in the price?",
          a: "All events include expert guide services, entrance fees (where applicable), and materials needed for workshops. Food tours include tastings. Transportation is not included unless specifically mentioned."
        },
        {
          q: "How long do events typically last?",
          a: "Most events are 2-4 hours long. Specific duration is listed on each event. We recommend arriving 10 minutes early."
        },
        {
          q: "What should I wear?",
          a: "Comfortable walking shoes and weather-appropriate clothing. For temple visits, modest dress is appreciated (shoulders and knees covered). We'll provide any special clothing needed for workshops."
        },
        {
          q: "Are events conducted in English?",
          a: "Yes! All our events are conducted in English by bilingual guides. We can also arrange Korean-language tours for groups upon request."
        }
      ]
    },
    {
      category: "Group Bookings",
      questions: [
        {
          q: "Do you offer private tours?",
          a: "Yes! We can arrange private tours for groups of 4 or more. Contact us with your preferences, and we'll create a custom experience for you."
        },
        {
          q: "What's the maximum group size?",
          a: "Regular events are limited to 8-20 people depending on the activity. For private tours, we can accommodate larger groups."
        },
        {
          q: "Do you offer discounts for groups?",
          a: "Yes, we offer 10% discount for groups of 6-9 people, and 15% discount for groups of 10 or more."
        }
      ]
    },
    {
      category: "Practical Information",
      questions: [
        {
          q: "Where do we meet?",
          a: "Meeting points vary by event and are clearly stated in your confirmation email. Most events meet at easily accessible subway stations."
        },
        {
          q: "What if I'm late?",
          a: "Please arrive 10 minutes before the scheduled start time. If you're running late, call us immediately. We may not be able to wait more than 15 minutes."
        },
        {
          q: "What happens if it rains?",
          a: "Most events proceed rain or shine. For outdoor-heavy events, we'll contact you if we need to reschedule due to severe weather."
        },
        {
          q: "Are events wheelchair accessible?",
          a: "Many of our events are accessible, but not all. Please contact us before booking to discuss specific accessibility needs."
        },
        {
          q: "Can children join?",
          a: "Most events are suitable for children 12+. Some workshops welcome younger children with adult supervision. Please check the specific event details or contact us."
        }
      ]
    },
    {
      category: "Food & Dietary",
      questions: [
        {
          q: "Can you accommodate dietary restrictions?",
          a: "Yes! Please note any allergies or dietary restrictions when booking. We'll do our best to accommodate vegetarian, vegan, halal, and other dietary needs."
        },
        {
          q: "Is food included?",
          a: "Food tours include tastings. Other events do not include meals unless specifically stated. We're happy to recommend nearby restaurants."
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 mb-8">
            Find answers to common questions about our cultural events and tours. 
            Can't find what you're looking for? <span className="text-blue-600 font-semibold cursor-pointer">Contact us</span>.
          </p>

          <div className="space-y-6">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((item, questionIndex) => {
                    const key = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === key;
                    
                    return (
                      <div
                        key={questionIndex}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                        >
                          <span className="font-semibold text-gray-800 pr-4">{item.q}</span>
                          {isOpen ? (
                            <ChevronUp className="flex-shrink-0 text-blue-600" size={20} />
                          ) : (
                            <ChevronDown className="flex-shrink-0 text-gray-400" size={20} />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-gray-600 bg-gray-50">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="mb-6">
            Our team is here to help! Get in touch and we'll answer any questions you have.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
