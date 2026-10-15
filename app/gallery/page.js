import PageBanner from "@/components/PageBanner";
import GalleryClient from "./GalleryClient";
export const metadata = { title: "गैलरी | सर्व समाज कल्याण समिति" };
export default function Gallery() {
  return (
    <>
      <PageBanner title="गैलरी" sub="सेवा कार्यों के फोटो एवं वीडियो एल्बम" />
      <section className="mx-auto max-w-7xl px-4 py-12"><GalleryClient /></section>
    </>
  );
}
