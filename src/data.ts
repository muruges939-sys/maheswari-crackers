// ✏️ EDIT ALL BUSINESS DETAILS HERE. Placeholders only – nothing below is real business data.
export const SITE = {
  name: 'MAHESWARI CRACKERS',
  phone: '+91 00000 00000',
  whatsapp: '910000000000', // country code + number, no "+"
  email: 'hello@example.com',
  address: 'Your shop address, City, State – PIN',
  socials: { instagram: '#', facebook: '#', youtube: '#' },
}
export const EXPERIENCE = {
  giftBuilderTitle: 'Build Your Gift Box',
  giftBuilderDescription: 'Choose categories and quantities, then send your selection as an enquiry.',
  giftBuilderMessage: 'Hello Maheswari Crackers, I would like to enquire about a custom gift box:',
  safetyText: 'Celebrate responsibly. Follow product instructions, local restrictions and applicable Indian fireworks laws.',
  celebrationTargetDate: '',
}
export const NAV = [['Home','home'],['About','about'],['Collections','collections'],['Gallery','gallery'],['Our Story','story'],['Contact','contact']] as const
export const FRAME_COUNT = 10
const unsplash = (id: string, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D`
export const FIREWORKS_PHOTOS = {
  fireworks: unsplash('photo-1560986752-2e31d9507413'),
  fireworksNight: unsplash('photo-1549194400-06e6874c2fd1'),
  fireworksIndia: unsplash('photo-1592843997881-cab3860b1067'),
  festival: unsplash('photo-1577083753695-e010191bacb5'),
  sparkler: unsplash('photo-1509910110001-4e756f86fbd3'),
  giftBox: unsplash('photo-1549465220-1a8b9238cd48'),
  fallback: unsplash('photo-1560986752-2e31d9507413', 960),
}
export const FIREWORKS_FRAMES = [
  FIREWORKS_PHOTOS.fireworks, FIREWORKS_PHOTOS.fireworksNight,
  FIREWORKS_PHOTOS.sparkler, FIREWORKS_PHOTOS.fireworksIndia,
  FIREWORKS_PHOTOS.festival, FIREWORKS_PHOTOS.fireworks,
  FIREWORKS_PHOTOS.fireworksNight, FIREWORKS_PHOTOS.sparkler,
  FIREWORKS_PHOTOS.fireworksIndia, FIREWORKS_PHOTOS.festival,
]
export const CATEGORIES = ['Sparklers','Flower Pots','Ground Chakkars','Rockets','Fountains','Gift Boxes','Celebration Collections'] as const
export type Category = typeof CATEGORIES[number]
export interface Product { id:string; name:string; category:Category; description:string; price:string; image?:string }
// price: '' → shows "Price on enquiry". Product images are illustrative stock photos, not shop inventory.
export const PRODUCTS: Product[] = [
  {id:'sp1',name:'Golden Sparkler Set',category:'Sparklers',description:'Placeholder – soft golden sparks for hand-held celebration.',price:''},
  {id:'sp2',name:'Colour Sparkler Pack',category:'Sparklers',description:'Placeholder – multi-colour sparklers for family evenings.',price:''},
  {id:'fp1',name:'Royal Flower Pot',category:'Flower Pots',description:'Placeholder – a fountain of glowing sparks.',price:''},
  {id:'fp2',name:'Deluxe Flower Pot',category:'Flower Pots',description:'Placeholder – taller, longer-lasting bloom.',price:''},
  {id:'gc1',name:'Spinning Ground Chakkar',category:'Ground Chakkars',description:'Placeholder – a bright spinning wheel of light.',price:''},
  {id:'rk1',name:'Sky Rocket Pack',category:'Rockets',description:'Placeholder – ascending trails and bursts.',price:''},
  {id:'ft1',name:'Celebration Fountain',category:'Fountains',description:'Placeholder – cascading golden fountain.',price:''},
  {id:'gb1',name:'Signature Gift Box',category:'Gift Boxes',description:'Placeholder – premium purple & gold gift assortment.',price:'', image:FIREWORKS_PHOTOS.giftBox},
  {id:'gb2',name:'Festive Gift Hamper',category:'Gift Boxes',description:'Placeholder – curated hamper for gifting.',price:'', image:FIREWORKS_PHOTOS.giftBox},
  {id:'cc1',name:'Grand Celebration Collection',category:'Celebration Collections',description:'Placeholder – a complete assortment for big occasions.',price:''},
]
export const GALLERY = [
  {src:FIREWORKS_PHOTOS.fireworks,cap:'Fireworks display'},{src:FIREWORKS_PHOTOS.giftBox,cap:'Gift packaging inspiration'},
  {src:FIREWORKS_PHOTOS.fireworksNight,cap:'Fireworks at night'},{src:FIREWORKS_PHOTOS.sparkler,cap:'Sparkler photography'},
  {src:FIREWORKS_PHOTOS.fireworksIndia,cap:'Festival fireworks'},{src:FIREWORKS_PHOTOS.festival,cap:'Festival celebration'},
  {src:FIREWORKS_PHOTOS.fireworks,cap:'Fireworks in the night sky'},{src:FIREWORKS_PHOTOS.sparkler,cap:'Golden sparks'},
]
export const ABOUT = [
  {t:'Our Story',d:'Placeholder – share how Maheswari Crackers began and what it stands for.'},
  {t:'Our Vision',d:'Placeholder – describe the experience you want every celebration to have.'},
  {t:'Our Commitment',d:'Placeholder – quality, safety guidance and service promises go here.'},
  {t:'Customer Experience',d:'Placeholder – how customers are advised, supported and served.'},
]
