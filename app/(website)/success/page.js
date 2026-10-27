"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-white rounded-3xl border border-amber-200 shadow-lg text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl mb-4 shadow-inner">
        🙏
      </div>

      <h3 className="font-head text-3xl font-bold text-orange-700">
        पंजीकरण और अनुरोध सफल!
      </h3>

      <p className="mt-3 text-slate-600 text-base">
        सर्व हिन्दू कल्याण समिति परिवार में आपका स्वागत है। आपका डेटा सुरक्षित
        दर्ज कर लिया गया है।
      </p>

      {orderId && (
        <div className="mt-6 rounded-2xl bg-[#faf3e8] p-4 text-left border border-[#e6d5b8] shadow-sm space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">ऑर्डर आईडी:</span>
            <span className="font-semibold text-slate-800">{orderId}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">स्थिति:</span>
            <span className="font-semibold text-emerald-600">
              सफलतापूर्वक प्रोसेस किया गया
            </span>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        इस पंजीकरण की पुष्टि आपके ईमेल पर भेज दी गई है। हमारी टीम जल्द ही आपसे
        संपर्क करेगी।
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex-1 rounded-xl bg-[#c86428] hover:bg-[#b05520] text-white font-semibold py-3 transition-colors shadow-sm text-sm inline-block text-center leading-normal"
        >
          होम पेज पर जाएं
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto mt-16 p-8 text-center">
          <p className="text-slate-600">कृपया प्रतीक्षा करें...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
