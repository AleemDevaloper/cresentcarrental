import { Suspense, createElement, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Award, BriefcaseBusiness, CalendarCheck, CarFront, CheckCircle2, Clock3, Crown, MapPin, Plane, Quote, ShieldCheck, Sparkles, Star, Users, WalletCards, MessageCircle } from 'lucide-react';
import api from '../services/api';
import SeoHead from '../components/SeoHead';
import Button from '../components/Button';
import BookingSearchWidget from '../components/BookingSearchWidget';
import VehicleCard from '../components/VehicleCard';
import SectionHeading from '../components/SectionHeading';
import SmartImage from '../components/SmartImage';
import SmartCarousel from '../components/SmartCarousel';
import brand from '../config/brandConfig';
import { prefersReducedMotion, shouldUseWebGL, webglConfig } from '../config/experienceConfig';
import { Reveal, Stagger, Counter, TextReveal } from '../animation';

gsap.registerPlugin(ScrollTrigger);
const WebGLHeroScene = lazy(() => import('../components/WebGLHeroScene'));

const fallbackVehicles = [
 {id:'fallback-yaris',slug:'toyota-yaris',name:'Toyota Yaris',daily_price:8500,category:'Economy Sedan',seats:5,transmission:'Automatic',fuel_type:'Petrol',mileage_policy:'Standard',featured:true,main_image_url:'assets/fleet/hero-sedan.webp'},
 {id:'fallback-corolla',slug:'toyota-corolla',name:'Toyota Corolla',daily_price:10000,category:'Executive Sedan',seats:5,transmission:'Automatic',fuel_type:'Petrol',mileage_policy:'Standard',featured:true,main_image_url:'assets/fleet/luxury-sedan.webp'},
 {id:'fallback-fortuner',slug:'toyota-fortuner',name:'Toyota Fortuner',daily_price:22000,category:'Premium SUV',seats:7,transmission:'Automatic',fuel_type:'Petrol',mileage_policy:'Standard',featured:true,main_image_url:'assets/fleet/luxury-suv.webp'},
];

const categories = [
 {title:'Economy',text:'Smart city drives and value-focused daily rentals.',icon:CarFront,to:'/cars?category=Economy',img:'assets/fleet/hero-sedan.webp'},
 {title:'Sedan',text:'Comfortable business and family travel across Pakistan.',icon:Users,to:'/cars?category=Sedan',img:'assets/fleet/executive-sedan.webp'},
 {title:'SUV',text:'Commanding road presence for highways and northern routes.',icon:ShieldCheck,to:'/cars?category=SUV',img:'assets/fleet/luxury-suv.webp'},
 {title:'Luxury',text:'Premium vehicles for executive movement and special occasions.',icon:Crown,to:'/cars?category=Luxury',img:'assets/fleet/sports-coupe.webp'},
];
const offers = [
 {title:'Airport Transfer Packages',tag:'Most requested',meta:'Airport pickup / drop-off',text:'Pre-booked pickup and drop-off support for Lahore and Islamabad airports, with driver options and clear timing.',to:'/airport-car-rental',icon:Plane,features:['Flight timing support','Driver option','Sedan or SUV']},
 {title:'Monthly Car Rental',tag:'Best value',meta:'Long-term rental plans',text:'Longer-term rentals for families, professionals and businesses who need dependable mobility without buying a car.',to:'/monthly-car-rental',icon:CalendarCheck,features:['Monthly pricing','Flexible category','Support follow-up']},
 {title:'Corporate & Guest Travel',tag:'Business ready',meta:'Executive movement',text:'Clean sedans, SUVs and luxury vehicles for executives, visiting guests, meetings, events and staff movement.',to:'/corporate-car-rental',icon:BriefcaseBusiness,features:['Guest travel','Meetings and events','Premium vehicles']},
];
const heroSlides = [
 {src:'assets/fleet/hero-sedan.webp',name:'Toyota Yaris',category:'Economy',price:8500,slug:'toyota-yaris'},
 {src:'assets/fleet/luxury-suv.webp',name:'Toyota Fortuner',category:'Premium SUV',price:22000,slug:'toyota-fortuner'},
 {src:'assets/fleet/sports-coupe.webp',name:'BMW 5 Series',category:'Luxury',price:40000,slug:'bmw-5-series'},
 {src:'assets/fleet/hero-red-sedan.webp',name:'Honda Civic',category:'Sedan',price:11000,slug:'honda-civic'},
];
const seoTopics = [
 ['Car Rental Lahore','Premium rental cars in Lahore with daily, weekly and monthly options.','/car-rental-lahore'],
 ['Car Rental Islamabad','Comfortable rentals for business, airport and intercity travel.','/car-rental-islamabad'],
 ['Toyota Fortuner Rental','SUV rental for confident travel, family plans and northern routes.','/fortuner-for-rent'],
 ['Luxury Car Rental','Executive sedans and premium vehicles for elevated occasions.','/luxury-car-rental'],
 ['Wedding Car Rental','Elegant vehicles for barat, valima and family movement.','/wedding-car-rental'],
 ['Self Drive Rental','Independent travel with flexible daily and monthly rates.','/self-drive-car-rental'],
];

