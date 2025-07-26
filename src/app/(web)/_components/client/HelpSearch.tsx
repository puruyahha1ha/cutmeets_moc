'use client'

import { useState } from 'react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface HelpSearchProps {
  faqCategories: Array<{
    title: string;
    faqs: FAQ[];
  }>;
}

export default function HelpSearch({ faqCategories }: HelpSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  // Filter FAQs based on search query
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <>
      {/* 検索バー */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="質問やキーワードで検索"
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-lg"
          />
          <svg className="absolute left-4 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* FAQ セクション */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">よくある質問</h2>
        
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {category.faqs.map((faq) => (
                  <div key={faq.id}>
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-900 text-sm sm:text-base pr-4">{faq.question}</span>
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform shrink-0 ${
                          expandedFaq === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedFaq === faq.id && (
                      <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
            <p className="text-gray-600">検索キーワードを変更してお試しください</p>
          </div>
        )}
      </div>
    </>
  );
}