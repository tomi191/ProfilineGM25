export async function GET() {
  const content = `# Profiline GM25
> Professional 25mm Dual Action Orbital Polisher, engineered and assembled in Bulgaria.

## Product Info
- [Full product details](https://profilinegm25.eu/llms-full.txt)
- [Website - English](https://profilinegm25.eu/en)
- [Website - Bulgarian](https://profilinegm25.eu/bg)

## Specifications
- Power: 1200W
- Orbit: 25mm
- Speed: 2200-5800 OPM (6-speed)
- Weight: 2.60 kg
- Backing plates: 125mm (5") and 150mm (6")
- Certifications: CE, EAC
- Warranty: 2 years (all EU markets)

## Contact
- Distributor inquiries: contact@profilinegm25.eu
- Website: https://profilinegm25.eu
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
