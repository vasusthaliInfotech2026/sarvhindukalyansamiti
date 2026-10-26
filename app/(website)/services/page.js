import fs from "fs";
import path from "path";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { SERVICES } from "@/lib/data";

export const metadata = { title: "हमारे कार्य | सर्व समाज कल्याण समिति" };

// Agar local folder (/public/images/services/) mein photo nahi hai, to ye real photos dikhengi
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80", // 1. अन्न सेवा एवं भोजन वितरण
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80", // 2. मानव सेवा एवं परिवार सहायता
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80", // 3. अनाथ एवं जरूरतमंद बच्चों की सहायता
  "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80", // 4. स्वास्थ्य एवं चिकित्सा सेवा
  "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80", // 5. रक्तदान एवं स्वास्थ्य जागरूकता
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80", // 6. शिक्षा सहायता
  "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80", // 7. मंदिर एवं सनातन धर्म सेवा (Suitable Mandir Image)
  "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&w=800&q=80", // 8. आपदा एवं आपातकालीन सहायता
];


const FOUR_BULLETS_PER_SERVICE = [
  // 1. अन्न सेवा एवं भोजन वितरण
  [
    "जरूरतमंद एवं असहाय परिवारों को मासिक सूखा राशन किट वितरण",
    "अस्पतालों और सार्वजनिक स्थलों पर नि:शुल्क पौष्टिक भोजन सेवा",
    "पर्व एवं त्योहारों पर वंचित बस्तियों में विशेष भंडारे का आयोजन",
    "कोई भी व्यक्ति भूखा न सोए, इस संकल्प के साथ दैनिक अन्नदान अभियान",
  ],
  // 2. मानव सेवा एवं परिवार सहायता
  [
    "आर्थिक रूप से कमजोर परिवारों की बेटियों के विवाह में सहयोग",
    "बेसहारा बुजुर्गों और विधवा माताओं के जीवन-यापन हेतु मासिक सहायता",
    "शीत लहर और भीषण गर्मी में कंबल, वस्त्र एवं आवश्यक सामग्री वितरण",
    "संकटग्रस्त एवं असहाय परिवारों को आत्मनिर्भर बनाने हेतु आवश्यक मदद",
  ],
  // 3. अनाथ एवं जरूरतमंद बच्चों की सहायता
  [
    "अनाथ एवं बेसहारा बच्चों के लिए भोजन, वस्त्र और सुरक्षित आश्रय की व्यवस्था",
    "कुपोषित बच्चों के लिए विशेष पोषण आहार और नियमित स्वास्थ्य जांच",
    "बच्चों के सर्वांगीण विकास हेतु संस्कार केंद्रों और खेलकूद का संचालन",
    "गरीब व वंचित बच्चों को मुख्यधारा और प्राथमिक शिक्षा से जोड़ना",
  ],
  // 4. स्वास्थ्य एवं चिकित्सा सेवा
  [
    "ग्रामीण और पिछड़े क्षेत्रों में नि:शुल्क स्वास्थ्य जांच एवं नेत्र शिविर",
    "निर्धन मरीजों को नि:शुल्क दवाइयां और गंभीर बीमारियों के इलाज में मदद",
    "आपातकालीन स्थिति में जरूरतमंद मरीजों के लिए एम्बुलेंस व अस्पताल सहायता",
    "महिलाओं और बुजुर्गों के लिए विशेष स्वास्थ्य परामर्श एवं जागरूकता अभियान",
  ],
  // 5. रक्तदान एवं स्वास्थ्य जागरूकता
  [
    "समय-समय पर स्वैच्छिक रक्तदान शिविरों का नियमित आयोजन",
    "आपातकालीन मरीजों की सहायता हेतु रक्तदाताओं (Blood Donors) का नेटवर्क",
    "युवाओं और समाज को रक्तदान के महत्व के प्रति जागरूक एवं प्रेरित करना",
    "स्वच्छता, योग और निरोगी जीवनशैली के लिए जन-जागरूकता अभियान",
  ],
  // 6. शिक्षा सहायता
  [
    "जरूरतमंद छात्रों को नि:शुल्क किताबें, कॉपियां, स्कूल बैग व स्टेशनरी वितरण",
    "मेधावी किंतु आर्थिक रूप से कमजोर विद्यार्थियों के लिए शिक्षण शुल्क सहायता",
    "वंचित बस्तियों के बच्चों के लिए नि:शुल्क शिक्षण एवं मार्गदर्शन कक्षाएं",
    "युवाओं के उज्ज्वल भविष्य हेतु कंप्यूटर व कौशल विकास में सहयोग",
  ],
  // 7. मंदिर एवं सनातन धर्म सेवा
  [
    "प्राचीन एवं स्थानीय मंदिरों की स्वच्छता, रखरखाव और जीर्णोद्धार में सहयोग",
    "सनातन संस्कृति, धार्मिक ग्रंथों और भारतीय संस्कारों का प्रचार-प्रसार",
    "गौ-सेवा, धार्मिक अनुष्ठान, भजन-कीर्तन एवं सामूहिक महाआरती का आयोजन",
    "धार्मिक पर्वों और यात्राओं में श्रद्धालुओं व साधु-संतों के लिए सेवा शिविर",
  ],
  // 8. आपदा एवं आपातकालीन सहायता
  [
    "बाढ़, अग्निकांड या प्राकृतिक आपदा में प्रभावित परिवारों तक त्वरित राहत सामग्री",
    "आपदा पीड़ितों के लिए अस्थायी आश्रय, स्वच्छ पेयजल और भोजन की व्यवस्था",
    "महामारी या आपातकाल में मेडिकल किट और आवश्यक जीवनरक्षक सामग्री वितरण",
    "किसी भी आकस्मिक दुर्घटना में पीड़ित परिवारों को तत्काल मानवीय संबल देना",
  ],
];

