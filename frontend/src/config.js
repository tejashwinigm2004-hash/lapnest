// Edit business details here. Placeholders are marked TODO.
export const biz = {
  name: 'LapNest', tagline: 'Business-grade laptops to rent or buy',
  phone: '9632214760', whatsapp: '919632214760', email: 'rtejas672@gmail.com',
  instagram: 'https://instagram.com/mass_murthy',
  address: 'Hustlehub Tech Park, 36/5, Somasundarapalya, 27th Main Rd, Sector 2, HSR Layout, Bengaluru, Karnataka 560102',
  hours: 'Mon–Sat, 10 am – 7 pm',                       // TODO
  adVideo: '/ads/laptop-ad.mp4', // put the file in frontend/public/ads/
  adYoutubeId: '',               // OR paste a YouTube video ID here (used instead of the file)
  mapQuery: 'Hustlehub Tech Park, 36/5, Somasundarapalya, 27th Main Rd, Sector 2, HSR Layout, Bengaluru, Karnataka 560102',
};
export const wa = (t = 'Hello, I want to know about your laptops') => `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(t)}`;