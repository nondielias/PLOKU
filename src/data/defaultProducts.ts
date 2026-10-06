import { Product } from '../types';

import headphonesImg from '../assets/images/product_cyber_headphones_1791283854900.jpg';
import smartRingImg from '../assets/images/product_smart_ring_1791283870220.jpg';
import keyboardImg from '../assets/images/product_mechanical_keyboard_1791283883967.jpg';
import ganDockImg from '../assets/images/product_gan_dock_1791283895567.jpg';
import heroImg from '../assets/images/hero_gadgets_showcase_1791283838269.jpg';

export { heroImg };

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'plk-01',
    name: 'PLOKU CyberPulse ANC Titanium',
    price: 389,
    category: 'Audio',
    tag: 'Flagship Audio',
    featured: true,
    stock: 14,
    image: headphonesImg,
    description: 'Precision-tuned hybrid active noise cancelling over-ear headphones constructed from aircraft-grade aerospace titanium and memory foam lambskin cushions. Features custom 40mm Beryllium acoustic drivers with lossless low-latency audio transmission.',
    specs: [
      { key: 'Acoustic Driver', value: '40mm Pure Beryllium dynamic driver' },
      { key: 'Noise Cancellation', value: 'Dual-core DSP with 48dB hybrid ANC' },
      { key: 'Battery Runtime', value: 'Up to 42 hours (ANC active)' },
      { key: 'Connectivity', value: 'Bluetooth 5.4, aptX Lossless, 3.5mm DAC mode' },
      { key: 'Latency', value: 'Ultra-low 24ms game/monitor mode' },
      { key: 'Chassis Material', value: 'Matte Bead-Blasted Grade 5 Titanium' }
    ]
  },
  {
    id: 'plk-02',
    name: 'PLOKU Aura Bio-Titanium Smart Ring',
    price: 299,
    category: 'Wearables',
    tag: 'Biometric Tech',
    featured: true,
    stock: 28,
    image: smartRingImg,
    description: 'Continuous clinical-grade circadian rhythm, HRV, blood oxygen, and skin temperature biometrics packed into a seamless 2.4mm ultra-light titanium contour ring. Zero monthly subscriptions required.',
    specs: [
      { key: 'Sensors', value: 'Dual PPG optical sensors, skin temp, 3D accelerometer' },
      { key: 'Battery Life', value: '7 to 9 continuous days per wireless cycle' },
      { key: 'Water Resistance', value: '100m (10 ATM) dive rated' },
      { key: 'Weight', value: '4.2 grams ultra-featherweight' },
      { key: 'Finish', value: 'DLC scratch-resistant matte black titanium' },
      { key: 'App Sync', value: 'Direct Apple Health & Google Fit auto-sync' }
    ]
  },
  {
    id: 'plk-03',
    name: 'PLOKU Apex 75 CNC Mechanical Keyboard',
    price: 249,
    category: 'Workstation',
    tag: 'Tactile Interface',
    featured: true,
    stock: 18,
    image: keyboardImg,
    description: 'Ultra-slim 75% mechanical keyboard carved from a solid ingot of CNC anodized 6063 aluminum. Equipped with custom lubed low-profile tactile switches, PBT double-shot keycaps, and triple-connectivity wireless switching.',
    specs: [
      { key: 'Layout', value: 'Compact 75% 84-key ANSI layout' },
      { key: 'Switch Type', value: 'PLOKU Ghost Low-Profile Tactile (45g actuation)' },
      { key: 'Plate & Mounting', value: 'Gasket-mounted polycarbonate plate with poron dampening' },
      { key: 'Polling Rate', value: '1000Hz (2.4GHz) / 8000Hz wired USB-C' },
      { key: 'Battery', value: '4000mAh (up to 220 hours backlight off)' },
      { key: 'Body Build', value: 'Full CNC anodized aluminum unibody' }
    ]
  },
  {
    id: 'plk-04',
    name: 'PLOKU Matrix 140W GaN Desktop Power Station',
    price: 139,
    category: 'Power & Docks',
    tag: 'GaNFast Architecture',
    featured: true,
    stock: 35,
    image: ganDockImg,
    description: 'State-of-the-art Gallium Nitride (GaN IV) desktop power station delivering simultaneous multi-device rapid charging up to 140W PD 3.1. Features a crystal-clear real-time OLED telemetry screen displaying individual port voltages, amps, and wattage.',
    specs: [
      { key: 'Max Output', value: '140W Power Delivery 3.1 single port' },
      { key: 'Ports', value: '3x USB-C (140W/100W/65W) + 1x USB-A (22.5W QC)' },
      { key: 'Display', value: '1.4-inch monochrome OLED real-time wattage monitor' },
      { key: 'GaN Technology', value: 'Navitas GaNFast Gen-4 power ICs' },
      { key: 'Protection', value: 'ThermalGuard 2.0 temperature monitoring 3M times/day' },
      { key: 'Dimensions', value: '88 x 64 x 36 mm (280g)' }
    ]
  },
  {
    id: 'plk-05',
    name: 'PLOKU Horizon 4K Ultra-Portable OLED',
    price: 449,
    category: 'Vision & Optics',
    tag: 'Reference Display',
    featured: false,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
    description: '15.6-inch ultra-thin 4K UHD self-emissive OLED mobile monitor with 100% DCI-P3 cinematic color gamut, 0.1ms instantaneous response time, and magnetic folding origami stand. Powered via single USB-C cable.',
    specs: [
      { key: 'Panel', value: '15.6-inch 4K UHD (3840 x 2160) True OLED' },
      { key: 'Color Accuracy', value: '100% DCI-P3, Delta E < 1.0 calibrated' },
      { key: 'Peak Brightness', value: '550 nits HDR Peak' },
      { key: 'Thickness', value: '4.8mm razor-thin CNC chassis' },
      { key: 'Inputs', value: '2x Full-Function USB-C, 1x Mini-HDMI 2.1' },
      { key: 'Weight', value: '620 grams' }
    ]
  },
  {
    id: 'plk-06',
    name: 'PLOKU Lumina Spatial Magnetic Desk Lightbar',
    price: 119,
    category: 'Workstation',
    tag: 'Ergonomic Desk',
    featured: false,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
    description: 'Asymmetric forward-projected optic illumination bar that zeroes out glare and reflection on ultra-wide and curved monitors. Controlled wirelessly via a weighted solid brass tactile rotary dial knob.',
    specs: [
      { key: 'Optical Design', value: 'Patented 45° asymmetric optical hood' },
      { key: 'Color Temp', value: '2700K warm candle to 6500K crisp daylight' },
      { key: 'CRI Rating', value: 'Ra97 natural spectral balance' },
      { key: 'Controller', value: '2.4GHz weighted CNC rotary wireless dial' },
      { key: 'Mounting', value: 'Gravity counterweight magnetic clamp (fits up to 45mm screens)' }
    ]
  },
  {
    id: 'plk-07',
    name: 'PLOKU Orbit Qi2 Magnetic Fast Dock',
    price: 89,
    category: 'Power & Docks',
    tag: 'Qi2 Certified',
    featured: false,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80',
    description: 'Precision magnetic wireless charging dock featuring certified Qi2 15W magnetic rapid alignment for smartphones and secondary indentation pad for earbuds.',
    specs: [
      { key: 'Wireless Tech', value: 'Official Qi2 15W magnetic inductive ring' },
      { key: 'Secondary Pad', value: '5W Qi induction for AirPods / Galaxy Buds' },
      { key: 'Angle Adjust', value: '60° vertical tilt gimbal hinge' },
      { key: 'Chassis', value: 'Cast zinc-alloy weighted anti-slip base' },
      { key: 'Cable', value: 'Included 1.5m braided nylon 60W USB-C' }
    ]
  },
  {
    id: 'plk-08',
    name: 'PLOKU Aero ANC Ceramic Earbuds',
    price: 189,
    category: 'Audio',
    tag: 'Hi-Res Audio',
    featured: false,
    stock: 16,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
    description: 'Ultra-compact true wireless stereo earbuds encased in polished zirconia ceramic housings with quad-mic beamforming audio capture and adaptive noise reduction.',
    specs: [
      { key: 'Acoustic Driver', value: '11mm Liquid Crystal Polymer + Planar Tweeter' },
      { key: 'Active ANC', value: 'Adaptive active noise cancelling up to 45dB' },
      { key: 'Playtime', value: '9 hours standalone (36 hours with charging case)' },
      { key: 'Protection', value: 'IP55 dust and water splash resistance' },
      { key: 'Codecs', value: 'LDAC, LHDC 5.0, AAC, SBC' }
    ]
  }
];
