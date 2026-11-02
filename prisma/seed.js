const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ReMatX Database...');

  // 1. Hash default password
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 2. Clean existing records if any
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.order.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.inspectionTest.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.standard.deleteMany();
  await prisma.materialPassport.deleteMany();
  await prisma.material.deleteMany();
  await prisma.materialCategory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log('Cleared existing data.');

  // 3. Create Companies
  const demolitionCo = await prisma.company.create({
    data: {
      name: 'Lanka Green Salvage & Demolition Ltd',
      businessRegNumber: 'PV-104928',
      companyType: 'DEMOLITION',
      taxId: 'TIN-98765432',
      verifiedStatus: 'VERIFIED',
      address: '45 Baseline Road, Colombo 09, Sri Lanka',
      contactEmail: 'operations@lankareclaim.lk',
      contactPhone: '+94 11 268 9000',
    },
  });

  const apexBuilders = await prisma.company.create({
    data: {
      name: 'Apex Builders & Civil Developers Ltd',
      businessRegNumber: 'PV-883921',
      companyType: 'CONTRACTOR',
      taxId: 'TIN-44556677',
      verifiedStatus: 'VERIFIED',
      address: '112 Galle Road, Mount Lavinia, Sri Lanka',
      contactEmail: 'procurement@apexbuild.lk',
      contactPhone: '+94 11 271 4455',
    },
  });

  const ecoStudio = await prisma.company.create({
    data: {
      name: 'EcoStructure Sustainable Architects',
      businessRegNumber: 'PV-991204',
      companyType: 'ARCHITECTURE',
      taxId: 'TIN-11223344',
      verifiedStatus: 'VERIFIED',
      address: '22 Ward Place, Colombo 07, Sri Lanka',
      contactEmail: 'design@ecostructure.studio',
      contactPhone: '+94 11 269 1122',
    },
  });

  // 4. Create Users (All 8 Roles)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@rematx.org',
      passwordHash,
      name: 'Nimal Perera',
      phone: '+94 77 100 2000',
      role: 'ADMIN',
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
  });

  const sellerUser = await prisma.user.create({
    data: {
      email: 'contractor@lankareclaim.lk',
      passwordHash,
      name: 'Sunil Wickramasinghe',
      phone: '+94 77 234 5678',
      role: 'CONTRACTOR',
      companyId: demolitionCo.id,
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  const inspectorUser = await prisma.user.create({
    data: {
      email: 'inspector@ceylonmaterials.org',
      passwordHash,
      name: 'Eng. Priyantha Silva',
      phone: '+94 71 888 9900',
      role: 'INSPECTOR',
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  });

  const buyerUser = await prisma.user.create({
    data: {
      email: 'buyer@apexbuild.lk',
      passwordHash,
      name: 'Rohan De Silva',
      phone: '+94 76 555 4321',
      role: 'BUYER',
      companyId: apexBuilders.id,
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
  });

  const architectUser = await prisma.user.create({
    data: {
      email: 'architect@ecostructure.studio',
      passwordHash,
      name: 'Amani Jayawardena',
      phone: '+94 77 999 1234',
      role: 'ARCHITECT',
      companyId: ecoStudio.id,
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  const engineerUser = await prisma.user.create({
    data: {
      email: 'engineer@civilspec.com',
      passwordHash,
      name: 'Dr. Kanishka Fernando',
      phone: '+94 71 444 3322',
      role: 'ENGINEER',
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const indSellerUser = await prisma.user.create({
    data: {
      email: 'seller@reclaimwood.org',
      passwordHash,
      name: 'Dharmasena Senanayake',
      phone: '+94 77 333 4444',
      role: 'SELLER',
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    },
  });

  // 5. Material Categories
  const categories = [
    {
      name: 'Bricks & Masonry',
      slug: 'bricks',
      description: 'Reclaimed clay wire-cut bricks, heritage colonial bricks, and architectural pavers.',
      carbonFactorKgPerUnit: 0.28,
      standardCount: 2,
    },
    {
      name: 'Concrete Blocks & Precast',
      slug: 'concrete-blocks',
      description: 'Precast structural panels, dense aggregate blocks, hollow blocks and curbstones.',
      carbonFactorKgPerUnit: 2.45,
      standardCount: 2,
    },
    {
      name: 'Structural Steel',
      slug: 'structural-steel',
      description: 'Universal I-beams, columns, hollow sections, steel trusses and structural angles.',
      carbonFactorKgPerUnit: 200.0,
      standardCount: 2,
    },
    {
      name: 'Timber & Hardwood',
      slug: 'timber',
      description: 'Reclaimed Ceylon teak, jackwood, kumbuk beams, roof purlins, joists and planks.',
      carbonFactorKgPerUnit: 14.2,
      standardCount: 2,
    },
    {
      name: 'Doors & Windows',
      slug: 'doors-windows',
      description: 'Architectural hardwood doors, sash windows, industrial glazed steel casements.',
      carbonFactorKgPerUnit: 35.0,
      standardCount: 1,
    },
    {
      name: 'Tiles & Ceramics',
      slug: 'tiles-ceramics',
      description: 'Reclaimed terracotta floor tiles, heritage patterned encaustic tiles and porcelain.',
      carbonFactorKgPerUnit: 3.2,
      standardCount: 1,
    },
    {
      name: 'Roofing Materials',
      slug: 'roofing',
      description: 'Mangalore pattern clay roof tiles, corrugated cement-free sheets, and slate tiles.',
      carbonFactorKgPerUnit: 0.65,
      standardCount: 1,
    },
    {
      name: 'Sanitary Fixtures',
      slug: 'sanitary-fixtures',
      description: 'Commercial porcelain basins, brass faucets, cast iron heritage tubs and sinks.',
      carbonFactorKgPerUnit: 18.0,
      standardCount: 1,
    },
  ];

  const catMap = {};
  for (const cat of categories) {
    const record = await prisma.materialCategory.create({ data: cat });
    catMap[cat.slug] = record;
  }

  // 6. Standards Registry
  const brickStandard = await prisma.standard.create({
    data: {
      categoryId: catMap['bricks'].id,
      code: 'SLS-BS-EN-771-1:2026',
      title: 'Specification for Reclaimed Clay Masonry Units',
      version: '2026.1',
      scope: 'Requirements for compressive strength, water absorption percentage, dimension tolerance, and freeze-thaw durability for structural and non-structural reuse.',
      organization: 'Sri Lanka Standards Institution (SLSI) / European Standards',
      acceptanceCriteria: JSON.stringify([
        { parameter: 'Compressive Strength', min: 15.0, unit: 'N/mm²', required: true },
        { parameter: 'Water Absorption', max: 12.0, unit: '%', required: true },
        { parameter: 'Dimension Variation', max: 3.0, unit: 'mm', required: true },
        { parameter: 'Efflorescence / Chipping', maxScore: 2, unit: 'Visual Index (1-5)', required: true },
      ]),
      status: 'ACTIVE',
    },
  });

  const steelStandard = await prisma.standard.create({
    data: {
      categoryId: catMap['structural-steel'].id,
      code: 'SLS-EN-10025-RE:2026',
      title: 'Structural Steel Reuse: Inspection, Ultrasonic Testing & Integrity Assessment',
      version: '2026.2',
      scope: 'Verification of yield strength, section thickness reduction, corrosion pitting index, and non-destructive weld testing for load-bearing applications.',
      organization: 'International Steel Reuse Council / SLSI',
      acceptanceCriteria: JSON.stringify([
        { parameter: 'Section Thickness Loss', max: 5.0, unit: '%', required: true },
        { parameter: 'Yield Strength', min: 275.0, unit: 'MPa', required: true },
        { parameter: 'Straightness Deviation', max: 2.0, unit: 'mm/m', required: true },
        { parameter: 'Corrosion Grade', allowed: ['A', 'B'], unit: 'ISO 8501-1', required: true },
      ]),
      status: 'ACTIVE',
    },
  });

  const timberStandard = await prisma.standard.create({
    data: {
      categoryId: catMap['timber'].id,
      code: 'SLS-1122-RE:2026',
      title: 'Structural Salvaged Hardwood Timber Specifications for Building Reuse',
      version: '2026.1',
      scope: 'Moisture content, species verification, fungal rot, borer beetle infestation, and maximum allowable grain deflection.',
      organization: 'National Timber Research Institute',
      acceptanceCriteria: JSON.stringify([
        { parameter: 'Moisture Content', max: 18.0, unit: '%', required: true },
        { parameter: 'Insect/Borer Damage', max: 0.0, unit: '% surface', required: true },
        { parameter: 'Warp / Bow Deflection', max: 3.0, unit: 'mm/m', required: true },
        { parameter: 'Decay / Rot', max: 0.0, unit: 'depth mm', required: true },
      ]),
      status: 'ACTIVE',
    },
  });

  // 7. Seed Materials, Passports, QR Codes, and Inspections

  // Helper for QR code generation
  async function generateQr(passportNumber) {
    const url = `http://localhost:3000/passports/${passportNumber}`;
    return await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#14532d',
        light: '#ffffff',
      },
    });
  }

  // --- Material 1: Reclaimed Clay Bricks ---
  const m1Qr = await generateQr('RM-2026-000145');
  const mat1 = await prisma.material.create({
    data: {
      materialId: 'RM-2026-000145',
      categoryId: catMap['bricks'].id,
      sellerId: sellerUser.id,
      name: 'Reclaimed Wire-Cut Red Clay Bricks',
      description: 'Carefully deconstructed and mortar-cleaned solid clay bricks from the 1975 facade of the Commercial Bank HQ demolition. Stacked on wrapped wooden pallets.',
      dimensions: '225 × 105 × 65 mm',
      lengthMm: 225,
      widthMm: 105,
      heightMm: 65,
      weightKg: 3.1,
      quantity: 4500,
      unit: 'units',
      originBuilding: 'Commercial Bank HQ, York Street, Colombo 01',
      ageYears: 15,
      previousUse: 'Exterior load-bearing facade wall',
      recoveryDate: new Date('2026-08-15'),
      conditionGrade: 'GRADE_A',
      conditionNotes: 'Intact edges, clean surfaces, minimal mortar residue. Tested for water absorption and compressive load.',
      storageCondition: 'Indoor covered warehouse, shrink-wrapped on 9 heavy-duty pallets',
      locationAddress: 'Peliyagoda Logistics Park, Warehouse Bay 4',
      locationCity: 'Colombo',
      locationPostalCode: '11830',
      status: 'AVAILABLE',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&auto=format&fit=crop&q=80',
      ]),
      documents: JSON.stringify([
        { title: 'SLSI Compressive Strength Certificate', type: 'PDF', url: '/docs/cert-rm-000145.pdf' },
        { title: 'Pre-Demolition Material Audit Report', type: 'PDF', url: '/docs/audit-rm-000145.pdf' },
      ]),
    },
  });

  const p1 = await prisma.materialPassport.create({
    data: {
      materialId: mat1.id,
      passportNumber: 'RM-2026-000145',
      originSite: 'Commercial Bank HQ Demolition Site, Colombo 01',
      demolitionContractor: 'Lanka Green Salvage & Demolition Ltd',
      manufacturingYear: 2011,
      recoveryDate: new Date('2026-08-15'),
      embodiedCarbonSavedKg: 1260.0, // 4500 * 0.28 kg CO2
      wasteDivertedKg: 13950.0, // 4500 * 3.1 kg
      circularityScore: 94.2,
      currentOwnerId: sellerUser.id,
      currentLocation: 'Peliyagoda Logistics Park, Warehouse Bay 4, Colombo',
      qrCodeDataUrl: m1Qr,
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date('2026-09-10'),
      verifiedByInspector: 'Eng. Priyantha Silva (Lic. SLIE-8842)',
      reuseNotes: 'Suitable for direct masonry reuse subject to project architectural and technical requirements.',
      version: 1,
      historyLog: JSON.stringify([
        { timestamp: '2026-08-12', action: 'Material Audited on Site', actor: 'Lanka Green Salvage', location: 'Commercial Bank HQ' },
        { timestamp: '2026-08-15', action: 'Recovered & Cleaned', actor: 'Lanka Green Salvage', location: 'Commercial Bank HQ' },
        { timestamp: '2026-08-20', action: 'Transported to Depot', actor: 'Circular Freight', location: 'Peliyagoda Logistics Bay 4' },
        { timestamp: '2026-09-10', action: 'SLSI Testing & Inspection Passed (Grade A)', actor: 'Eng. Priyantha Silva', location: 'Peliyagoda' },
        { timestamp: '2026-09-12', action: 'Digital Material Passport Issued', actor: 'ReMatX Platform Engine', location: 'ReMatX Cloud' },
      ]),
    },
  });

  const insp1 = await prisma.inspection.create({
    data: {
      materialId: mat1.id,
      inspectorId: inspectorUser.id,
      standardId: brickStandard.id,
      inspectionDate: new Date('2026-09-10'),
      visualScore: 95,
      assignedGrade: 'GRADE_A',
      result: 'PASSED',
      remarks: 'Exemplary salvage quality. Mortar was lime-based and easily peeled away without fracturing the clay fired core.',
      disclaimer: 'Verified according to SLS-BS-EN-771-1:2026 standards. Non-destructive sample testing conducted on site.',
    },
  });

  await prisma.inspectionTest.createMany({
    data: [
      {
        inspectionId: insp1.id,
        testName: 'Compressive Strength',
        method: 'Hydraulic Press Sample Core',
        unit: 'N/mm²',
        recordedValue: '18.4',
        thresholdRequired: '>= 15.0',
        status: 'PASS',
        notes: 'Exceeds standard requirement by 22.6%',
      },
      {
        inspectionId: insp1.id,
        testName: 'Water Absorption (24hr submersion)',
        method: 'Cold Water Absorption Test',
        unit: '%',
        recordedValue: '8.2',
        thresholdRequired: '<= 12.0',
        status: 'PASS',
        notes: 'Low porosity observed, excellent frost/weather durability',
      },
      {
        inspectionId: insp1.id,
        testName: 'Dimensional Tolerance Variation',
        method: 'Vernier Caliper 10-Unit Average',
        unit: 'mm',
        recordedValue: '1.2',
        thresholdRequired: '<= 3.0',
        status: 'PASS',
        notes: 'High uniformity in batch',
      },
      {
        inspectionId: insp1.id,
        testName: 'Surface Chipping & Cracking',
        method: 'Visual Inspection 100-sample grid',
        unit: 'Score (1-5)',
        recordedValue: '1.0',
        thresholdRequired: '<= 2.0',
        status: 'PASS',
        notes: 'No structural fissures or hairline fracture networks',
      },
    ],
  });

  const list1 = await prisma.listing.create({
    data: {
      materialId: mat1.id,
      sellerId: sellerUser.id,
      title: '4,500 Units Verified Grade A Reclaimed Clay Bricks',
      description: 'Certified Grade A salvaged bricks with full SLSI test certificates and Digital Passport. Immediate dispatch available.',
      pricePerUnit: 68.0, // LKR 68 per brick
      availableQuantity: 4500,
      unit: 'units',
      minOrderQuantity: 500,
      listingType: 'BUY_NOW',
      status: 'ACTIVE',
    },
  });

  // --- Material 2: Structural Steel Universal Beams ---
  const m2Qr = await generateQr('RM-2026-000212');
  const mat2 = await prisma.material.create({
    data: {
      materialId: 'RM-2026-000212',
      categoryId: catMap['structural-steel'].id,
      sellerId: sellerUser.id,
      name: 'Structural Steel Universal I-Beams (UB 203x133x30)',
      description: '24 lengths of S275 structural steel universal beams (6.0m each, total 144 meters). Unbolted from factory roof structure, no flame-cut notches.',
      dimensions: '203 × 133 × 30 mm (6.0m length)',
      lengthMm: 6000,
      widthMm: 133,
      heightMm: 203,
      weightKg: 180.0,
      quantity: 24,
      unit: 'beams (144m)',
      originBuilding: 'Kelaniya Textile Mill Deconstruction',
      ageYears: 18,
      previousUse: 'Mezzanine floor load-bearing grid',
      recoveryDate: new Date('2026-08-28'),
      conditionGrade: 'GRADE_A',
      conditionNotes: 'Clean flanges, original zinc primer coat intact. Flange thickness measured with ultrasonic gauge.',
      storageCondition: 'Elevated steel timber-dunnage rack, dry yard',
      locationAddress: 'Biyagama Industrial Zone, Gate 2 Yard',
      locationCity: 'Gampaha',
      locationPostalCode: '11650',
      status: 'AVAILABLE',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&auto=format&fit=crop&q=80',
      ]),
      documents: JSON.stringify([
        { title: 'Ultrasonic Thickness Gauge Report', type: 'PDF', url: '/docs/steel-thickness-212.pdf' },
        { title: 'Mill Test History & Chemical Assay', type: 'PDF', url: '/docs/mill-spec-212.pdf' },
      ]),
    },
  });

  await prisma.materialPassport.create({
    data: {
      materialId: mat2.id,
      passportNumber: 'RM-2026-000212',
      originSite: 'Kelaniya Textile Mill Demolition',
      demolitionContractor: 'Lanka Green Salvage & Demolition Ltd',
      manufacturingYear: 2008,
      recoveryDate: new Date('2026-08-28'),
      embodiedCarbonSavedKg: 4800.0, // 24 * 200 kg CO2e
      wasteDivertedKg: 4320.0, // 24 * 180 kg
      circularityScore: 96.5,
      currentOwnerId: sellerUser.id,
      currentLocation: 'Biyagama Industrial Zone, Gampaha',
      qrCodeDataUrl: m2Qr,
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date('2026-09-05'),
      verifiedByInspector: 'Eng. Priyantha Silva (Lic. SLIE-8842)',
      reuseNotes: 'Full structural reuse approved for beam spans up to 5.8m under design limit states.',
      version: 1,
      historyLog: JSON.stringify([
        { timestamp: '2026-08-20', action: 'Structural Audit Prior to Demolition', actor: 'CivilSpec Consultants', location: 'Kelaniya Textile Mill' },
        { timestamp: '2026-08-28', action: 'De-bolted & Rigged to Flatbed', actor: 'Lanka Green Salvage', location: 'Kelaniya Textile Mill' },
        { timestamp: '2026-09-05', action: 'NDT Ultrasonic Flange Survey (Passed Grade A)', actor: 'Eng. Priyantha Silva', location: 'Biyagama Yard' },
        { timestamp: '2026-09-06', action: 'Passport Generated with QR Verification', actor: 'ReMatX Engine', location: 'ReMatX Cloud' },
      ]),
    },
  });

  const insp2 = await prisma.inspection.create({
    data: {
      materialId: mat2.id,
      inspectorId: inspectorUser.id,
      standardId: steelStandard.id,
      inspectionDate: new Date('2026-09-05'),
      visualScore: 92,
      assignedGrade: 'GRADE_A',
      result: 'PASSED',
      remarks: 'Exceptional steel preservation. Flange and web thicknesses are within 98.8% of original roll nominals.',
      disclaimer: 'Visual and NDT inspection per SLS-EN-10025-RE. Connective welds must be engineered per project spec.',
    },
  });

  await prisma.inspectionTest.createMany({
    data: [
      {
        inspectionId: insp2.id,
        testName: 'Section Flange Thickness Loss',
        method: 'Olympus 38DL Ultrasonic Gauge',
        unit: '%',
        recordedValue: '1.2',
        thresholdRequired: '<= 5.0',
        status: 'PASS',
        notes: 'Nominal 8.4mm; measured average 8.3mm',
      },
      {
        inspectionId: insp2.id,
        testName: 'Straightness Deviation (Camber/Sweep)',
        method: 'Laser Taut-Line Alignment',
        unit: 'mm/m',
        recordedValue: '0.6',
        thresholdRequired: '<= 2.0',
        status: 'PASS',
        notes: 'Zero residual mechanical distortion',
      },
      {
        inspectionId: insp2.id,
        testName: 'Corrosion Pitting Index',
        method: 'ISO 8501-1 Visual & Depth Micrometer',
        unit: 'Grade',
        recordedValue: 'A',
        thresholdRequired: 'A or B',
        status: 'PASS',
        notes: 'Light atmospheric patina, no structural pitting',
      },
    ],
  });

  const list2 = await prisma.listing.create({
    data: {
      materialId: mat2.id,
      sellerId: sellerUser.id,
      title: 'Structural Steel Beams UB 203x133x30 (24 Beams / 144m)',
      description: 'Engineered grade structural steel beams certified Grade A with complete ultrasonic test history. Ideal for portal frames and warehouse expansions.',
      pricePerUnit: 34500.0, // LKR 34,500 per beam
      availableQuantity: 24,
      unit: 'beams',
      minOrderQuantity: 2,
      listingType: 'ACCEPT_OFFERS',
      status: 'ACTIVE',
    },
  });

  // --- Material 3: Salvaged Ceylon Teak Hardwood Timber ---
  const m3Qr = await generateQr('RM-2026-000305');
  const mat3 = await prisma.material.create({
    data: {
      materialId: 'RM-2026-000305',
      categoryId: catMap['timber'].id,
      sellerId: indSellerUser.id,
      name: 'Salvaged Old-Growth Ceylon Teak Roof Rafters',
      description: '150 pieces of seasoned Ceylon Teak (Tectona grandis) reclaimed from a 60-year-old estate bungalow roof structure. Cross section 100mm x 50mm, 4.2m lengths.',
      dimensions: '100 × 50 mm (4.2m length)',
      lengthMm: 4200,
      widthMm: 100,
      heightMm: 50,
      weightKg: 14.5,
      quantity: 150,
      unit: 'pieces',
      originBuilding: 'Dunhinda Plantation Bungalow, Badulla',
      ageYears: 60,
      previousUse: 'Roof rafters and ceiling trusses',
      recoveryDate: new Date('2026-07-20'),
      conditionGrade: 'GRADE_B',
      conditionNotes: 'Dense seasoned grain, minor surface nail holes that can be filled or trimmed. Natural golden teak patina.',
      storageCondition: 'Stacked horizontally with spacer sticks in ventilated timber shed',
      locationAddress: 'Timber Yard 12, Kaduwela Road',
      locationCity: 'Kaduwela',
      locationPostalCode: '10640',
      status: 'AVAILABLE',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
      ]),
      documents: JSON.stringify([
        { title: 'Timber Species Verification Certificate', type: 'PDF', url: '/docs/teak-cert-305.pdf' },
      ]),
    },
  });

  await prisma.materialPassport.create({
    data: {
      materialId: mat3.id,
      passportNumber: 'RM-2026-000305',
      originSite: 'Dunhinda Tea Estate Bungalow, Badulla',
      demolitionContractor: 'Heritage Wood Salvage',
      manufacturingYear: 1966,
      recoveryDate: new Date('2026-07-20'),
      embodiedCarbonSavedKg: 2130.0, // 150 * 14.2 kg
      wasteDivertedKg: 2175.0,
      circularityScore: 91.0,
      currentOwnerId: indSellerUser.id,
      currentLocation: 'Timber Yard 12, Kaduwela',
      qrCodeDataUrl: m3Qr,
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date('2026-08-02'),
      verifiedByInspector: 'Eng. Priyantha Silva (Lic. SLIE-8842)',
      reuseNotes: 'Excellent for architectural rafters, pergola framing, or bespoke heritage furniture.',
      version: 1,
      historyLog: JSON.stringify([
        { timestamp: '2026-07-15', action: 'Bungalow Timber Survey', actor: 'Heritage Wood Salvage', location: 'Badulla' },
        { timestamp: '2026-07-20', action: 'Manual Rafter Extraction & Denailing', actor: 'Heritage Wood Salvage', location: 'Badulla' },
        { timestamp: '2026-08-02', action: 'Timber Inspection & Moisture Testing', actor: 'Eng. Priyantha Silva', location: 'Kaduwela' },
        { timestamp: '2026-08-05', action: 'Passport Published', actor: 'ReMatX Platform Engine', location: 'ReMatX Cloud' },
      ]),
    },
  });

  const insp3 = await prisma.inspection.create({
    data: {
      materialId: mat3.id,
      inspectorId: inspectorUser.id,
      standardId: timberStandard.id,
      inspectionDate: new Date('2026-08-02'),
      visualScore: 88,
      assignedGrade: 'GRADE_B',
      result: 'PASSED',
      remarks: 'Prime aged Sri Lankan teak. Grade B assigned due to nail hole perforations on bottom chord edge. Structural load capacity intact.',
      disclaimer: 'Acoustic testing shows solid core. Not suitable for underwater immersion.',
    },
  });

  await prisma.inspectionTest.createMany({
    data: [
      {
        inspectionId: insp3.id,
        testName: 'Moisture Content %',
        method: 'Pin-type Electrical Resistance Meter',
        unit: '%',
        recordedValue: '13.8',
        thresholdRequired: '<= 18.0',
        status: 'PASS',
        notes: 'Thoroughly seasoned, stable dimensionally',
      },
      {
        inspectionId: insp3.id,
        testName: 'Wood Borer / Termite Infiltration',
        method: 'Surface Acoustic & Visual Core Check',
        unit: '%',
        recordedValue: '0.0',
        thresholdRequired: '0.0',
        status: 'PASS',
        notes: 'Natural teak oils provided complete insect immunity',
      },
      {
        inspectionId: insp3.id,
        testName: 'Max Warp & Camber Deflection',
        method: 'Cord String Straightedge',
        unit: 'mm/m',
        recordedValue: '1.4',
        thresholdRequired: '<= 3.0',
        status: 'PASS',
        notes: 'Within allowable architectural tolerances',
      },
    ],
  });

  const list3 = await prisma.listing.create({
    data: {
      materialId: mat3.id,
      sellerId: indSellerUser.id,
      title: 'Old-Growth Ceylon Teak Rafters (150 Pcs × 4.2m)',
      description: 'Aged 60+ years natural dry Ceylon teak. Highly prized dark grain. Grade B verified with active Material Passport.',
      pricePerUnit: 6200.0, // LKR 6,200 per piece
      availableQuantity: 150,
      unit: 'pieces',
      minOrderQuantity: 10,
      listingType: 'BUY_NOW',
      status: 'ACTIVE',
    },
  });

  // --- Material 4: Precast Concrete Foundation Blocks ---
  const m4Qr = await generateQr('RM-2026-000418');
  const mat4 = await prisma.material.create({
    data: {
      materialId: 'RM-2026-000418',
      categoryId: catMap['concrete-blocks'].id,
      sellerId: sellerUser.id,
      name: 'High-Density Precast Concrete Blocks (400x200x200)',
      description: '600 solid dense concrete blocks recovered from internal partition walls during warehouse conversion. Intact sharp edges.',
      dimensions: '400 × 200 × 200 mm',
      lengthMm: 400,
      widthMm: 200,
      heightMm: 200,
      weightKg: 28.0,
      quantity: 600,
      unit: 'blocks',
      originBuilding: 'Kelani Valley Cold Storage Unit',
      ageYears: 8,
      previousUse: 'Internal blast freezer partition',
      recoveryDate: new Date('2026-08-10'),
      conditionGrade: 'GRADE_A',
      conditionNotes: 'Zero freeze fractures, cleaned surfaces.',
      storageCondition: 'Outdoor concrete apron, tarpaulin protected',
      locationAddress: 'Wattala Depot, Negombo Road',
      locationCity: 'Wattala',
      locationPostalCode: '11300',
      status: 'AVAILABLE',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80',
      ]),
      documents: JSON.stringify([]),
    },
  });

  await prisma.materialPassport.create({
    data: {
      materialId: mat4.id,
      passportNumber: 'RM-2026-000418',
      originSite: 'Kelani Valley Cold Storage Facility',
      demolitionContractor: 'Lanka Green Salvage',
      manufacturingYear: 2018,
      recoveryDate: new Date('2026-08-10'),
      embodiedCarbonSavedKg: 1470.0, // 600 * 2.45
      wasteDivertedKg: 16800.0, // 600 * 28 kg
      circularityScore: 92.5,
      currentOwnerId: sellerUser.id,
      currentLocation: 'Wattala Depot, Negombo Road',
      qrCodeDataUrl: m4Qr,
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date('2026-08-18'),
      verifiedByInspector: 'Eng. Priyantha Silva (Lic. SLIE-8842)',
      reuseNotes: 'Grade A rating for retaining walls, boundary works and basement partitions.',
      version: 1,
      historyLog: JSON.stringify([
        { timestamp: '2026-08-10', action: 'Blocks Salvaged & Palletized', actor: 'Lanka Green Salvage', location: 'Kelani Valley' },
        { timestamp: '2026-08-18', action: 'Rebound Hammer Tested (Grade A)', actor: 'Eng. Priyantha Silva', location: 'Wattala Depot' },
      ]),
    },
  });

  const list4 = await prisma.listing.create({
    data: {
      materialId: mat4.id,
      sellerId: sellerUser.id,
      title: '600 Pcs Precast High-Density Concrete Blocks (400x200x200)',
      description: 'Solid dense blocks ready for load-bearing retaining wall or boundary masonry. Verified Grade A.',
      pricePerUnit: 280.0,
      availableQuantity: 600,
      unit: 'blocks',
      minOrderQuantity: 50,
      listingType: 'REQUEST_QUOTE',
      status: 'ACTIVE',
    },
  });

  // --- Material 5: Colonial Teak French Doors ---
  const m5Qr = await generateQr('RM-2026-000523');
  const mat5 = await prisma.material.create({
    data: {
      materialId: 'RM-2026-000523',
      categoryId: catMap['doors-windows'].id,
      sellerId: indSellerUser.id,
      name: 'Colonial Period Hardwood Double Glazed French Doors',
      description: '8 sets of double-leaf glazed timber French doors with arched fanlights and original polished brass bolt hardware. Salvaged from a 1930s colonial residence.',
      dimensions: '2100 × 1200 × 45 mm',
      lengthMm: 2100,
      widthMm: 1200,
      heightMm: 45,
      weightKg: 42.0,
      quantity: 8,
      unit: 'sets',
      originBuilding: 'Claughton Manor, Cinnamon Gardens, Colombo 07',
      ageYears: 92,
      previousUse: 'Verandah access garden doors',
      recoveryDate: new Date('2026-08-01'),
      conditionGrade: 'GRADE_A',
      conditionNotes: 'All glass panes intact, brass hinges serviced, beautiful vintage profile.',
      storageCondition: 'Vertical padded timber crate, wrapped',
      locationAddress: 'Artisan Workshop, Nawala Road',
      locationCity: 'Rajagiriya',
      locationPostalCode: '10107',
      status: 'AVAILABLE',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80',
      ]),
      documents: JSON.stringify([]),
    },
  });

  await prisma.materialPassport.create({
    data: {
      materialId: mat5.id,
      passportNumber: 'RM-2026-000523',
      originSite: 'Claughton Manor, Colombo 07',
      demolitionContractor: 'Heritage Wood Salvage',
      manufacturingYear: 1934,
      recoveryDate: new Date('2026-08-01'),
      embodiedCarbonSavedKg: 280.0,
      wasteDivertedKg: 336.0,
      circularityScore: 98.0,
      currentOwnerId: indSellerUser.id,
      currentLocation: 'Artisan Workshop, Rajagiriya',
      qrCodeDataUrl: m5Qr,
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date('2026-08-12'),
      verifiedByInspector: 'Eng. Priyantha Silva (Lic. SLIE-8842)',
      reuseNotes: 'Heritage architectural asset. Suitable for high-end residential or boutique hotel restoration.',
      version: 1,
      historyLog: JSON.stringify([
        { timestamp: '2026-08-01', action: 'Carefully Unpinned from Masonry Reveals', actor: 'Heritage Wood', location: 'Colombo 07' },
        { timestamp: '2026-08-12', action: 'Carpentry & Joinery Inspection Passed', actor: 'Eng. Priyantha Silva', location: 'Rajagiriya' },
      ]),
    },
  });

  const list5 = await prisma.listing.create({
    data: {
      materialId: mat5.id,
      sellerId: indSellerUser.id,
      title: 'Colonial Teak French Glazed Doors (8 Sets with Fanlights)',
      description: 'Authentic 1930s colonial architectural doors complete with original brass hinges and bevelled glass.',
      pricePerUnit: 48000.0,
      availableQuantity: 8,
      unit: 'sets',
      minOrderQuantity: 1,
      listingType: 'BUY_NOW',
      status: 'ACTIVE',
    },
  });

  // --- Material 6: Material Pending Inspection (Under Review) ---
  const mat6 = await prisma.material.create({
    data: {
      materialId: 'RM-2026-000850',
      categoryId: catMap['timber'].id,
      sellerId: sellerUser.id,
      name: 'Reclaimed Heavy Timber Floor Joists (Kumbuk)',
      description: '80 pieces of heavy Kumbuk joists salvaged from an old rice mill ceiling structure. Awaiting formal inspection & moisture verification.',
      dimensions: '150 × 75 mm (5.0m length)',
      lengthMm: 5000,
      widthMm: 150,
      heightMm: 75,
      weightKg: 55.0,
      quantity: 80,
      unit: 'pieces',
      originBuilding: 'Matara Rice Processing Complex',
      ageYears: 35,
      previousUse: 'Grain silo floor support joists',
      recoveryDate: new Date('2026-09-02'),
      conditionGrade: 'GRADE_B',
      conditionNotes: 'Surface weathered, dry, awaiting inspector moisture measurement.',
      storageCondition: 'Open air yard covered by tarp',
      locationAddress: 'Peliyagoda Logistics Park, Bay 7',
      locationCity: 'Colombo',
      locationPostalCode: '11830',
      status: 'UNDER_REVIEW',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=800&auto=format&fit=crop&q=80',
      ]),
      documents: JSON.stringify([]),
    },
  });

  // Inspector assignment in progress for Material 6
  await prisma.inspection.create({
    data: {
      materialId: mat6.id,
      inspectorId: inspectorUser.id,
      standardId: timberStandard.id,
      inspectionDate: new Date('2026-09-20'),
      visualScore: 80,
      assignedGrade: 'GRADE_B',
      result: 'PASSED_WITH_CONDITIONS',
      remarks: 'Scheduled for on-site moisture probe testing and surface cleaning audit.',
      disclaimer: 'Pending completion of laboratory moisture check.',
    },
  });

  // 8. Create Realistic Transactions (Offer, Order, Delivery, Invoice)
  const sampleOffer = await prisma.offer.create({
    data: {
      listingId: list1.id,
      buyerId: buyerUser.id,
      offeredPricePerUnit: 65.0,
      requestedQuantity: 2000,
      totalOfferAmount: 130000.0,
      notes: 'Requesting 2,000 bricks for our low-carbon residential development project in Moratuwa.',
      status: 'ACCEPTED',
    },
  });

  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-00018',
      listingId: list1.id,
      buyerId: buyerUser.id,
      sellerId: sellerUser.id,
      offerId: sampleOffer.id,
      quantity: 2000,
      unit: 'units',
      unitPrice: 65.0,
      subtotal: 130000.0,
      taxAmount: 0.0,
      logisticsFee: 12000.0,
      totalAmount: 142000.0,
      paymentStatus: 'ESCROW_HELD',
      paymentMethod: 'ESCROW_BANK_TRANSFER',
      invoiceNumber: 'INV-2026-0084',
      deliveryStatus: 'IN_TRANSIT',
      deliveryAddress: 'Plot 42, Marine Drive, Moratuwa, Sri Lanka',
      carrierName: 'Circular Haulage & Freight Logistics',
      trackingNumber: 'TRK-LK-992014',
      estimatedDelivery: new Date('2026-09-21'),
    },
  });

  // 9. Messages
  await prisma.message.create({
    data: {
      senderId: buyerUser.id,
      receiverId: sellerUser.id,
      materialId: mat1.id,
      content: 'Hello Sunil, can we arrange flatbed delivery with crane offloading for the 2,000 bricks at the Moratuwa site?',
      read: true,
      createdAt: new Date('2026-09-15T09:30:00Z'),
    },
  });

  await prisma.message.create({
    data: {
      senderId: sellerUser.id,
      receiverId: buyerUser.id,
      materialId: mat1.id,
      content: 'Hi Rohan! Yes, our logistics partner Circular Haulage has a 5-ton crane truck ready. Estimated dispatch is Monday morning.',
      read: true,
      createdAt: new Date('2026-09-15T10:15:00Z'),
    },
  });

  // 10. Reviews
  await prisma.review.create({
    data: {
      authorId: buyerUser.id,
      targetUserId: sellerUser.id,
      rating: 5,
      comment: 'Materials matched the Digital Passport specifications exactly! Clean, palletized, and delivered with all SLSI test sheets.',
    },
  });

  // 11. Notifications
  await prisma.notification.create({
    data: {
      userId: buyerUser.id,
      title: 'Order Dispatched',
      message: 'Your order ORD-2026-00018 (2,000 Reclaimed Clay Bricks) is now in transit with tracking TRK-LK-992014.',
      link: '/orders',
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: inspectorUser.id,
      title: 'New Inspection Request Assigned',
      message: 'Material RM-2026-000850 (Kumbuk Timber Joists) has been submitted for verification.',
      link: '/inspector',
      read: false,
    },
  });

  console.log('Seeding completed successfully!');
  console.log({
    usersCreated: 7,
    companiesCreated: 3,
    categoriesCreated: categories.length,
    materialsCreated: 6,
    passportsCreated: 5,
    listingsCreated: 5,
    ordersCreated: 1,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
