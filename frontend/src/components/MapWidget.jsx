import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Loader, TrendingUp, TrendingDown } from 'lucide-react';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationClick = ({ onLocationFound }) => {
  useMapEvents({
    click(e) { onLocationFound(e.latlng); },
  });
  return null;
};

/* ─────────────────────────────────────────────────────────────────────────────
   CROP DATABASE — city → state → country hierarchy
   Each crop entry: { icon, name, current, forecast, unit, trend }
   trend: 'up' | 'down' | 'stable'
───────────────────────────────────────────────────────────────────────────── */
const CROP_DB = {
  // ══════════════════════ INDIA — CITIES ══════════════════════
  'chennai':      { crops: [{ icon:'🍚', name:'Rice',       current:'₹2,480', forecast:'₹2,650', unit:'/q', trend:'up'   },
                             { icon:'🥜', name:'Groundnut',  current:'₹5,300', forecast:'₹5,600', unit:'/q', trend:'up'   },
                             { icon:'🍅', name:'Tomato',     current:'₹1,600', forecast:'₹2,200', unit:'/q', trend:'up'   },
                             { icon:'🧅', name:'Onion',      current:'₹1,400', forecast:'₹2,100', unit:'/q', trend:'up'   }], city:'Chennai', country:'India' },

  'mumbai':       { crops: [{ icon:'🎀', name:'Cotton',     current:'₹5,900', forecast:'₹6,300', unit:'/q', trend:'up'   },
                             { icon:'🧅', name:'Onion',      current:'₹1,500', forecast:'₹2,800', unit:'/q', trend:'up'   },
                             { icon:'🍚', name:'Rice',       current:'₹2,450', forecast:'₹2,600', unit:'/q', trend:'up'   },
                             { icon:'🍅', name:'Tomato',     current:'₹1,900', forecast:'₹2,500', unit:'/q', trend:'up'   }], city:'Mumbai', country:'India' },

  'delhi':        { crops: [{ icon:'🌾', name:'Wheat',      current:'₹2,650', forecast:'₹2,850', unit:'/q', trend:'up'   },
                             { icon:'🥔', name:'Potato',     current:'₹1,200', forecast:'₹1,500', unit:'/q', trend:'up'   },
                             { icon:'🧅', name:'Onion',      current:'₹1,600', forecast:'₹2,400', unit:'/q', trend:'up'   },
                             { icon:'🍅', name:'Tomato',     current:'₹2,100', forecast:'₹2,700', unit:'/q', trend:'up'   }], city:'Delhi', country:'India' },

  'bangalore':    { crops: [{ icon:'🍅', name:'Tomato',     current:'₹1,800', forecast:'₹2,500', unit:'/q', trend:'up'   },
                             { icon:'🌽', name:'Maize',      current:'₹1,950', forecast:'₹2,100', unit:'/q', trend:'up'   },
                             { icon:'🌱', name:'Soybean',    current:'₹4,600', forecast:'₹4,850', unit:'/q', trend:'up'   },
                             { icon:'🥦', name:'Ragi',       current:'₹3,400', forecast:'₹3,700', unit:'/q', trend:'up'   }], city:'Bangalore', country:'India' },

  'bengaluru':    { crops: [{ icon:'🍅', name:'Tomato',     current:'₹1,800', forecast:'₹2,500', unit:'/q', trend:'up'   },
                             { icon:'🌽', name:'Maize',      current:'₹1,950', forecast:'₹2,100', unit:'/q', trend:'up'   },
                             { icon:'🌱', name:'Soybean',    current:'₹4,600', forecast:'₹4,850', unit:'/q', trend:'up'   },
                             { icon:'🥦', name:'Ragi',       current:'₹3,400', forecast:'₹3,700', unit:'/q', trend:'up'   }], city:'Bengaluru', country:'India' },

  'hyderabad':    { crops: [{ icon:'🍚', name:'Rice',       current:'₹2,450', forecast:'₹2,600', unit:'/q', trend:'up'   },
                             { icon:'🌽', name:'Maize',      current:'₹1,960', forecast:'₹2,120', unit:'/q', trend:'up'   },
                             { icon:'🎀', name:'Cotton',     current:'₹5,800', forecast:'₹6,200', unit:'/q', trend:'up'   },
                             { icon:'🌱', name:'Soybean',    current:'₹4,650', forecast:'₹4,900', unit:'/q', trend:'up'   }], city:'Hyderabad', country:'India' },

  'kolkata':      { crops: [{ icon:'🍚', name:'Rice',       current:'₹2,420', forecast:'₹2,580', unit:'/q', trend:'up'   },
                             { icon:'🥔', name:'Potato',     current:'₹1,180', forecast:'₹1,480', unit:'/q', trend:'up'   },
                             { icon:'🍅', name:'Tomato',     current:'₹1,750', forecast:'₹2,300', unit:'/q', trend:'up'   },
                             { icon:'🫚', name:'Jute',       current:'₹4,800', forecast:'₹5,100', unit:'/q', trend:'up'   }], city:'Kolkata', country:'India' },

  'ahmedabad':    { crops: [{ icon:'🎀', name:'Cotton',     current:'₹5,800', forecast:'₹6,300', unit:'/q', trend:'up'   },
                             { icon:'🥜', name:'Groundnut',  current:'₹5,200', forecast:'₹5,600', unit:'/q', trend:'up'   },
                             { icon:'🌾', name:'Wheat',      current:'₹2,650', forecast:'₹2,850', unit:'/q', trend:'up'   },
                             { icon:'🧅', name:'Onion',      current:'₹1,550', forecast:'₹2,700', unit:'/q', trend:'up'   }], city:'Ahmedabad', country:'India' },

  'pune':         { crops: [{ icon:'🧅', name:'Onion',      current:'₹1,500', forecast:'₹2,800', unit:'/q', trend:'up'   },
                             { icon:'🍬', name:'Sugarcane',  current:'₹335',   forecast:'₹365',   unit:'/q', trend:'up'   },
                             { icon:'🍇', name:'Grapes',     current:'₹6,500', forecast:'₹7,200', unit:'/q', trend:'up'   },
                             { icon:'🍅', name:'Tomato',     current:'₹1,800', forecast:'₹2,400', unit:'/q', trend:'up'   }], city:'Pune', country:'India' },

  'jaipur':       { crops: [{ icon:'🌾', name:'Wheat',      current:'₹2,650', forecast:'₹2,850', unit:'/q', trend:'up'   },
                             { icon:'🌽', name:'Maize',      current:'₹1,950', forecast:'₹2,100', unit:'/q', trend:'up'   },
                             { icon:'🌻', name:'Mustard',    current:'₹5,200', forecast:'₹5,600', unit:'/q', trend:'up'   },
                             { icon:'🥜', name:'Groundnut',  current:'₹5,200', forecast:'₹5,500', unit:'/q', trend:'up'   }], city:'Jaipur', country:'India' },

  'lucknow':      { crops: [{ icon:'🌾', name:'Wheat',      current:'₹2,650', forecast:'₹2,850', unit:'/q', trend:'up'   },
                             { icon:'🍬', name:'Sugarcane',  current:'₹340',   forecast:'₹370',   unit:'/q', trend:'up'   },
                             { icon:'🥔', name:'Potato',     current:'₹1,200', forecast:'₹1,500', unit:'/q', trend:'up'   },
                             { icon:'🧅', name:'Onion',      current:'₹1,600', forecast:'₹2,400', unit:'/q', trend:'up'   }], city:'Lucknow', country:'India' },

  'nagpur':       { crops: [{ icon:'🍊', name:'Orange',     current:'₹4,500', forecast:'₹5,200', unit:'/q', trend:'up'   },
                             { icon:'🎀', name:'Cotton',     current:'₹5,800', forecast:'₹6,200', unit:'/q', trend:'up'   },
                             { icon:'🌱', name:'Soybean',    current:'₹4,600', forecast:'₹4,850', unit:'/q', trend:'up'   },
                             { icon:'🌾', name:'Wheat',      current:'₹2,650', forecast:'₹2,850', unit:'/q', trend:'up'   }], city:'Nagpur', country:'India' },

  'coimbatore':   { crops: [{ icon:'🎀', name:'Cotton',     current:'₹5,850', forecast:'₹6,250', unit:'/q', trend:'up'   },
                             { icon:'🌽', name:'Maize',      current:'₹1,960', forecast:'₹2,120', unit:'/q', trend:'up'   },
                             { icon:'🍚', name:'Rice',       current:'₹2,450', forecast:'₹2,600', unit:'/q', trend:'up'   },
                             { icon:'🥥', name:'Coconut',    current:'₹18,000',forecast:'₹20,000',unit:'/t', trend:'up'   }], city:'Coimbatore', country:'India' },

  'madurai':      { crops: [{ icon:'🍚', name:'Rice',       current:'₹2,480', forecast:'₹2,650', unit:'/q', trend:'up'   },
                             { icon:'🍌', name:'Banana',     current:'₹3,200', forecast:'₹3,600', unit:'/q', trend:'up'   },
                             { icon:'🥥', name:'Coconut',    current:'₹17,500',forecast:'₹19,500',unit:'/t', trend:'up'   },
                             { icon:'🫘', name:'Pulses',     current:'₹6,200', forecast:'₹6,600', unit:'/q', trend:'up'   }], city:'Madurai', country:'India' },

  'patna':        { crops: [{ icon:'🌾', name:'Wheat',      current:'₹2,600', forecast:'₹2,800', unit:'/q', trend:'up'   },
                             { icon:'🥔', name:'Potato',     current:'₹1,150', forecast:'₹1,450', unit:'/q', trend:'up'   },
                             { icon:'🍚', name:'Rice',       current:'₹2,400', forecast:'₹2,560', unit:'/q', trend:'up'   },
                             { icon:'🌽', name:'Maize',      current:'₹1,900', forecast:'₹2,050', unit:'/q', trend:'up'   }], city:'Patna', country:'India' },

  'bhopal':       { crops: [{ icon:'🌾', name:'Wheat',      current:'₹2,650', forecast:'₹2,850', unit:'/q', trend:'up'   },
                             { icon:'🌱', name:'Soybean',    current:'₹4,600', forecast:'₹4,850', unit:'/q', trend:'up'   },
                             { icon:'🧅', name:'Onion',      current:'₹1,500', forecast:'₹2,300', unit:'/q', trend:'up'   },
                             { icon:'🌽', name:'Maize',      current:'₹1,950', forecast:'₹2,100', unit:'/q', trend:'up'   }], city:'Bhopal', country:'India' },

  'visakhapatnam':{ crops: [{ icon:'🍚', name:'Rice',       current:'₹2,450', forecast:'₹2,610', unit:'/q', trend:'up'   },
                             { icon:'🌽', name:'Maize',      current:'₹1,950', forecast:'₹2,100', unit:'/q', trend:'up'   },
                             { icon:'🌱', name:'Soybean',    current:'₹4,600', forecast:'₹4,850', unit:'/q', trend:'up'   },
                             { icon:'🫘', name:'Pulses',     current:'₹6,100', forecast:'₹6,500', unit:'/q', trend:'up'   }], city:'Visakhapatnam', country:'India' },

  // ══════════════════════ USA — CITIES ══════════════════════
  'new york':     { crops: [{ icon:'🍎', name:'Apple',      current:'$520',   forecast:'$580',   unit:'/t', trend:'up'   },
                             { icon:'🥦', name:'Broccoli',   current:'$900',   forecast:'$970',   unit:'/t', trend:'up'   },
                             { icon:'🥕', name:'Carrot',     current:'$430',   forecast:'$480',   unit:'/t', trend:'up'   },
                             { icon:'🥔', name:'Potato',     current:'$290',   forecast:'$320',   unit:'/t', trend:'stable'}], city:'New York', country:'USA' },

  'los angeles':  { crops: [{ icon:'🥑', name:'Avocado',    current:'$2,100', forecast:'$2,400', unit:'/t', trend:'up'   },
                             { icon:'🍇', name:'Grapes',     current:'$1,200', forecast:'$1,350', unit:'/t', trend:'up'   },
                             { icon:'🍊', name:'Orange',     current:'$380',   forecast:'$420',   unit:'/t', trend:'up'   },
                             { icon:'🍅', name:'Tomato',     current:'$88',    forecast:'$100',   unit:'/t', trend:'up'   }], city:'Los Angeles', country:'USA' },

  'chicago':      { crops: [{ icon:'🌽', name:'Corn',       current:'$185',   forecast:'$205',   unit:'/bu',trend:'up'   },
                             { icon:'🌱', name:'Soybean',    current:'$1,380', forecast:'$1,500', unit:'/t', trend:'up'   },
                             { icon:'🌾', name:'Wheat',      current:'$212',   forecast:'$230',   unit:'/bu',trend:'up'   },
                             { icon:'🥓', name:'Sorghum',    current:'$195',   forecast:'$215',   unit:'/bu',trend:'up'   }], city:'Chicago', country:'USA' },

  'houston':      { crops: [{ icon:'🎀', name:'Cotton',     current:'$0.85',  forecast:'$0.95',  unit:'/lb',trend:'up'   },
                             { icon:'🌾', name:'Wheat',      current:'$210',   forecast:'$230',   unit:'/bu',trend:'up'   },
                             { icon:'🌻', name:'Sunflower',  current:'$580',   forecast:'$640',   unit:'/t', trend:'up'   },
                             { icon:'🌽', name:'Corn',       current:'$185',   forecast:'$205',   unit:'/bu',trend:'up'   }], city:'Houston', country:'USA' },

  'seattle':      { crops: [{ icon:'🍎', name:'Apple',      current:'$550',   forecast:'$610',   unit:'/t', trend:'up'   },
                             { icon:'🍒', name:'Cherry',     current:'$3,200', forecast:'$3,600', unit:'/t', trend:'up'   },
                             { icon:'🌾', name:'Wheat',      current:'$210',   forecast:'$230',   unit:'/bu',trend:'up'   },
                             { icon:'🫐', name:'Blueberry',  current:'$4,500', forecast:'$5,000', unit:'/t', trend:'up'   }], city:'Seattle', country:'USA' },

  // ══════════════════════ CHINA — CITIES ══════════════════════
  'beijing':      { crops: [{ icon:'🌽', name:'Corn',       current:'¥2,650', forecast:'¥2,900', unit:'/t', trend:'up'   },
                             { icon:'🌾', name:'Wheat',      current:'¥2,520', forecast:'¥2,750', unit:'/t', trend:'up'   },
                             { icon:'🥬', name:'Cabbage',    current:'¥850',   forecast:'¥920',   unit:'/t', trend:'stable'},
                             { icon:'🥕', name:'Carrot',     current:'¥1,200', forecast:'¥1,350', unit:'/t', trend:'up'   }], city:'Beijing', country:'China' },

  'shanghai':     { crops: [{ icon:'🍚', name:'Rice',       current:'¥2,900', forecast:'¥3,150', unit:'/t', trend:'up'   },
                             { icon:'🌱', name:'Soybean',    current:'¥5,850', forecast:'¥6,300', unit:'/t', trend:'up'   },
                             { icon:'🍊', name:'Orange',     current:'¥5,500', forecast:'¥6,100', unit:'/t', trend:'up'   },
                             { icon:'🍅', name:'Tomato',     current:'¥3,200', forecast:'¥3,600', unit:'/t', trend:'up'   }], city:'Shanghai', country:'China' },

  'chengdu':      { crops: [{ icon:'🍚', name:'Rice',       current:'¥2,880', forecast:'¥3,100', unit:'/t', trend:'up'   },
                             { icon:'🌶️', name:'Chilli',    current:'¥6,000', forecast:'¥6,800', unit:'/t', trend:'up'   },
                             { icon:'🍊', name:'Citrus',     current:'¥5,500', forecast:'¥6,200', unit:'/t', trend:'up'   },
                             { icon:'🫚', name:'Rapeseed',   current:'¥6,200', forecast:'¥6,800', unit:'/t', trend:'up'   }], city:'Chengdu', country:'China' },

  'guangzhou':    { crops: [{ icon:'🍚', name:'Rice',       current:'¥2,900', forecast:'¥3,150', unit:'/t', trend:'up'   },
                             { icon:'🍌', name:'Banana',     current:'¥4,200', forecast:'¥4,700', unit:'/t', trend:'up'   },
                             { icon:'🥬', name:'Vegetables', current:'¥1,800', forecast:'¥2,100', unit:'/t', trend:'up'   },
                             { icon:'🍍', name:'Pineapple',  current:'¥5,500', forecast:'¥6,200', unit:'/t', trend:'up'   }], city:'Guangzhou', country:'China' },

  // ══════════════════════ BRAZIL — CITIES ══════════════════════
  'são paulo':    { crops: [{ icon:'🌱', name:'Soybean',    current:'R$155',  forecast:'R$175',  unit:'/bag',trend:'up'  },
                             { icon:'🍬', name:'Sugarcane',  current:'R$110',  forecast:'R$125',  unit:'/t', trend:'up'   },
                             { icon:'☕', name:'Coffee',     current:'R$1,200',forecast:'R$1,400',unit:'/bag',trend:'up'  },
                             { icon:'🍊', name:'Orange',     current:'R$32',   forecast:'R$38',   unit:'/box',trend:'up'  }], city:'São Paulo', country:'Brazil' },

  'brasília':     { crops: [{ icon:'🌱', name:'Soybean',    current:'R$158',  forecast:'R$178',  unit:'/bag',trend:'up'  },
                             { icon:'🌽', name:'Corn',       current:'R$60',   forecast:'R$70',   unit:'/bag',trend:'up'  },
                             { icon:'🎀', name:'Cotton',     current:'R$150',  forecast:'R$168',  unit:'/@',  trend:'up'  },
                             { icon:'🌾', name:'Wheat',      current:'R$78',   forecast:'R$88',   unit:'/bag',trend:'up'  }], city:'Brasília', country:'Brazil' },

  // ══════════════════════ UK — CITIES ══════════════════════
  'london':       { crops: [{ icon:'🌾', name:'Wheat',      current:'£220',   forecast:'£240',   unit:'/t', trend:'up'   },
                             { icon:'🥔', name:'Potato',     current:'£160',   forecast:'£180',   unit:'/t', trend:'up'   },
                             { icon:'🍎', name:'Apple',      current:'£420',   forecast:'£470',   unit:'/t', trend:'up'   },
                             { icon:'🌾', name:'Barley',     current:'£190',   forecast:'£210',   unit:'/t', trend:'up'   }], city:'London', country:'UK' },

  'manchester':   { crops: [{ icon:'🌾', name:'Wheat',      current:'£218',   forecast:'£238',   unit:'/t', trend:'up'   },
                             { icon:'🌾', name:'Barley',     current:'£188',   forecast:'£208',   unit:'/t', trend:'up'   },
                             { icon:'🥔', name:'Potato',     current:'£158',   forecast:'£178',   unit:'/t', trend:'up'   },
                             { icon:'🫐', name:'Blueberry',  current:'£3,800', forecast:'£4,300', unit:'/t', trend:'up'   }], city:'Manchester', country:'UK' },

  // ══════════════════════ AUSTRALIA — CITIES ══════════════════════
  'sydney':       { crops: [{ icon:'🌾', name:'Wheat',      current:'A$375',  forecast:'A$415',  unit:'/t', trend:'up'   },
                             { icon:'🍎', name:'Apple',      current:'A$1,200',forecast:'A$1,350',unit:'/t', trend:'up'   },
                             { icon:'🍇', name:'Grapes',     current:'A$980',  forecast:'A$1,100',unit:'/t', trend:'up'   },
                             { icon:'🥑', name:'Avocado',    current:'A$2,400',forecast:'A$2,700',unit:'/t', trend:'up'   }], city:'Sydney', country:'Australia' },

  'melbourne':    { crops: [{ icon:'🌾', name:'Wheat',      current:'A$370',  forecast:'A$410',  unit:'/t', trend:'up'   },
                             { icon:'🍎', name:'Apple',      current:'A$1,180',forecast:'A$1,320',unit:'/t', trend:'up'   },
                             { icon:'🥛', name:'Dairy',      current:'A$680',  forecast:'A$750',  unit:'/t', trend:'up'   },
                             { icon:'🫐', name:'Blueberry',  current:'A$8,500',forecast:'A$9,500',unit:'/t', trend:'up'   }], city:'Melbourne', country:'Australia' },

  'brisbane':     { crops: [{ icon:'🍬', name:'Sugarcane',  current:'A$42',   forecast:'A$48',   unit:'/t', trend:'up'   },
                             { icon:'🥭', name:'Mango',      current:'A$1,900',forecast:'A$2,200',unit:'/t', trend:'up'   },
                             { icon:'🍍', name:'Pineapple',  current:'A$1,100',forecast:'A$1,300',unit:'/t', trend:'up'   },
                             { icon:'🌽', name:'Corn',       current:'A$315',  forecast:'A$355',  unit:'/t', trend:'up'   }], city:'Brisbane', country:'Australia' },

  // ══════════════════════ FRANCE — CITIES ══════════════════════
  'paris':        { crops: [{ icon:'🌾', name:'Wheat',      current:'€228',   forecast:'€252',   unit:'/t', trend:'up'   },
                             { icon:'🍷', name:'Wine Grape', current:'€850',   forecast:'€950',   unit:'/t', trend:'up'   },
                             { icon:'🥔', name:'Potato',     current:'€185',   forecast:'€205',   unit:'/t', trend:'up'   },
                             { icon:'🌻', name:'Sunflower',  current:'€420',   forecast:'€465',   unit:'/t', trend:'up'   }], city:'Paris', country:'France' },

  'bordeaux':     { crops: [{ icon:'🍷', name:'Wine Grape', current:'€1,200', forecast:'€1,400', unit:'/t', trend:'up'   },
                             { icon:'🌻', name:'Sunflower',  current:'€418',   forecast:'€462',   unit:'/t', trend:'up'   },
                             { icon:'🌾', name:'Wheat',      current:'€225',   forecast:'€250',   unit:'/t', trend:'up'   },
                             { icon:'🌽', name:'Corn',       current:'€198',   forecast:'€220',   unit:'/t', trend:'up'   }], city:'Bordeaux', country:'France' },

  // ══════════════════════ GERMANY ══════════════════════
  'berlin':       { crops: [{ icon:'🌾', name:'Wheat',      current:'€222',   forecast:'€245',   unit:'/t', trend:'up'   },
                             { icon:'🥔', name:'Potato',     current:'€182',   forecast:'€200',   unit:'/t', trend:'up'   },
                             { icon:'🍺', name:'Barley',     current:'€202',   forecast:'€222',   unit:'/t', trend:'up'   },
                             { icon:'🌻', name:'Sunflower',  current:'€415',   forecast:'€458',   unit:'/t', trend:'up'   }], city:'Berlin', country:'Germany' },

  // ══════════════════════ JAPAN — CITIES ══════════════════════
  'tokyo':        { crops: [{ icon:'🍚', name:'Rice',       current:'¥62,000',forecast:'¥68,000',unit:'/t', trend:'up'   },
                             { icon:'🍎', name:'Apple',      current:'¥285,000',forecast:'¥315,000',unit:'/t',trend:'up'  },
                             { icon:'🍵', name:'Green Tea',  current:'¥3,200', forecast:'¥3,600', unit:'/kg',trend:'up'   },
                             { icon:'🥢', name:'Soybeans',   current:'¥88,000',forecast:'¥96,000',unit:'/t', trend:'up'   }], city:'Tokyo', country:'Japan' },

  'osaka':        { crops: [{ icon:'🍚', name:'Rice',       current:'¥60,500',forecast:'¥66,500',unit:'/t', trend:'up'   },
                             { icon:'🍵', name:'Green Tea',  current:'¥3,100', forecast:'¥3,500', unit:'/kg',trend:'up'   },
                             { icon:'🍊', name:'Mandarin',   current:'¥180,000',forecast:'¥200,000',unit:'/t',trend:'up'  },
                             { icon:'🍄', name:'Mushroom',   current:'¥4,200', forecast:'¥4,700', unit:'/kg',trend:'up'   }], city:'Osaka', country:'Japan' },

  // ══════════════════════ RUSSIA ══════════════════════
  'moscow':       { crops: [{ icon:'🌾', name:'Wheat',      current:'₽15,800',forecast:'₽17,200',unit:'/t', trend:'up'   },
                             { icon:'🥔', name:'Potato',     current:'₽12,500',forecast:'₽13,800',unit:'/t', trend:'up'   },
                             { icon:'🌻', name:'Sunflower',  current:'₽29,500',forecast:'₽32,000',unit:'/t', trend:'up'   },
                             { icon:'🌽', name:'Corn',       current:'₽14,200',forecast:'₽15,500',unit:'/t', trend:'up'   }], city:'Moscow', country:'Russia' },

  // ══════════════════════ NIGERIA ══════════════════════
  'lagos':        { crops: [{ icon:'🌽', name:'Corn',       current:'₦400',   forecast:'₦460',   unit:'/kg',trend:'up'   },
                             { icon:'🌰', name:'Cassava',    current:'₦160',   forecast:'₦185',   unit:'/kg',trend:'up'   },
                             { icon:'🫘', name:'Cowpea',     current:'₦650',   forecast:'₦720',   unit:'/kg',trend:'up'   },
                             { icon:'🍅', name:'Tomato',     current:'₦350',   forecast:'₦420',   unit:'/kg',trend:'up'   }], city:'Lagos', country:'Nigeria' },

  'abuja':        { crops: [{ icon:'🌾', name:'Sorghum',    current:'₦460',   forecast:'₦520',   unit:'/kg',trend:'up'   },
                             { icon:'🌽', name:'Corn',       current:'₦390',   forecast:'₦450',   unit:'/kg',trend:'up'   },
                             { icon:'🥜', name:'Groundnut',  current:'₦1,100', forecast:'₦1,250', unit:'/kg',trend:'up'   },
                             { icon:'🌰', name:'Cassava',    current:'₦155',   forecast:'₦180',   unit:'/kg',trend:'up'   }], city:'Abuja', country:'Nigeria' },

  // ══════════════════════ KENYA ══════════════════════
  'nairobi':      { crops: [{ icon:'🫖', name:'Tea',        current:'KSh215', forecast:'KSh245', unit:'/kg',trend:'up'   },
                             { icon:'☕', name:'Coffee',     current:'KSh155', forecast:'KSh180', unit:'/kg',trend:'up'   },
                             { icon:'🌽', name:'Maize',      current:'KSh4,800',forecast:'KSh5,400',unit:'/90kg',trend:'up'},
                             { icon:'🫘', name:'Beans',      current:'KSh8,200',forecast:'KSh9,000',unit:'/90kg',trend:'up'}], city:'Nairobi', country:'Kenya' },

  // ══════════════════════ SOUTH AFRICA ══════════════════════
  'johannesburg': { crops: [{ icon:'🌽', name:'Maize',      current:'R3,850', forecast:'R4,300', unit:'/t', trend:'up'   },
                             { icon:'🍊', name:'Citrus',     current:'R9,800', forecast:'R11,000',unit:'/t', trend:'up'   },
                             { icon:'🍇', name:'Grapes',     current:'R22,500',forecast:'R25,000',unit:'/t', trend:'up'   },
                             { icon:'🌻', name:'Sunflower',  current:'R7,200', forecast:'R8,000', unit:'/t', trend:'up'   }], city:'Johannesburg', country:'South Africa' },

  'cape town':    { crops: [{ icon:'🍇', name:'Grapes',     current:'R23,000',forecast:'R25,500',unit:'/t', trend:'up'   },
                             { icon:'🍎', name:'Apple',      current:'R12,500',forecast:'R14,000',unit:'/t', trend:'up'   },
                             { icon:'🌾', name:'Wheat',      current:'R4,800', forecast:'R5,400', unit:'/t', trend:'up'   },
                             { icon:'🫒', name:'Olive',      current:'R28,000',forecast:'R32,000',unit:'/t', trend:'up'   }], city:'Cape Town', country:'South Africa' },

  // ══════════════════════ THAILAND ══════════════════════
  'bangkok':      { crops: [{ icon:'🍚', name:'Rice',       current:'฿8,600', forecast:'฿9,400', unit:'/t', trend:'up'   },
                             { icon:'🍬', name:'Sugarcane',  current:'฿970',   forecast:'฿1,080', unit:'/t', trend:'up'   },
                             { icon:'🌿', name:'Rubber',     current:'฿58',    forecast:'฿65',    unit:'/kg',trend:'up'   },
                             { icon:'🍍', name:'Pineapple',  current:'฿5,200', forecast:'฿5,800', unit:'/t', trend:'up'   }], city:'Bangkok', country:'Thailand' },

  // ══════════════════════ INDONESIA ══════════════════════
  'jakarta':      { crops: [{ icon:'🌴', name:'Palm Oil',   current:'IDR13,500',forecast:'IDR15,000',unit:'/kg',trend:'up'},
                             { icon:'🍚', name:'Rice',       current:'IDR10,800',forecast:'IDR11,800',unit:'/kg',trend:'up'},
                             { icon:'🌿', name:'Rubber',     current:'IDR22,500',forecast:'IDR24,500',unit:'/kg',trend:'up'},
                             { icon:'☕', name:'Coffee',     current:'IDR45,000',forecast:'IDR50,000',unit:'/kg',trend:'up'}], city:'Jakarta', country:'Indonesia' },

  // ══════════════════════ PAKISTAN ══════════════════════
  'karachi':      { crops: [{ icon:'🎀', name:'Cotton',     current:'PKR8,600',forecast:'PKR9,500',unit:'/40kg',trend:'up'},
                             { icon:'🌾', name:'Wheat',      current:'PKR3,600',forecast:'PKR3,950',unit:'/40kg',trend:'up'},
                             { icon:'🍚', name:'Rice',       current:'PKR4,300',forecast:'PKR4,700',unit:'/40kg',trend:'up'},
                             { icon:'🍬', name:'Sugarcane',  current:'PKR380',  forecast:'PKR420',  unit:'/40kg',trend:'up'}], city:'Karachi', country:'Pakistan' },

  // ══════════════════════ EGYPT ══════════════════════
  'cairo':        { crops: [{ icon:'🌾', name:'Wheat',      current:'EGP1,900',forecast:'EGP2,200',unit:'/t', trend:'up'  },
                             { icon:'🌽', name:'Corn',       current:'EGP1,700',forecast:'EGP1,950',unit:'/t', trend:'up'  },
                             { icon:'🍅', name:'Tomato',     current:'EGP4,800',forecast:'EGP5,500',unit:'/t', trend:'up'  },
                             { icon:'🧅', name:'Onion',      current:'EGP3,200',forecast:'EGP3,800',unit:'/t', trend:'up'  }], city:'Cairo', country:'Egypt' },

  // ══════════════════════ ARGENTINA ══════════════════════
  'buenos aires': { crops: [{ icon:'🌱', name:'Soybean',    current:'$315',   forecast:'$355',   unit:'/t', trend:'up'   },
                             { icon:'🌽', name:'Corn',       current:'$188',   forecast:'$210',   unit:'/t', trend:'up'   },
                             { icon:'🌾', name:'Wheat',      current:'$208',   forecast:'$232',   unit:'/t', trend:'up'   },
                             { icon:'🌻', name:'Sunflower',  current:'$390',   forecast:'$440',   unit:'/t', trend:'up'   }], city:'Buenos Aires', country:'Argentina' },

  // ══════════════════════ CANADA ══════════════════════
  'toronto':      { crops: [{ icon:'🌽', name:'Corn',       current:'C$265',  forecast:'C$295',  unit:'/t', trend:'up'   },
                             { icon:'🌱', name:'Soybean',    current:'C$630',  forecast:'C$700',  unit:'/t', trend:'up'   },
                             { icon:'🍁', name:'Maple Syrup',current:'C$3.60', forecast:'C$4.00', unit:'/kg',trend:'up'   },
                             { icon:'🍎', name:'Apple',      current:'C$980',  forecast:'C$1,100',unit:'/t', trend:'up'   }], city:'Toronto', country:'Canada' },

  'vancouver':    { crops: [{ icon:'🍎', name:'Apple',      current:'C$1,050',forecast:'C$1,180',unit:'/t', trend:'up'   },
                             { icon:'🫐', name:'Blueberry',  current:'C$4,800',forecast:'C$5,400',unit:'/t', trend:'up'   },
                             { icon:'🌾', name:'Wheat',      current:'C$295',  forecast:'C$328',  unit:'/t', trend:'up'   },
                             { icon:'🐑', name:'Canola',     current:'C$692',  forecast:'C$770',  unit:'/t', trend:'up'   }], city:'Vancouver', country:'Canada' },
};

