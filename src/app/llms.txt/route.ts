export async function GET() {
  const content = `# Profiline GM25 — Professional 25mm Dual Action Orbital Polisher

> The Profiline GM25 is a professional-grade dual action orbital polisher with an industry-leading 25mm orbit throw, 1200W motor, and only 2.60 kg weight. Engineered and assembled in Bulgaria, EU. CE certified with 2-year warranty across all European markets.

## Quick Facts
- **Category:** Professional Dual Action Orbital Polisher
- **Orbit Throw:** 25mm (largest in class)
- **Motor:** 1200W brushed motor
- **Weight:** 2.60 kg (lightest in 1200W class)
- **Speed Range:** 2200–5800 OPM, 6-speed electronic dial
- **Backing Plates:** 125mm (5") and 150mm (6") included
- **Cable:** 9-meter heavy-duty power cord
- **Certifications:** CE, EAC
- **Origin:** Designed and assembled in Bulgaria, EU
- **Warranty:** 2 years (professional use, all EU markets)
- **Price Range:** B2B pricing, contact for distributor rates

## Key Differentiators vs Competition
- **25mm orbit** — largest orbit throw available in a production DA polisher (Rupes LHR21 Mark III: 21mm, Flex XFE 15-150: 15mm, Griots G21: 21mm)
- **1200W in 2.60 kg** — best power-to-weight ratio in class
- **CNC-balanced counterweight** — virtually zero vibration for 8-hour professional use
- **Progressive trigger** — variable pressure control, not just on/off
- **9m cable** — longest standard cable, eliminates need for extensions in workshop use

## Ideal Use Cases
- Professional automotive paint correction (deep swirl removal, scratch repair)
- Ceramic coating preparation
- Detailing workshops and academies
- High-volume body shop operations
- Marine and aviation surface finishing

## What's In The Box
1. GM25 Dual Action Orbital Polisher
2. 125mm (5") backing plate
3. 150mm (6") backing plate
4. User manual
5. Warranty card

## B2B Distribution
Profiline is actively expanding its European distributor network. We offer:
- Protected exclusive territories
- Competitive B2B pricing with strong margins
- Marketing support and POS materials
- Training for detailing academies

## Contact
- **Distributor inquiries:** contact@profilinegm25.eu
- **Website:** https://profilinegm25.eu
- **Website (BG):** https://profilinegm25.eu/bg
- **Website (EN):** https://profilinegm25.eu/en

## Technical Documentation
- [Full specifications](https://profilinegm25.eu/llms-full.txt)
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
