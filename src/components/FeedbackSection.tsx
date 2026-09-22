import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle, ThumbsUp, Send } from 'lucide-react';
import { CustomerFeedback, Language } from '../types';

interface FeedbackSectionProps {
  lang: Language;
  feedbacks: CustomerFeedback[];
  onAddFeedback: (newFb: CustomerFeedback) => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  lang,
  feedbacks,
  onAddFeedback,
}) => {
  const isBn = lang === 'bn';

  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [serviceType, setServiceType] = useState('ঢাকা ➔ কক্সবাজার');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newFeedback: CustomerFeedback = {
      id: `fb-${Date.now()}`,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      serviceType,
      verifiedBooking: true,
    };

    onAddFeedback(newFeedback);
    setSubmitted(true);
    setName('');
    setComment('');
  };

  return (
    <section id="feedback-section" className="py-16 bg-slate-50 dark:bg-slate-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>{isBn ? 'যাত্রীদের বিশ্বস্ত অভিজ্ঞতা' : 'Customer Reviews'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white">
            {isBn ? 'আমাদের যাত্রীরা কী বলছেন?' : 'Real Traveler Feedback'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            {isBn 
              ? 'দ্বীপাচল পরিবহন সেবার মান, অন-টাইম ডিপার্চার এবং আরামদায়ক যাত্রার ওপর সম্মানিত যাত্রীদের বাস্তব মতামত।'
              : 'Verified reviews from travelers who experienced our royal buses and luxury fleet.'}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= fb.rating 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  {fb.verifiedBooking && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-3 h-3" />
                      {isBn ? 'যাচাইকৃত যাত্রী' : 'Verified'}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  "{fb.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {fb.name}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {fb.serviceType || 'ঢাকা ➔ কক্সবাজার'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {fb.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Feedback Form Box */}
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBn ? 'আপনার মূল্যবান মতামত শেয়ার করুন' : 'Leave a Traveler Review'}
            </h3>
          </div>

          {submitted ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {isBn ? 'ধন্যবাদ! আপনার রিভিউটি পোস্ট করা হয়েছে।' : 'Thank you! Your feedback has been recorded.'}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-emerald-600 underline font-semibold cursor-pointer"
              >
                {isBn ? 'আরেকটি রিভিউ দিন' : 'Write another review'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {isBn ? 'আপনার নাম' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isBn ? 'যেমন: আরিফুল ইসলাম' : 'e.g. John Doe'}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {isBn ? 'ভ্রমণ রেটিং' : 'Rating'}
                  </label>
                  <div className="flex items-center gap-1 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating 
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {isBn ? 'ভ্রমণের অভিজ্ঞতা ও মতামত' : 'Your Review Comment'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={isBn ? 'সিট কেমন ছিল, অন-টাইম ড্রাইভ বা যেকোনো পরামর্শ...' : 'Comfort, on-time punctuality...'}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isBn ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
