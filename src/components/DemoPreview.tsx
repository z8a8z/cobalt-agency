import {
  type KeyboardEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useElementInView } from '../hooks/useElementInView';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './DemoPreview.css';

type PreviewType = 'biolink' | 'qrmenu';

interface DemoMockup {
  id: string;
  src: string;
  title: string;
}

interface MockupCarousel {
  centerPhone: (index: number) => void;
  focusedIndex: number;
  onScroll: () => void;
  trackRef: RefObject<HTMLDivElement | null>;
}

const BIO_LINK_MOCKUPS: DemoMockup[] = [
  { id: 'starbucks', src: '/demos/bio-links/starbucks_bio_link.html', title: 'معاينة Starbucks Bio Link' },
  { id: 'bmw', src: '/demos/bio-links/bmw_bio_link.html', title: 'معاينة BMW Bio Link' },
  { id: 'ibrahim', src: '/demos/bio-links/ibrahim_mohammed_cobalt_ceo.html', title: 'معاينة Cobalt CEO Profile' },
  { id: 'jaber', src: '/demos/bio-links/jaber_coffee_house_bio_link.html', title: 'معاينة Jaber Roastery & Cafe' },
  { id: 'cobalt', src: '/demos/bio-links/cobalt_agency_bio_link.html', title: 'معاينة Cobalt Agency Bio Link' },
];

const QR_MENU_MOCKUPS: DemoMockup[] = [
  { id: 'reserve', src: '/demos/qr-menus/starbucks_reserve_menu.html', title: 'معاينة Starbucks Reserve Menu' },
  { id: 'moon', src: '/demos/qr-menus/moon_coffee_observatory_ui.html', title: 'معاينة Moon Coffee Observatory' },
  { id: 'zafran', src: '/demos/qr-menus/zafran_herbs_botanical_ui.html', title: 'معاينة Zafran Herbs Botanical' },
  { id: 'cobalt-services', src: '/demos/qr-menus/cobalt_agency_services_menu_ar.html', title: 'معاينة خدمات وكالة كوبالت' },
];