/* ─────────────────────────────────────────────────────────────────────────────
   STATE / COUNTRY fallback database
───────────────────────────────────────────────────────────────────────────── */
const REGION_DB = [
  { keys:['punjab'],         crops:[{icon:'🌾',name:'Wheat',current:'₹2,650',forecast:'₹2,850',unit:'/q',trend:'up'},{icon:'🍚',name:'Rice',current:'₹2,450',forecast:'₹2,600',unit:'/q',trend:'up'},{icon:'🌽',name:'Maize',current:'₹1,950',forecast:'₹2,100',unit:'/q',trend:'up'}]},
  { keys:['haryana'],        crops:[{icon:'🌾',name:'Wheat',current:'₹2,650',forecast:'₹2,850',unit:'/q',trend:'up'},{icon:'🎀',name:'Cotton',current:'₹5,800',forecast:'₹6,200',unit:'/q',trend:'up'},{icon:'🌽',name:'Maize',current:'₹1,950',forecast:'₹2,100',unit:'/q',trend:'up'}]},
  { keys:['uttar pradesh','up'], crops:[{icon:'🍬',name:'Sugarcane',current:'₹335',forecast:'₹365',unit:'/q',trend:'up'},{icon:'🌾',name:'Wheat',current:'₹2,650',forecast:'₹2,850',unit:'/q',trend:'up'},{icon:'🥔',name:'Potato',current:'₹1,200',forecast:'₹1,500',unit:'/q',trend:'up'}]},
  { keys:['maharashtra'],    crops:[{icon:'🎀',name:'Cotton',current:'₹5,800',forecast:'₹6,200',unit:'/q',trend:'up'},{icon:'🧅',name:'Onion',current:'₹1,500',forecast:'₹2,800',unit:'/q',trend:'up'},{icon:'🌱',name:'Soybean',current:'₹4,600',forecast:'₹4,850',unit:'/q',trend:'up'}]},
  { keys:['gujarat'],        crops:[{icon:'🎀',name:'Cotton',current:'₹5,800',forecast:'₹6,300',unit:'/q',trend:'up'},{icon:'🥜',name:'Groundnut',current:'₹5,200',forecast:'₹5,600',unit:'/q',trend:'up'},{icon:'🌾',name:'Wheat',current:'₹2,650',forecast:'₹2,850',unit:'/q',trend:'up'}]},
  { keys:['tamil nadu','tamilnadu'], crops:[{icon:'🍚',name:'Rice',current:'₹2,450',forecast:'₹2,600',unit:'/q',trend:'up'},{icon:'🍬',name:'Sugarcane',current:'₹335',forecast:'₹365',unit:'/q',trend:'up'},{icon:'🥜',name:'Groundnut',current:'₹5,200',forecast:'₹5,600',unit:'/q',trend:'up'}]},
  { keys:['karnataka'],      crops:[{icon:'🌽',name:'Maize',current:'₹1,950',forecast:'₹2,100',unit:'/q',trend:'up'},{icon:'🌱',name:'Soybean',current:'₹4,600',forecast:'₹4,850',unit:'/q',trend:'up'},{icon:'🍅',name:'Tomato',current:'₹1,800',forecast:'₹2,500',unit:'/q',trend:'up'}]},
  { keys:['andhra pradesh','telangana'], crops:[{icon:'🍚',name:'Rice',current:'₹2,450',forecast:'₹2,600',unit:'/q',trend:'up'},{icon:'🎀',name:'Cotton',current:'₹5,800',forecast:'₹6,200',unit:'/q',trend:'up'},{icon:'🍅',name:'Tomato',current:'₹1,800',forecast:'₹2,500',unit:'/q',trend:'up'}]},
  { keys:['rajasthan'],      crops:[{icon:'🌾',name:'Wheat',current:'₹2,650',forecast:'₹2,850',unit:'/q',trend:'up'},{icon:'🌻',name:'Mustard',current:'₹5,200',forecast:'₹5,600',unit:'/q',trend:'up'},{icon:'🥜',name:'Groundnut',current:'₹5,200',forecast:'₹5,500',unit:'/q',trend:'up'}]},
  { keys:['madhya pradesh','mp'], crops:[{icon:'🌾',name:'Wheat',current:'₹2,650',forecast:'₹2,850',unit:'/q',trend:'up'},{icon:'🌱',name:'Soybean',current:'₹4,600',forecast:'₹4,850',unit:'/q',trend:'up'},{icon:'🧅',name:'Onion',current:'₹1,500',forecast:'₹2,300',unit:'/q',trend:'up'}]},
  { keys:['west bengal'],    crops:[{icon:'🍚',name:'Rice',current:'₹2,450',forecast:'₹2,600',unit:'/q',trend:'up'},{icon:'🥔',name:'Potato',current:'₹1,200',forecast:'₹1,500',unit:'/q',trend:'up'},{icon:'🫚',name:'Jute',current:'₹4,800',forecast:'₹5,100',unit:'/q',trend:'up'}]},
  { keys:['odisha','orissa'],crops:[{icon:'🍚',name:'Rice',current:'₹2,450',forecast:'₹2,600',unit:'/q',trend:'up'},{icon:'🍅',name:'Tomato',current:'₹1,800',forecast:'₹2,500',unit:'/q',trend:'up'}]},
  { keys:['bihar'],          crops:[{icon:'🌾',name:'Wheat',current:'₹2,600',forecast:'₹2,800',unit:'/q',trend:'up'},{icon:'🥔',name:'Potato',current:'₹1,150',forecast:'₹1,450',unit:'/q',trend:'up'},{icon:'🧅',name:'Onion',current:'₹1,500',forecast:'₹2,400',unit:'/q',trend:'up'}]},
  // Countries
  { keys:['india'],          crops:[{icon:'🌾',name:'Wheat',current:'₹2,650',forecast:'₹2,850',unit:'/q',trend:'up'},{icon:'🍚',name:'Rice',current:'₹2,450',forecast:'₹2,600',unit:'/q',trend:'up'},{icon:'🌽',name:'Maize',current:'₹1,950',forecast:'₹2,100',unit:'/q',trend:'up'}]},
  { keys:['united states','usa'], crops:[{icon:'🌽',name:'Corn',current:'$185',forecast:'$205',unit:'/bu',trend:'up'},{icon:'🌱',name:'Soybean',current:'$1,380',forecast:'$1,500',unit:'/t',trend:'up'},{icon:'🌾',name:'Wheat',current:'$210',forecast:'$230',unit:'/bu',trend:'up'}]},
  { keys:['china'],          crops:[{icon:'🍚',name:'Rice',current:'¥2,880',forecast:'¥3,150',unit:'/t',trend:'up'},{icon:'🌾',name:'Wheat',current:'¥2,520',forecast:'¥2,750',unit:'/t',trend:'up'},{icon:'🌽',name:'Corn',current:'¥2,600',forecast:'¥2,850',unit:'/t',trend:'up'}]},
  { keys:['brazil','brasil'],crops:[{icon:'🌱',name:'Soybean',current:'R$155',forecast:'R$175',unit:'/bag',trend:'up'},{icon:'🍬',name:'Sugarcane',current:'R$110',forecast:'R$125',unit:'/t',trend:'up'},{icon:'☕',name:'Coffee',current:'R$1,200',forecast:'R$1,400',unit:'/bag',trend:'up'}]},
  { keys:['australia'],      crops:[{icon:'🌾',name:'Wheat',current:'A$370',forecast:'A$415',unit:'/t',trend:'up'},{icon:'🌾',name:'Barley',current:'A$330',forecast:'A$365',unit:'/t',trend:'up'},{icon:'🐑',name:'Canola',current:'A$780',forecast:'A$860',unit:'/t',trend:'up'}]},
  { keys:['russia','russian federation'], crops:[{icon:'🌾',name:'Wheat',current:'₽15,500',forecast:'₽17,000',unit:'/t',trend:'up'},{icon:'🌻',name:'Sunflower',current:'₽29,000',forecast:'₽32,000',unit:'/t',trend:'up'},{icon:'🌽',name:'Corn',current:'₽14,000',forecast:'₽15,500',unit:'/t',trend:'up'}]},
  { keys:['canada'],         crops:[{icon:'🌾',name:'Wheat',current:'C$290',forecast:'C$325',unit:'/t',trend:'up'},{icon:'🐑',name:'Canola',current:'C$680',forecast:'C$755',unit:'/t',trend:'up'},{icon:'🌽',name:'Corn',current:'C$260',forecast:'C$290',unit:'/t',trend:'up'}]},
  { keys:['france'],         crops:[{icon:'🌾',name:'Wheat',current:'€225',forecast:'€250',unit:'/t',trend:'up'},{icon:'🍇',name:'Grapes',current:'€800',forecast:'€900',unit:'/t',trend:'up'},{icon:'🌻',name:'Sunflower',current:'€415',forecast:'€460',unit:'/t',trend:'up'}]},
  { keys:['germany'],        crops:[{icon:'🌾',name:'Wheat',current:'€220',forecast:'€245',unit:'/t',trend:'up'},{icon:'🍺',name:'Barley',current:'€200',forecast:'€222',unit:'/t',trend:'up'},{icon:'🥔',name:'Potato',current:'€180',forecast:'€200',unit:'/t',trend:'up'}]},
  { keys:['japan'],          crops:[{icon:'🍚',name:'Rice',current:'¥60,000',forecast:'¥66,000',unit:'/t',trend:'up'},{icon:'🍎',name:'Apple',current:'¥280,000',forecast:'¥310,000',unit:'/t',trend:'up'},{icon:'🍵',name:'Green Tea',current:'¥3,000',forecast:'¥3,400',unit:'/kg',trend:'up'}]},
  { keys:['nigeria'],        crops:[{icon:'🌾',name:'Sorghum',current:'₦450',forecast:'₦520',unit:'/kg',trend:'up'},{icon:'🌽',name:'Corn',current:'₦380',forecast:'₦440',unit:'/kg',trend:'up'},{icon:'🌰',name:'Cassava',current:'₦150',forecast:'₦175',unit:'/kg',trend:'up'}]},
  { keys:['kenya'],          crops:[{icon:'🫖',name:'Tea',current:'KSh210',forecast:'KSh245',unit:'/kg',trend:'up'},{icon:'☕',name:'Coffee',current:'KSh150',forecast:'KSh178',unit:'/kg',trend:'up'},{icon:'🌽',name:'Maize',current:'KSh4,500',forecast:'KSh5,200',unit:'/90kg',trend:'up'}]},
  { keys:['south africa'],   crops:[{icon:'🌽',name:'Maize',current:'R3,800',forecast:'R4,250',unit:'/t',trend:'up'},{icon:'🍊',name:'Citrus',current:'R9,500',forecast:'R10,800',unit:'/t',trend:'up'},{icon:'🍇',name:'Grapes',current:'R22,000',forecast:'R24,500',unit:'/t',trend:'up'}]},
  { keys:['indonesia'],      crops:[{icon:'🌴',name:'Palm Oil',current:'IDR13,000',forecast:'IDR14,500',unit:'/kg',trend:'up'},{icon:'🍚',name:'Rice',current:'IDR10,500',forecast:'IDR11,500',unit:'/kg',trend:'up'},{icon:'☕',name:'Coffee',current:'IDR42,000',forecast:'IDR48,000',unit:'/kg',trend:'up'}]},
  { keys:['thailand'],       crops:[{icon:'🍚',name:'Rice',current:'฿8,500',forecast:'฿9,300',unit:'/t',trend:'up'},{icon:'🍬',name:'Sugarcane',current:'฿950',forecast:'฿1,060',unit:'/t',trend:'up'},{icon:'🌿',name:'Rubber',current:'฿55',forecast:'฿62',unit:'/kg',trend:'up'}]},
  { keys:['argentina'],      crops:[{icon:'🌱',name:'Soybean',current:'$310',forecast:'$350',unit:'/t',trend:'up'},{icon:'🌽',name:'Corn',current:'$185',forecast:'$208',unit:'/t',trend:'up'},{icon:'🌾',name:'Wheat',current:'$205',forecast:'$230',unit:'/t',trend:'up'}]},
  { keys:['ukraine'],        crops:[{icon:'🌻',name:'Sunflower',current:'$380',forecast:'$425',unit:'/t',trend:'up'},{icon:'🌽',name:'Corn',current:'$205',forecast:'$228',unit:'/t',trend:'up'},{icon:'🌾',name:'Wheat',current:'$210',forecast:'$235',unit:'/t',trend:'up'}]},
  { keys:['turkey','turkiye'],crops:[{icon:'🌾',name:'Wheat',current:'₺6,500',forecast:'₺7,200',unit:'/t',trend:'up'},{icon:'🫒',name:'Olive',current:'₺45,000',forecast:'₺51,000',unit:'/t',trend:'up'},{icon:'🍊',name:'Citrus',current:'₺12,000',forecast:'₺13,500',unit:'/t',trend:'up'}]},
  { keys:['egypt'],          crops:[{icon:'🌾',name:'Wheat',current:'EGP1,800',forecast:'EGP2,050',unit:'/t',trend:'up'},{icon:'🌽',name:'Corn',current:'EGP1,600',forecast:'EGP1,820',unit:'/t',trend:'up'},{icon:'🍅',name:'Tomato',current:'EGP4,500',forecast:'EGP5,200',unit:'/t',trend:'up'}]},
  { keys:['pakistan'],       crops:[{icon:'🌾',name:'Wheat',current:'PKR3,500',forecast:'PKR3,900',unit:'/40kg',trend:'up'},{icon:'🎀',name:'Cotton',current:'PKR8,500',forecast:'PKR9,400',unit:'/40kg',trend:'up'},{icon:'🍚',name:'Rice',current:'PKR4,200',forecast:'PKR4,650',unit:'/40kg',trend:'up'}]},
  { keys:['bangladesh'],     crops:[{icon:'🍚',name:'Rice',current:'৳32',forecast:'৳36',unit:'/kg',trend:'up'},{icon:'🫚',name:'Jute',current:'৳2,800',forecast:'৳3,150',unit:'/q',trend:'up'},{icon:'🌾',name:'Wheat',current:'৳38',forecast:'৳43',unit:'/kg',trend:'up'}]},
];