const homeFaqs = [
 {question:'What documents do I need to rent a car?',answer:'A valid driver\'s licence, CNIC or passport, and a credit/debit card or agreed cash deposit for the security hold.'},
 {question:'Do you provide airport pickup and drop-off?',answer:'Yes — Crescent arranges pickups and drop-offs at Lahore and Islamabad airports with self-drive and chauffeur options.'},
 {question:'How fast do you respond to booking requests?',answer:'Most booking requests receive a follow-up within about 30 minutes during operating hours — day or night, 24/7.'},
 {question:'Can I rent a car with a driver?',answer:'Yes. Professional drivers are available on request for an additional fee — request one at the time of booking.'},
 {question:'Is a security deposit required?',answer:'Yes. A refundable deposit is taken at handover and returned after the vehicle is inspected on return.'},
 {question:'How is availability checked?',answer:'We check your dates against every confirmed reservation, so two customers are never promised the same car.'},
];

export default function HomePage() {
 const heroRef=useRef(null); const [data,setData]=useState({featured_vehicles:[],locations:[],services:[],reviews:[],faqs:[]}); const [showWebGL,setShowWebGL]=useState(false); const [heroSlide,setHeroSlide]=useState(0); const [heroPaused,setHeroPaused]=useState(false);

 useEffect(()=>{ api.get('/homepage').then(r=>setData(r.data.data||r.data)).catch(()=>{}); },[]);
 useEffect(()=>{ if(!shouldUseWebGL()) return; const t=setTimeout(()=>setShowWebGL(true),webglConfig.lazyDelayMs); return()=>clearTimeout(t);},[]);
 useEffect(()=>{ if(prefersReducedMotion()||heroPaused) return undefined; const t=window.setInterval(()=>setHeroSlide((current)=>(current+1)%heroSlides.length),6500); return()=>window.clearInterval(t);},[heroPaused]);

 useEffect(()=>{ if(prefersReducedMotion()) return; const ctx=gsap.context(()=>{
  const tl=gsap.timeline({defaults:{ease:'power3.out'}});
  tl.from('.hero-kicker',{y:20,opacity:0,duration:.5})
   .from('.hero-copy h1',{y:40,opacity:0,duration:.7},"-=.3")
   .from('.hero-copy > p',{y:20,opacity:0,duration:.5},"-=.35")
   .from('.hero-actions .btn',{y:15,opacity:0,stagger:.1,duration:.45},"-=.25")
   .from('.hero-trust span',{y:10,opacity:0,stagger:.06,duration:.35},"-=.2")
   .from('.hero-metrics',{y:15,opacity:0,duration:.5},"-=.2")
   .from('.hero-visual',{scale:.95,opacity:0,duration:.8,ease:'power2.out'},"-=.6")
   .from('.hero-image-frame',{scale:.96,opacity:0,duration:.6},"-=.5")
   .from('.hero-spec-float',{y:20,opacity:0,duration:.4},"-=.3")
   .from('.hero-availability-card',{y:20,opacity:0,duration:.4},"-=.35")
   .from('.hero-booking',{y:20,opacity:0,duration:.5},"-=.25")
   .from('.hero-gallery-item',{y:15,opacity:0,stagger:.08,duration:.4},"-=.3");

  gsap.to('.hero-image-frame img',{scrollTrigger:{trigger:'.hero-section',start:'top top',end:'60% top',scrub:1},scale:1.08,ease:'none'});
  gsap.to('.hero-number',{scrollTrigger:{trigger:'.hero-section',start:'top top',end:'50% top',scrub:1},y:-40,opacity:.06,ease:'none'});

  gsap.utils.toArray('.reveal-section').forEach((el,i)=>{
   const from=({0:{x:-40,y:0},1:{x:40,y:0},2:{x:0,y:40}})[i%3];
   gsap.from(el,{scrollTrigger:{trigger:el,start:'top 85%'},...from,opacity:0,duration:.7,ease:'power2.out'});
  });
  gsap.utils.toArray('.reveal-left').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 85%'},x:-50,opacity:0,duration:.6,ease:'power2.out',clearProps:'all'}));
  gsap.utils.toArray('.reveal-right').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 85%'},x:50,opacity:0,duration:.6,ease:'power2.out',clearProps:'all'}));
  gsap.utils.toArray('.reveal-bottom').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 88%'},y:50,opacity:0,duration:.6,ease:'power2.out',clearProps:'all'}));
  gsap.utils.toArray('.reveal-top').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 85%'},y:-40,opacity:0,duration:.6,ease:'power2.out',clearProps:'all'}));
  gsap.utils.toArray('.reveal-fade').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 85%'},opacity:0,duration:.7,ease:'power2.out',clearProps:'all'}));
  gsap.utils.toArray('.reveal-scale').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 85%'},scale:.92,opacity:0,duration:.6,ease:'power2.out',clearProps:'all'}));

  gsap.utils.toArray('.motors-strip-card').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 92%'},y:35,opacity:0,duration:.5,delay:i*.08,ease:'power2.out'}));
  gsap.utils.toArray('.command-board > div').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 88%'},y:40,opacity:0,duration:.45,delay:i*.1,ease:'power2.out'}));
  gsap.utils.toArray('.vehicle-carousel .vehicle-card-wrapper, .vehicle-carousel > div').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 92%'},y:35,opacity:0,duration:.45,delay:i*.07,ease:'power2.out'}));
  gsap.utils.toArray('.offer-card').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 90%'},x:40,opacity:0,duration:.5,delay:i*.12,ease:'power2.out'}));
  gsap.utils.toArray('.step-card').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 90%'},y:40,scale:.96,opacity:0,duration:.45,delay:i*.1,ease:'power2.out'}));
  gsap.utils.toArray('.testimonial-card').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 90%'},y:35,opacity:0,duration:.45,delay:i*.08,ease:'power2.out'}));
  gsap.utils.toArray('.trust-mini').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 88%'},x:i%2===0?-35:35,opacity:0,duration:.5,delay:i*.08,ease:'power2.out'}));
  gsap.utils.toArray('.service-card').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 90%'},y:40,opacity:0,duration:.45,delay:i*.07,ease:'power2.out'}));
  gsap.utils.toArray('.offers-visual-card').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 85%'},x:-40,scale:.96,opacity:0,duration:.7,ease:'power2.out'}));
  gsap.utils.toArray('.benefit-list > div').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 90%'},x:-25,opacity:0,duration:.4,delay:i*.1,ease:'power2.out'}));
  gsap.utils.toArray('.brand-grid > a').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 92%'},y:25,opacity:0,duration:.35,delay:i*.06,ease:'power2.out'}));
  gsap.utils.toArray('.seo-topic-grid > a').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 90%'},y:35,opacity:0,duration:.45,delay:i*.08,ease:'power2.out'}));
  gsap.utils.toArray('.faq-mini-list details').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 90%'},y:25,opacity:0,duration:.35,delay:i*.07,ease:'power2.out'}));

  gsap.utils.toArray('.counter-number').forEach(el=>{
   const target=parseInt(el.dataset.target||el.textContent)||0;
   const obj={val:0};
   gsap.to(obj,{val:target,duration:1.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 85%'},onUpdate:()=>{el.textContent=Math.round(obj.val);}});
  });
 },heroRef);return()=>ctx.revert();},[]);

 const services=data.services?.length?data.services.slice(0,6):[
  {title:'Daily Car Rental',description:'Flexible premium mobility for city days and spontaneous plans.',slug:'daily-car-rental'},
  {title:'Monthly Rental',description:'Long-term convenience with transparent pricing and dedicated support.',slug:'monthly-car-rental'},
  {title:'Airport Transfers',description:'Reliable pickups and drop-offs planned around your flight schedule.',slug:'airport-transfers'},
  {title:'Corporate Rental',description:'Professional fleet solutions for teams, guests and executive travel.',slug:'corporate-car-rental'},
  {title:'Wedding Car Rental',description:'Elegant vehicles for barat, valima and special family occasions.',slug:'wedding-car-rental'},
  {title:'Chauffeur Service',description:'Driver-supported rentals for relaxed point-to-point movement.',slug:'chauffeur-service'},
 ];
 const featured=data.featured_vehicles?.length?data.featured_vehicles.slice(0,8):fallbackVehicles;
 const reviews=data.reviews?.length?data.reviews.slice(0,5):[
  {customer_name:'Ahmed Khan',location:'Lahore',rating:5,review:'Excellent service! The car was in perfect condition and the staff was very helpful. Will definitely use their services again.'},
  {customer_name:'Sara Ahmed',location:'Islamabad',rating:4,review:'Great experience renting from Crescent Rent a Car. The process was smooth and the car was delivered on time.'},
  {customer_name:'Usman Ali',location:'Karachi',rating:5,review:"I've rented multiple times from Crescent Rent a Car and they never disappoint. Highly recommended!"},
  {customer_name:'Ahsan R.',location:'Lahore',rating:5,review:'Smooth process, clean vehicle and clear communication from booking to handover.'},
  {customer_name:'Mariam K.',location:'Islamabad',rating:5,review:'The rental experience felt professional and straightforward, especially for a longer trip.'},
 ];
 const currentHero = heroSlides[heroSlide];
 return <div ref={heroRef}>
  <SeoHead canonical={`${brand.website}/`} description="Rent a car in Lahore, Islamabad and across Pakistan with Crescent Car Rental. Verified fleet, transparent daily/weekly/monthly rates, airport transfers, wedding cars, chauffeur service and fast 30-minute booking follow-up." structuredData={{'@context':'https://schema.org','@graph':[{'@type':'CarRental','name':brand.brandName,'url':brand.website,'telephone':brand.phoneDisplay,'email':brand.email,'description':brand.defaultSEO.description,'address':{'@type':'PostalAddress','streetAddress':brand.address,'addressCountry':'PK'},'openingHours':'Mo-Su 00:00-23:59','areaServed':['Lahore','Islamabad','Pakistan']},{'@type':'WebSite','name':brand.brandName,'url':brand.website,'potentialAction':{'@type':'SearchAction','target':`${brand.website}/cars?search={search_term_string}`,'query-input':'required name=search_term_string'}}]}} />

  <section className="hero-section">
   <div className="hero-grid-lines"/><div className="hero-red-glow"/>
   <div className="container-xxl hero-inner">
    <div className="hero-copy">
     <div className="hero-kicker"><span/> Premium mobility, redefined</div>
      <h1 className="hero-foggy" data-text="DRIVE YOUR NEXT STORY.">DRIVE YOUR<br/><em>NEXT STORY.</em></h1>
     <p>Find the right car for city errands, business travel, family trips or a northern escape. Choose your dates, compare clear daily rates and book online with a team that usually replies within 30 minutes.</p>
      <div className="hero-actions">
        <Button as="link" to="/book" variant="red" size="lg" magnetic>
          Book Your Ride <ArrowRight size={19} />
        </Button>
        <Button as="link" to="/cars" variant="ghost" size="lg">
          Explore Our Cars
        </Button>
      </div>
     <div className="hero-trust"><span><ShieldCheck size={17}/> Verified fleet</span><span><Clock3 size={17}/> Reply in ~30 min</span><span><MapPin size={17}/> Lahore · Islamabad</span></div>
     <div className="hero-metrics" aria-label="Crescent rental highlights">
      <span><strong className="counter-number" data-target="24">0</strong><small>/7 Booking</small></span>
      <span><strong>PKR</strong><small>Transparent pricing</small></span>
      <span><strong className="counter-number" data-target="4">0</strong><small>+ Regions</small></span>
     </div>
    </div>
    <div className="hero-visual">
     <div className="hero-number">01</div>
     <div className="hero-image-frame" onMouseEnter={()=>setHeroPaused(true)} onMouseLeave={()=>setHeroPaused(false)}>
      {showWebGL&&heroSlide===0&&<Suspense fallback={null}><WebGLHeroScene/></Suspense>}
      <div className="hero-slides">
       {heroSlides.map((slide,index)=><div className={`hero-slide ${index===heroSlide?'is-active':''}`} key={slide.slug}>
        <SmartImage className="hero-car" src={slide.src} alt={`${slide.name} rental car`} eager={index===0} card={false} sizes="(max-width: 900px) 100vw, 55vw"/>
       </div>)}
      </div>
      <div className="hero-slide-ui">
       <span className="hero-slide-count">{String(heroSlide+1).padStart(2,'0')} <em>/ {String(heroSlides.length).padStart(2,'0')}</em></span>
       <div className="hero-slide-arrows">
        <button type="button" onClick={()=>setHeroSlide((current)=>(current-1+heroSlides.length)%heroSlides.length)} aria-label="Previous featured car"><ArrowLeft size={15}/></button>
        <button type="button" onClick={()=>setHeroSlide((current)=>(current+1)%heroSlides.length)} aria-label="Next featured car"><ArrowRight size={15}/></button>
       </div>
      </div>
      <div className="hero-slide-progress"><span style={{width:`${((heroSlide+1)/heroSlides.length)*100}%`}}/></div>
      <div className="hero-scan-line"/>
     </div>
     <div className="hero-gallery">
      {heroSlides.map((slide,index)=><button type="button" className={`hero-gallery-item ${index===heroSlide?'is-active':''}`} key={slide.slug} onClick={()=>setHeroSlide(index)} aria-label={`Show ${slide.name}`} aria-pressed={index===heroSlide}>
       <SmartImage src={slide.src} alt={slide.name} sizes="(max-width: 900px) 25vw, 180px"/>
       <span>{slide.category}</span>
      </button>)}
     </div>
     <div className="hero-spec-float"><span>Premium Fleet</span><strong>Ready when your story starts.</strong></div>
     <div className="hero-availability-card">
      <span>Now showing · {currentHero.category}</span>
      <strong>{currentHero.name}</strong>
      <small>{brand.currency} {Number(currentHero.price).toLocaleString()} / day</small>
      <Link to={`/cars/${currentHero.slug}`} className="hero-slide-link">View this car <ArrowRight size={13}/></Link>
     </div>
    </div>
   </div>
   <div className="container-xxl hero-booking"><BookingSearchWidget locations={data.locations}/></div>
  </section>

  <section className="stats-band" aria-label="Crescent by the numbers">
   <div className="container-xxl stats-band-grid">
    <div className="stat-cell"><Counter to={brand.foundedYear}/><small>Founded in Lahore</small></div>
    <div className="stat-cell"><Counter to={50} suffix="+"/><small>Vehicles in fleet</small></div>
    <div className="stat-cell"><Counter to={4} suffix="+"/><small>Regions served</small></div>
    <div className="stat-cell"><Counter to={30} suffix=" min"/><small>Typical response</small></div>
   </div>
  </section>

  <section className="section section-soft reveal-section"><div className="container-xxl">
   <div className="cinematic-marquee" aria-hidden="true"><span>Luxury Rental</span><span>Airport Transfer</span><span>Monthly Plans</span><span>Corporate Fleet</span><span>Self Drive</span><span>Chauffeur Service</span></div>
   <div className="motors-strip">
    {categories.map(({title,text,icon:Icon,to,img},i)=><motion.div key={title} whileHover={{y:-6}} transition={{duration:.22}}><Link to={to} className="motors-strip-card"><div className="motors-strip-img"><SmartImage src={img} alt={title} sizes="(max-width: 768px) 100vw, 300px"/></div><Icon/><strong>{title}</strong><span>{text}</span></Link></motion.div>)}
   </div>
  </div></section>

  <section className="section section-dark reveal-section"><div className="container-xxl command-center">
   <div className="command-copy"><span className="eyebrow">Crescent rental flow</span><h2>From choosing a car to receiving your booking reference.</h2><p>Every step is shaped around real rental decisions: where you need the car, how long you need it, whether you want self-drive or a driver, and which vehicle best fits your route.</p><Button as="link" to="/book" variant="red" magnetic>Start Booking <ArrowRight size={17}/></Button></div>
   <div className="command-board" aria-label="How booking works at Crescent">
    {[
     ['01','Choose','Compare vehicles by category, seats, transmission and rental price.'],
     ['02','Plan','Select pickup location, return date, time and rental type.'],
     ['03','Request','Send your booking request with contact details and notes.'],
     ['04','Confirm','Crescent follows up with availability, price and handover details.'],
    ].map(([n,t,d])=><motion.div key={n} whileHover={{scale:1.025,y:-3}}><span>{n}</span><strong>{t}</strong><small>{d}</small></motion.div>)}
   </div>
  </div></section>

  <section className="section section-white reveal-section"><div className="container-xxl">
   <div className="split-heading">
    <SectionHeading eyebrow="Curated fleet" title="Choose the car that fits the moment." text="From efficient city sedans to commanding SUVs and luxury vehicles, every category is designed to match a different journey."/>
   </div>
   <SmartCarousel items={featured} trackClassName="vehicle-carousel fleet-carousel" ariaLabel="Featured Crescent rental cars" itemLabel="car" interval={5600}>
    {featured.map(v=><VehicleCard key={v.id} vehicle={v}/>) }
   </SmartCarousel>
  </div></section>

  <section className="section section-dark reveal-section special-offers-section"><div className="container-xxl offers-layout">
   <div className="offers-feature">
    <SectionHeading light eyebrow="Special offers" title="Rental packages for airport, monthly and corporate travel." text="Choose the rental path that fits your schedule: self-drive city use, chauffeur-supported airport transfers, monthly rentals, corporate movement or premium cars for important occasions."/>
    <div className="offers-visual-card img-zoom">
     <SmartImage src="assets/fleet/luxury-suv.webp" alt="Premium Crescent rental SUV" sizes="(max-width: 900px) 100vw, 50vw"/>
     <div><span>Featured package</span><strong>Fortuner, sedan and luxury options available</strong><small>Final pricing is confirmed by vehicle, duration and route.</small></div>
    </div>
    <div className="offers-actions"><Button as="link" to="/offers" variant="outline-light">View All Offers</Button><Link to="/book" className="text-link">Request a custom plan <ArrowRight size={16}/></Link></div>
   </div>
   <div className="offer-stack">{offers.map(({title,text,to,tag,meta,icon:Icon,features},i)=><motion.div key={title} whileHover={{y:-7}} transition={{duration:.22}}><Link to={to} className="offer-card"><div className="offer-card-top"><span>0{i+1}</span><small>{tag}</small></div><Icon className="offer-icon"/><strong>{meta}</strong><h3>{title}</h3><p>{text}</p><div className="offer-features">{features.map(f=><em key={f}>{f}</em>)}</div><div className="offer-card-cta">Explore package <ArrowRight size={16}/></div></Link></motion.div>)}</div>
  </div></section>

  <section className="section section-dark reveal-section"><div className="container-xxl story-grid">
   <Reveal anim="left" className="story-visual"><div className="story-image img-zoom"><SmartImage src="assets/fleet/executive-suv.webp" alt="Premium Crescent rental vehicle" sizes="(max-width: 900px) 100vw, 50vw"/></div><div className="story-stat"><strong>One simple process.</strong><span>Search - Select - Book - Drive</span></div></Reveal>
   <Reveal anim="right"><SectionHeading light eyebrow="The Crescent experience" title="More than a rental. A smoother way to move." text="Every step is designed around speed, clarity and dependable service - from vehicle selection to booking confirmation."/>
    <div className="benefit-list"><div><ShieldCheck/><span><strong>Confidence first</strong><small>Clear vehicle details, honest pricing and a booking status you can trust.</small></span></div><div><WalletCards/><span><strong>Pricing with clarity</strong><small>See daily, weekly and monthly rates before you reserve — no surprises at handover.</small></span></div><div><CalendarCheck/><span><strong>Real availability</strong><small>Your dates are checked against confirmed bookings before we confirm your car.</small></span></div></div>
    <Button as="link" to="/about" variant="outline-light" className="mt-4">Discover Crescent</Button>
   </Reveal>
  </div></section>

  <section className="section section-white reveal-section"><div className="container-xxl brand-showcase">
   <SectionHeading eyebrow="Popular makes" title="Search by the brands customers ask for most." text="Explore the makes customers ask for most — from dependable Toyotas to executive Audis, BMWs and Mercedes-Benz models."/>
   <div className="brand-grid">{['Toyota','Audi','BMW','Mercedes-Benz','SUV','Luxury'].map((item)=><Link to={`/cars?search=${encodeURIComponent(item)}`} key={item}>{item}<ArrowRight size={16}/></Link>)}</div>
  </div></section>

  <section className="section section-soft reveal-section"><div className="container-xxl"><SectionHeading eyebrow="Rental options" title="Built around the way you travel." text="Flexible services for everyday travel, longer stays, airport movement, weddings and business mobility." align="center"/>
   <div className="service-grid">{services.map((s,i)=><Link to={`/services/${s.slug||''}`} className="service-card" key={s.id||s.title}><span className="service-index">0{i+1}</span>{createElement([CarFront,CalendarCheck,MapPin,Users,Sparkles,Plane][i%6],{size:28})}<h3>{s.title}</h3><p>{s.description}</p><span className="service-arrow"><ArrowRight/></span></Link>)}</div>
  </div></section>

  <section className="section section-dark reveal-section"><div className="container-xxl trust-grid">
   <div className="trust-panel"><Award/><span className="eyebrow">Why Crescent</span><h2>Premium rental cars, clear pricing and a team that follows through.</h2><p>Crescent is built for customers who want a clean car, a reliable handover, clear communication and rental options that fit the journey - from daily city drives to monthly use, airport transfers and executive travel.</p></div>
   {[['Well-kept rental fleet','Choose from economy cars, sedans, SUVs and luxury vehicles maintained for comfort, cleanliness and dependable travel.'],['Flexible rental choices','Book self-drive or driver-supported rentals for daily trips, monthly plans, airport movement, corporate guests and events.'],['Clear booking follow-up','Submit your vehicle, date and route details online so the Crescent team can confirm availability, pricing and handover steps.']].map(([t,d])=><div className="trust-mini" key={t}><CheckCircle2/><h3>{t}</h3><p>{d}</p></div>)}
  </div></section>

  <section className="section section-white reveal-section"><div className="container-xxl"><SectionHeading eyebrow="How it works" title="Your ride in four clear steps." align="center"/>
   <div className="steps-grid">{[['01','Discover','Browse the fleet and compare the vehicle that suits your plan.',Sparkles],['02','Check','Choose your dates and location so we can confirm availability.',CalendarCheck],['03','Book','Enter your details and review a clear, itemised estimate.',WalletCards],['04','Drive','Receive your booking reference and we will guide you through handover.',CarFront]].map(([n,t,d,Icon])=><div className="step-card" key={n}><div className="step-top"><span>{n}</span><Icon/></div><h3>{t}</h3><p>{d}</p></div>)}</div>
  </div></section>

  <section className="section section-soft reveal-section"><div className="container-xxl">
   <SectionHeading eyebrow="Customer stories" title="Confidence from the first message to handover." text="Real feedback from customers across Lahore, Islamabad and beyond." align="center"/>
   <SmartCarousel items={reviews} trackClassName="testimonial-carousel" ariaLabel="Customer reviews" itemLabel="review" interval={6400}>
    {reviews.map((r)=><motion.article className="testimonial-card" key={r.id||r.customer_name} whileHover={{y:-5}}><Quote/><p>{r.review}</p><div><strong>{r.customer_name}</strong><span>{r.location||'Crescent customer'} · {(r.rating||5)}.0 rating</span></div></motion.article>)}
   </SmartCarousel>
   <div style={{textAlign:'center',marginTop:36}}><Link to="/reviews" className="text-link">Read all reviews <ArrowRight size={15}/></Link></div>
  </div></section>

  <section className="section section-white reveal-section"><div className="container-xxl seo-grid-section">
   <SectionHeading eyebrow="Rental searches" title="Useful pages for the ways people search." text="Each page answers the questions customers actually ask, with practical details for the rental you need."/>
   <div className="seo-topic-grid">{seoTopics.map(([title,text,to])=><Link to={to} key={title}><h3>{title}</h3><p>{text}</p><span>Open page <ArrowRight size={15}/></span></Link>)}</div>
  </div></section>

  <section className="section section-dark reveal-section"><div className="container-xxl faq-preview">
   <div><SectionHeading light eyebrow="Questions" title="Before you book, know how it works." text="Short, straightforward answers to the questions customers ask us most."/><Button as="link" to="/faq" variant="outline-light">View FAQs</Button></div>
   <div className="faq-mini-list">{(data.faqs?.length?data.faqs.slice(0,4):homeFaqs).map((f,i)=><details key={f.id||i}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div>
  </div></section>

  <section className="cta-band reveal-section"><div className="container-xxl cta-band-inner">   <div><span className="eyebrow">Your next story starts here</span><h2>Ready to get behind the wheel?</h2><p>Find a premium ride, choose your dates and send your booking request in minutes.</p></div><div><Button as="link" to="/book" variant="light" size="lg" magnetic>Book Your Ride <ArrowRight size={18}/></Button><a href={brand.phoneHref} className="cta-phone">or call {brand.phoneDisplay}</a></div></div></section>
 </div>;
}