function useMockupCarousel(itemCount: number): MockupCarousel {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const scrollFrameRef = useRef<number | null>(null);

  const updateFocusedPhone = useCallback(() => {
    const track = trackRef.current;

    if (!track) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let minimumDistance = Number.POSITIVE_INFINITY;

    Array.from(track.children).forEach((child, index) => {
      const phone = child as HTMLElement;
      const phoneCenter = phone.offsetLeft + phone.clientWidth / 2;
      const distance = Math.abs(phoneCenter - trackCenter);

      if (distance < minimumDistance) {
        minimumDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== currentIndexRef.current) {
      currentIndexRef.current = closestIndex;
      setFocusedIndex(closestIndex);
    }
  }, []);

  const onScroll = useCallback(() => {
    if (scrollFrameRef.current !== null) return;

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      updateFocusedPhone();
    });
  }, [updateFocusedPhone]);

  const centerPhone = useCallback((index: number) => {
    const track = trackRef.current;
    const phone = track?.children[index] as HTMLElement | undefined;

    if (!track || !phone) return;

    currentIndexRef.current = index;
    setFocusedIndex(index);
    track.scrollTo({
      behavior: 'smooth',
      left: phone.offsetLeft - track.clientWidth / 2 + phone.clientWidth / 2,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (focusedIndex >= itemCount) {
      currentIndexRef.current = 0;
      setFocusedIndex(0);
    }
  }, [focusedIndex, itemCount]);

  return { centerPhone, focusedIndex, onScroll, trackRef };
}

function DemoPreview() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const isDemoInView = useElementInView(sectionRef, { rootMargin: '250px 0px' });
  const [activePreview, setActivePreview] = useState<PreviewType>('biolink');
  const bioLinkCarousel = useMockupCarousel(BIO_LINK_MOCKUPS.length);
  const qrMenuCarousel = useMockupCarousel(QR_MENU_MOCKUPS.length);

  const handlePhoneKeyDown = useCallback((
    event: KeyboardEvent<HTMLDivElement>,
    index: number,
    centerPhone: (targetIndex: number) => void,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    centerPhone(index);
  }, []);

  return (
    <section id="demo" className="demo-preview section reveal" ref={sectionRef}>
      <div className="section-divider-line" aria-hidden="true" />
      <div className="container">
        <h2>شوف مثال حي</h2>
        <p className="demo-preview__subtitle">هذا مثال تجريبي — مو عميل حقيقي</p>

        <div className="demo-preview__tabs" role="tablist" aria-label="تبديل معاينة الخدمات">
          <button
            id="demo-preview-biolink-tab"
            type="button"
            className={`demo-preview__tab${activePreview === 'biolink' ? ' demo-preview__tab--active' : ''}`}
            role="tab"
            aria-controls="demo-preview-biolink-panel"
            aria-selected={activePreview === 'biolink'}
            onClick={() => setActivePreview('biolink')}
          >
            صفحة Bio Link
          </button>
          <button
            id="demo-preview-qr-tab"
            type="button"
            className={`demo-preview__tab${activePreview === 'qrmenu' ? ' demo-preview__tab--active' : ''}`}
            role="tab"
            aria-controls="demo-preview-qr-panel"
            aria-selected={activePreview === 'qrmenu'}
            onClick={() => setActivePreview('qrmenu')}
          >
            قائمة QR ذكية
          </button>
        </div>
      </div>

      {activePreview === 'biolink' ? (
        <div
          id="demo-preview-biolink-panel"
          className="demo-preview__track-wrapper"
          role="tabpanel"
          aria-labelledby="demo-preview-biolink-tab"
        >
          <div className="demo-preview__glow" aria-hidden="true" />
          <div className="demo-preview__track no-scrollbar" ref={bioLinkCarousel.trackRef} onScroll={bioLinkCarousel.onScroll}>
            {BIO_LINK_MOCKUPS.map((mockup, index) => (
              <div
                key={mockup.id}
                className={`demo-preview__phone-wrapper${bioLinkCarousel.focusedIndex === index ? ' demo-preview__phone-wrapper--focused' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`عرض ${mockup.title}`}
                onClick={() => bioLinkCarousel.centerPhone(index)}
                onKeyDown={(event) => handlePhoneKeyDown(event, index, bioLinkCarousel.centerPhone)}
              >
                {isDemoInView && Math.abs(bioLinkCarousel.focusedIndex - index) <= 1 ? (
                  <iframe
                    src={mockup.src}
                    className="demo-preview__iframe-phone"
                    title={mockup.title}
                    loading={bioLinkCarousel.focusedIndex === index ? 'eager' : 'lazy'}
                  />
                ) : (
                  <div className="demo-preview__phone-placeholder" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          id="demo-preview-qr-panel"
          className="demo-preview__qr-track-wrapper"
          role="tabpanel"
          aria-labelledby="demo-preview-qr-tab"
        >
          <div className="demo-preview__glow" aria-hidden="true" />
          <div className="demo-preview__qr-track no-scrollbar" ref={qrMenuCarousel.trackRef} onScroll={qrMenuCarousel.onScroll}>
            {QR_MENU_MOCKUPS.map((mockup, index) => (
              <div
                key={mockup.id}
                className={`demo-preview__phone-wrapper${qrMenuCarousel.focusedIndex === index ? ' demo-preview__phone-wrapper--focused' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`عرض ${mockup.title}`}
                onClick={() => qrMenuCarousel.centerPhone(index)}
                onKeyDown={(event) => handlePhoneKeyDown(event, index, qrMenuCarousel.centerPhone)}
              >
                {isDemoInView && Math.abs(qrMenuCarousel.focusedIndex - index) <= 1 ? (
                  <iframe
                    src={mockup.src}
                    className="demo-preview__iframe-phone"
                    title={mockup.title}
                    loading={qrMenuCarousel.focusedIndex === index ? 'eager' : 'lazy'}
                  />
                ) : (
                  <div className="demo-preview__phone-placeholder" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default DemoPreview;