function lookupCrops(city, state, country) {
  const cityKey = (city || '').toLowerCase();
  const stateKey = (state || '').toLowerCase();
  const countryKey = (country || '').toLowerCase();

  // 1. Exact city match
  if (cityKey && CROP_DB[cityKey]) return { ...CROP_DB[cityKey], level: 'city' };

  // 2. Partial city match
  for (const [key, val] of Object.entries(CROP_DB)) {
    if (cityKey && (cityKey.includes(key) || key.includes(cityKey))) return { ...val, level: 'city' };
  }

  // 3. State match in REGION_DB
  for (const entry of REGION_DB) {
    if (entry.keys.some(k => stateKey.includes(k) || k.includes(stateKey))) return { crops: entry.crops, city: state, country, level: 'state' };
  }

  // 4. Country match
  for (const entry of REGION_DB) {
    if (entry.keys.some(k => countryKey.includes(k) || k.includes(countryKey))) return { crops: entry.crops, city: country, country, level: 'country' };
  }

  // 5 Generic fallback
  return { crops: [{ icon:'🌾', name:'Cereals', current:'Regional price', forecast:'—', unit:'', trend:'stable' },
                   { icon:'🥬', name:'Vegetables', current:'Regional price', forecast:'—', unit:'', trend:'stable' },
                   { icon:'🍎', name:'Fruits', current:'Regional price', forecast:'—', unit:'', trend:'stable' }],
           city: city || country, country, level: 'generic' };
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const MapWidget = ({ selectedLocation, onLocationSelect }) => {
  const [position, setPosition] = useState([20.5937, 78.9629]);
  const [loading, setLoading] = useState(false);
  const [clickedInfo, setClickedInfo] = useState(null);
  const [markerActive, setMarkerActive] = useState(false);

  const handleLocationFound = async (latlng) => {
    setPosition([latlng.lat, latlng.lng]);
    setMarkerActive(true);
    setLoading(true);
    setClickedInfo(null);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=12&addressdetails=1`
      );
      const data = await res.json();

      let city = '', state = '', country = '';
      if (data?.address) {
        city    = data.address.city || data.address.town || data.address.village || data.address.municipality || data.address.suburb || '';
        state   = data.address.state || data.address.state_district || data.address.region || data.address.county || '';
        country = data.address.country || '';

        state   = state.replace(/ State$/, '').replace(/ Province$/, '').trim();
      }

      const result = lookupCrops(city, state, country);
      const displayLabel = city || state || country;

      onLocationSelect(state || country);
      setClickedInfo({ city, state, country, displayLabel, ...result });
    } catch (err) {
      console.error('Geocoding failed:', err);
      setClickedInfo({ city:'', state:'', country:'', displayLabel:'Could not detect', crops:[], level:'generic' });
    } finally {
      setLoading(false);
    }
  };

  const levelBadge = { city:'🏙️ City', state:'🗺️ State', country:'🌍 Country', generic:'🌐 Global' };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={18} color="var(--primary)" />
          Interactive World Map — Click City, State or Country
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {loading && <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />}
          {loading ? 'Detecting location…' : selectedLocation ? `📍 ${selectedLocation}` : 'Click anywhere on the map'}
        </span>
      </h3>

      <div style={{ height: '500px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
        <MapContainer center={position} zoom={4} minZoom={2} style={{ height: '100%', width: '100%', zIndex: 1 }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={20}
          />
          <LocationClick onLocationFound={handleLocationFound} />

          {markerActive && (
            <Marker position={position}>
              <Popup maxWidth={300} autoPan>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '12px', color: '#666' }}>🔄 Fetching crop & price data…</div>
                ) : clickedInfo ? (
                  <div style={{ minWidth: '255px', fontFamily: 'Inter, sans-serif' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', borderBottom: '2px solid #e8f5e9', paddingBottom: '8px' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1b4332' }}>
                          📍 {clickedInfo.displayLabel}
                        </div>
                        {clickedInfo.country && clickedInfo.country !== clickedInfo.displayLabel && (
                          <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '2px' }}>
                            {clickedInfo.state && clickedInfo.city ? `${clickedInfo.state} · ` : ''}{clickedInfo.country}
                          </div>
                        )}
                      </div>
                      <span style={{ background: '#e8f5e9', color: '#2d6a4f', borderRadius: '10px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: '600', whiteSpace:'nowrap', marginLeft:'6px' }}>
                        {levelBadge[clickedInfo.level]}
                      </span>
                    </div>

                    {/* Column headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '4px', fontSize: '0.7rem', color: '#888', fontWeight: '600', marginBottom: '4px', paddingLeft: '4px' }}>
                      <span>CROP</span>
                      <span style={{ textAlign:'right' }}>CURRENT</span>
                      <span style={{ textAlign:'right', minWidth: '68px' }}>FORECAST ↑</span>
                    </div>

                    {/* Crop rows */}
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {clickedInfo.crops.map((crop, i) => (
                        <li key={i} style={{
                          display: 'grid', gridTemplateColumns: '1fr auto auto',
                          gap: '4px', alignItems: 'center',
                          padding: '5px 6px', borderRadius: '6px',
                          background: i % 2 === 0 ? 'rgba(45,106,79,0.06)' : 'rgba(0,0,0,0.02)',
                          fontSize: '0.88rem'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}>
                            <span style={{ fontSize: '1.1em' }}>{crop.icon}</span>
                            {crop.name}
                          </span>
                          <span style={{ textAlign: 'right', fontWeight: '600', color: '#2b2d42', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                            {crop.current}{crop.unit}
                          </span>
                          <span style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '2px', justifyContent:'flex-end', minWidth:'68px' }}>
                            <span style={{ fontWeight: '700', color: crop.trend === 'up' ? '#2a9d8f' : crop.trend === 'down' ? '#e63946' : '#888', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                              {crop.forecast}{crop.unit}
                            </span>
                            {crop.trend === 'up'   && <TrendingUp   size={12} color="#2a9d8f" />}
                            {crop.trend === 'down' && <TrendingDown size={12} color="#e63946" />}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#aaa', textAlign: 'center' }}>
                      Forecast = 6-month projected price · Scroll cards below for full analysis ↓
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '8px', color: '#666' }}>Loading…</div>
                )}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default MapWidget;
