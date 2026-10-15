// Edit business details here. Placeholders are marked TODO.
export const biz = {
  name: 'LapNest', tagline: 'Business-grade laptops to rent or buy',
  phone: '8618854283', whatsapp: '918618854283', email: 'nnarasimhamurthycn@gmail.com',
  instagram: 'https://instagram.com/mass_murthy',
  facebook: 'https://facebook.com/your-page',            // TODO
  address: 'Your store address, Bengaluru, Karnataka',  // TODO
  hours: 'Mon–Sat, 10 am – 7 pm',                       // TODO
  adVideo: '/ads/laptop-ad.mp4', // put the file in frontend/public/ads/
  adYoutubeId: '',               // OR paste a YouTube video ID here (used instead of the file)
  mapQuery: 'Bengaluru, Karnataka',                     // TODO: use your store address
};
export const wa = (t = 'Hello, I want to know about your laptops') => `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(t)}`;