const getServiceImage = (id, index) => {
  try {
    const localPath = path.join(
      process.cwd(),
      "public",
      "images",
      "services",
      `${id}.jpg`,
    );
    if (fs.existsSync(localPath)) {
      return `/images/services/${id}.jpg`;
    }
  } catch (e) {
    // Fallback if fs check fails
  }
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

export default function Services() {
  return (
    <>
      <PageBanner
        title="हमारे कार्य"
        sub="समाज सेवा के क्षेत्र – हमारे प्रमुख कार्य"
      />

      <section className="max-w-7xl px-4 py-10 mx-auto sm:px-6 sm:py-14">

        <div className="max-w-2xl mx-auto mb-12 text-center sm:mb-16">

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/50 px-3.5 py-1 text-sm font-bold text-saffron-deep">
            <span>✦</span>
            <span>सेवा ही परमो धर्मः</span>
            <span>✦</span>
          </div>

          <h2 className="mt-4 text-2xl font-bold font-head text-navy sm:text-3xl md:text-4xl">
            समाज उत्थान हेतु हमारे प्रमुख कार्य
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-navy/70 sm:text-base">
            हम समाज के अंतिम व्यक्ति तक सहायता पहुँचाने और सनातन मूल्यों के संरक्षण के लिए विभिन्न क्षेत्रों में निरंतर कार्यरत हैं।
          </p>
        </div>

        {/* 2-2 Columns Simple Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {SERVICES.map((s, k) => {
            const imgSrc = getServiceImage(s.id, k);
            const bullets = FOUR_BULLETS_PER_SERVICE[k] || s.items;

            return (
              <Reveal key={s.id} from="bottom">
                <article className="flex flex-col h-full overflow-hidden transition duration-300 bg-white border shadow-sm rounded-2xl border-stone-200/80 hover:shadow-md">
                  {/* 1. Upar Image (No Icons) */}
                  <div className="relative w-full overflow-hidden h-52 sm:h-60 bg-stone-100">
                    <img
                      src={imgSrc}
                      alt={s.title}
                      loading={k < 2 ? "eager" : "lazy"}
                      className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* 2. Niche Simple Content */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    <h2 className="text-lg font-bold font-head text-navy sm:text-xl">
                      {s.title}
                    </h2>

                    {/* Simple Saffron Line */}
                    <div className="w-12 h-1 mt-2 rounded bg-saffron" />

                    {/* Easy to Read Bullet Points (4-4 Points Each) */}
                    <ul className="mt-4 mb-6 space-y-2 text-sm text-navy/85 sm:text-[15px] flex-1">
                      {bullets.map((t) => (
                        <li key={t} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                          <span className="leading-relaxed">{t}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Simple Action Button */}
                    <Link
                      href={s.link}
                      className="btn btn-saffron w-full !py-2.5 text-center text-sm font-medium rounded-xl"
                    >
                      इस सेवा में सहयोग करें →
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto my-12">
        <Reveal className="mx-auto max-w-7xl px-4">
          <div className=" relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-700 via-saffron-deep to-saffron px-6 py-12 text-center shadow-xl sm:px-12 md:py-12">
            {/* Decorative Background Watermark / Elements */}
            <div className="absolute -left-10 -top-10 text-9xl font-bold text-white/10 select-none pointer-events-none">
              ॐ
            </div>
            <div className="absolute -right-10 -bottom-10 text-9xl font-bold text-white/10 select-none pointer-events-none">
              ॐ
            </div>

            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="lAlign font-head text-2xl font-extrabold tracking-wide sm:text-3xl text-white">
                  आपका छोटा सहयोग, किसी का बड़ा सहारा
                </h2>

                <p className="lAlign mt-3 text-sm text-white/90 sm:text-base">
                  आपकी दी गई हर छोटी मदद समाज के जरूरतमंदों के जीवन में एक बड़ा
                  बदलाव ला सकती है। आइए, इस पुण्य कार्य में अपना योगदान दें।
                </p>
              </div>

              <div>
                <Link href="/donate" className="btn text-saffron-deep bg-white ml-1 animate-ring !px-4 !py-2 text-sm xl:ml-2 xl:!px-6 xl:text-base">दान करें</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 3: Bottom CTA Banner above Footer */}
      <section className="mx-auto my-12">
        <Reveal className="mx-auto max-w-7xl px-4">
          <div className="h-full card bg-gradient-to-br from-white to-sandal ctaBlock shadow-xl relative overflow-hidden max-w-7xl mx-auto rounded-3xl px-6 py-12">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-head text-2xl font-extrabold tracking-wide sm:text-3xl">
                  हमारे सेवा कार्यों से जुड़ें
                </h2>
                <p className="mt-2 text-sm text-black/85 sm:text-base">
                  समाज सेवा, सनातन संस्कृति के संरक्षण और जनकल्याण के कार्यों में हमारा साथ दें।
                </p>
              </div>

              <div className="btnDiv flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link href="/join" className="btn btn-saffron ml-1 animate-ring !px-4 !py-2 text-sm xl:ml-2 xl:!px-6 xl:text-base">सदस्य बनें</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
