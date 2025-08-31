'use client';

import UserProfile from './UserProfile';

interface Package {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary';
}

interface PackagesInterfaceProps {
  onViewChange: (view: 'chat' | 'packages') => void;
}

export default function PackagesInterface({ onViewChange }: PackagesInterfaceProps) {
  const packages: Package[] = [
    {
      id: '1',
      name: 'پکیج پایه',
      price: 'رایگان',
      period: 'برای همیشه',
      features: [
        '5 چت در روز',
        'پشتیبانی پایه',
        'دسترسی به مدل پایه',
        'تاریخچه چت محدود'
      ],
      buttonText: 'شروع رایگان',
      buttonVariant: 'secondary'
    },
    {
      id: '2',
      name: 'پکیج حرفه‌ای',
      price: '99,000',
      period: 'در ماه',
      features: [
        'چت نامحدود',
        'پشتیبانی 24/7',
        'ویژگی‌های پیشرفته',
        'مدل‌های پیشرفته',
        'تاریخچه کامل',
        'خروجی PDF',
        'API دسترسی'
      ],
      popular: true,
      buttonText: 'انتخاب پکیج',
      buttonVariant: 'primary'
    },
    {
      id: '3',
      name: 'پکیج سازمانی',
      price: 'تماس بگیرید',
      period: 'قیمت‌گذاری سفارشی',
      features: [
        'راه‌حل سفارشی',
        'پشتیبانی اختصاصی',
        'مدل‌های اختصاصی',
        'ادغام با سیستم‌های موجود',
        'آموزش تیم',
        'گزارش‌گیری پیشرفته',
        'SLA تضمین شده'
      ],
      buttonText: 'تماس با فروش',
      buttonVariant: 'secondary'
    }
  ];

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <div className="w-80 bg-[var(--card-bg)] border-r border-[var(--border)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)]">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">ChatBot</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">دستیار هوشمند شما</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--border)]">
          <button 
            onClick={() => onViewChange('chat')}
            className="flex-1 py-3 px-4 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--secondary)]"
          >
            چت
          </button>
          <button className="flex-1 py-3 px-4 text-sm font-medium text-[var(--primary)] border-b-2 border-[var(--primary)] bg-[var(--primary-light)] bg-opacity-10">
            پکیج
          </button>
        </div>

        {/* Current Plan Info */}
        <div className="p-4 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">پلن فعلی شما</h3>
          <div className="bg-[var(--secondary)] p-3 rounded-lg">
            <div className="text-sm font-medium text-[var(--text-primary)]">پکیج پایه</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">5 چت باقی‌مانده امروز</div>
            <div className="w-full bg-[var(--border)] rounded-full h-2 mt-2">
              <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <UserProfile />
      </div>

      {/* Main Packages Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">انتخاب پلن مناسب</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            پلن مناسب خود را انتخاب کنید و از تمام ویژگی‌های ChatBot بهره‌مند شوید
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-[var(--card-bg)] border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                pkg.popular 
                  ? 'border-[var(--primary)] ring-2 ring-[var(--primary)] ring-opacity-20' 
                  : 'border-[var(--border)]'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[var(--primary)] text-white px-4 py-1 rounded-full text-sm font-medium">
                    محبوب
                  </span>
                </div>
              )}

              {/* Package Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{pkg.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-[var(--text-primary)]">{pkg.price}</span>
                  {pkg.price !== 'رایگان' && pkg.price !== 'تماس بگیرید' && (
                    <span className="text-[var(--text-muted)]"> تومان</span>
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{pkg.period}</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-[var(--text-primary)]">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  pkg.buttonVariant === 'primary'
                    ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]'
                    : 'bg-[var(--button-secondary)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-hover)] border border-[var(--border)]'
                }`}
              >
                {pkg.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">سوالی دارید؟</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            تیم پشتیبانی ما آماده کمک به شماست
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary-dark)] transition-colors font-medium">
              تماس با پشتیبانی
            </button>
            <button className="border border-[var(--border)] text-[var(--text-primary)] px-6 py-3 rounded-lg hover:bg-[var(--secondary)] transition-colors font-medium">
              راهنمای استفاده
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
