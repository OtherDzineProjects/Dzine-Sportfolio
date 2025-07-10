import { storage } from "./storage";
import bcrypt from "bcryptjs";

// Kerala Districts for organizational structure
const keralaDistricts = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", 
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", 
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

// Sports categories for organizations
const sportsCategories = [
  "Football", "Cricket", "Basketball", "Volleyball", "Athletics", 
  "Swimming", "Tennis", "Badminton", "Hockey", "Kabaddi", 
  "Boxing", "Wrestling", "Weightlifting", "Table Tennis", "Taekwondo",
  "Karate", "Judo", "Gymnastics", "Cycling", "Archery"
];

export async function seedKeralaOrganizations() {
  console.log("Seeding Kerala Sports Organizations...");

  // 1. Create Kerala State Sports Council (KSSC) Admin User
  let ksscAdmin = await storage.getUserByEmail("admin_kssc@kerala.gov.in");
  if (!ksscAdmin) {
    ksscAdmin = await storage.createUser({
      username: "admin_Kerala_State_Sports_Council",
      email: "admin_kssc@kerala.gov.in",
      password: await bcrypt.hash("KSSC@2024", 10),
      firstName: "Admin",
      lastName: "KSSC",
      userType: "admin",
      phone: "+91-471-2518231",
      city: "Thiruvananthapuram",
      district: "Thiruvananthapuram",
      approvalStatus: "approved",
      approvedBy: 1,
      sportsInterests: sportsCategories.slice(0, 10)
    });
    console.log("Created KSSC admin user");
  }

  // 2. Create Kerala State Sports Council
  let ksscOrg = await storage.getUserOrganizations(ksscAdmin.id);
  let kssc = ksscOrg.find(org => org.name === "Kerala State Sports Council");
  
  if (!kssc) {
    kssc = await storage.createUserOrganization({
      name: "Kerala State Sports Council",
      description: "The apex body for sports development in Kerala state",
      ownerId: ksscAdmin.id,
      organizationType: "government_council",
      state: "Kerala",
      district: "Thiruvananthapuram",
      address: "Sports Authority of India Complex, Thiruvananthapuram",
      pincode: "695001",
      phone: "+91-471-2518231",
      email: "info@kssc.kerala.gov.in",
      website: "https://kssc.kerala.gov.in",
      verificationStatus: "verified",
      verifiedBy: 1,
      verificationDate: new Date(),
      sportsInterests: sportsCategories,
      facilityAvailability: [
        { sport: "Athletics", hasVenue: true, venueType: "owned", capacity: 5000 },
        { sport: "Swimming", hasVenue: true, venueType: "owned", capacity: 500 },
        { sport: "Football", hasVenue: true, venueType: "owned", capacity: 10000 }
      ],
      completedQuestionnaire: true
    });
    console.log("Created Kerala State Sports Council");
  }

  // 3. Create District Sports Councils
  for (const district of keralaDistricts) {
    let districtAdmin = await storage.getUserByEmail(`admin_${district.toLowerCase().replace(' ', '_')}_dsc@kerala.gov.in`);
    if (!districtAdmin) {
      districtAdmin = await storage.createUser({
        username: `admin_${district}_District_Sports_Council`,
        email: `admin_${district.toLowerCase().replace(' ', '_')}_dsc@kerala.gov.in`,
        password: await bcrypt.hash(`${district}DSC@2024`, 10),
        firstName: "Admin",
        lastName: `${district} DSC`,
        userType: "admin",
        phone: "+91-9876543210",
        city: district,
        district: district,
        approvalStatus: "approved",
        approvedBy: 1,
        sportsInterests: sportsCategories.slice(0, 8)
      });
    }

    let districtOrgs = await storage.getUserOrganizations(districtAdmin.id);
    let districtCouncil = districtOrgs.find(org => org.name === `${district} District Sports Council`);
    
    if (!districtCouncil) {
      districtCouncil = await storage.createUserOrganization({
        name: `${district} District Sports Council`,
        description: `District Sports Council for ${district} district`,
        ownerId: districtAdmin.id,
        organizationType: "district_council",
        state: "Kerala",
        district: district,
        address: `District Sports Complex, ${district}`,
        pincode: "600001",
        phone: "+91-9876543210",
        email: `info@${district.toLowerCase()}dsc.kerala.gov.in`,
        verificationStatus: "verified",
        verifiedBy: ksscAdmin.id,
        verificationDate: new Date(),
        sportsInterests: sportsCategories.slice(0, 12),
        facilityAvailability: [
          { sport: "Football", hasVenue: true, venueType: "owned", capacity: 2000 },
          { sport: "Athletics", hasVenue: true, venueType: "owned", capacity: 1000 }
        ],
        completedQuestionnaire: true
      });
      
      // Create hierarchy relationship
      await storage.createOrganizationHierarchy({
        parentOrganizationId: kssc.id,
        childOrganizationId: districtCouncil.id,
        hierarchyType: "state_district",
        level: 1
      });
    }
  }

  // 4. Create State Sports Associations with their district branches
  const stateSportsAssociations = [
    { name: "Kerala State Football Association", sport: "Football", acronym: "KSFA" },
    { name: "Kerala State Cricket Association", sport: "Cricket", acronym: "KSCA" },
    { name: "Kerala State Volleyball Association", sport: "Volleyball", acronym: "KSVA" },
    { name: "Kerala State Basketball Association", sport: "Basketball", acronym: "KSBA" },
    { name: "Kerala State Athletics Association", sport: "Athletics", acronym: "KSAA" },
    { name: "Kerala State Badminton Association", sport: "Badminton", acronym: "KSBDA" },
    { name: "Kerala State Boxing Association", sport: "Boxing", acronym: "KSBXA" },
    { name: "Kerala State Taekwondo Association", sport: "Taekwondo", acronym: "KSTA" },
    { name: "Kerala State Karate Association", sport: "Karate", acronym: "KSKA" },
    { name: "Kerala State Hockey Association", sport: "Hockey", acronym: "KSHA" },
    { name: "Kerala State Table Tennis Association", sport: "Table Tennis", acronym: "KSTTA" },
    { name: "Kerala State Swimming Association", sport: "Swimming", acronym: "KSSA" }
  ];

  for (const association of stateSportsAssociations) {
    // Create state association admin
    let stateAdmin = await storage.getUserByEmail(`admin_${association.acronym.toLowerCase()}@kerala.gov.in`);
    if (!stateAdmin) {
      stateAdmin = await storage.createUser({
        username: `admin_${association.name.replace(/\s+/g, '_')}`,
        email: `admin_${association.acronym.toLowerCase()}@kerala.gov.in`,
        password: await bcrypt.hash(`${association.acronym}@2024`, 10),
        firstName: "Admin",
        lastName: association.acronym,
        userType: "admin",
        phone: "+91-9876543210",
        city: "Thiruvananthapuram",
        district: "Thiruvananthapuram",
        approvalStatus: "approved",
        approvedBy: 1,
        sportsInterests: [association.sport]
      });
    }

    // Create state association
    let stateOrgs = await storage.getUserOrganizations(stateAdmin.id);
    let stateAssociation = stateOrgs.find(org => org.name === association.name);
    
    if (!stateAssociation) {
      stateAssociation = await storage.createUserOrganization({
        name: association.name,
        description: `Official state association for ${association.sport} in Kerala`,
        ownerId: stateAdmin.id,
        organizationType: "state_association",
        state: "Kerala",
        district: "Thiruvananthapuram",
        address: `${association.sport} Bhavan, Thiruvananthapuram`,
        pincode: "695001",
        phone: "+91-9876543210",
        email: `info@${association.acronym.toLowerCase()}.kerala.gov.in`,
        website: `https://${association.acronym.toLowerCase()}.kerala.gov.in`,
        verificationStatus: "verified",
        verifiedBy: ksscAdmin.id,
        verificationDate: new Date(),
        sportsInterests: [association.sport],
        facilityAvailability: [
          { sport: association.sport, hasVenue: true, venueType: "owned", capacity: 1500 }
        ],
        completedQuestionnaire: true
      });

      // Create hierarchy with KSSC
      await storage.createOrganizationHierarchy({
        parentOrganizationId: kssc.id,
        childOrganizationId: stateAssociation.id,
        hierarchyType: "association_branch",
        level: 1
      });
    }

    // Create district associations for each sport
    for (const district of keralaDistricts) {
      let districtAssocAdmin = await storage.getUserByEmail(`admin_${district.toLowerCase().replace(' ', '_')}_${association.acronym.toLowerCase()}@kerala.gov.in`);
      if (!districtAssocAdmin) {
        districtAssocAdmin = await storage.createUser({
          username: `admin_${district}_${association.sport}_Association`,
          email: `admin_${district.toLowerCase().replace(' ', '_')}_${association.acronym.toLowerCase()}@kerala.gov.in`,
          password: await bcrypt.hash(`${district}${association.acronym}@2024`, 10),
          firstName: "Admin",
          lastName: `${district} ${association.acronym}`,
          userType: "admin",
          phone: "+91-9876543210",
          city: district,
          district: district,
          approvalStatus: "approved",
          approvedBy: stateAdmin.id,
          sportsInterests: [association.sport]
        });
      }

      let districtAssocOrgs = await storage.getUserOrganizations(districtAssocAdmin.id);
      let districtAssociation = districtAssocOrgs.find(org => org.name === `${district} District ${association.sport} Association`);
      
      if (!districtAssociation) {
        districtAssociation = await storage.createUserOrganization({
          name: `${district} District ${association.sport} Association`,
          description: `District ${association.sport} association for ${district}`,
          ownerId: districtAssocAdmin.id,
          organizationType: "district_association",
          state: "Kerala",
          district: district,
          address: `${association.sport} Complex, ${district}`,
          pincode: "600001",
          phone: "+91-9876543210",
          email: `info@${district.toLowerCase()}${association.acronym.toLowerCase()}.kerala.gov.in`,
          verificationStatus: "verified",
          verifiedBy: stateAdmin.id,
          verificationDate: new Date(),
          sportsInterests: [association.sport],
          facilityAvailability: [
            { sport: association.sport, hasVenue: true, venueType: "rented", capacity: 500 }
          ],
          completedQuestionnaire: true
        });

        // Create hierarchy with state association
        await storage.createOrganizationHierarchy({
          parentOrganizationId: stateAssociation.id,
          childOrganizationId: districtAssociation.id,
          hierarchyType: "state_district",
          level: 1
        });
      }
    }
  }

  // 5. Create University Sports Councils
  const universities = [
    { name: "Kerala University Sports Council", location: "Thiruvananthapuram" },
    { name: "Mahatma Gandhi University Sports Council", location: "Kottayam" },
    { name: "Calicut University Sports Council", location: "Kozhikode" },
    { name: "Kannur University Sports Council", location: "Kannur" },
    { name: "Kerala University of Technology Sports Council", location: "Thiruvananthapuram" }
  ];

  for (const university of universities) {
    let uniAdmin = await storage.getUserByEmail(`admin_${university.name.toLowerCase().replace(/\s+/g, '_')}@university.kerala.gov.in`);
    if (!uniAdmin) {
      uniAdmin = await storage.createUser({
        username: `admin_${university.name.replace(/\s+/g, '_')}`,
        email: `admin_${university.name.toLowerCase().replace(/\s+/g, '_')}@university.kerala.gov.in`,
        password: await bcrypt.hash(`UniSports@2024`, 10),
        firstName: "Admin",
        lastName: "University Sports",
        userType: "admin",
        phone: "+91-9876543210",
        city: university.location,
        district: university.location,
        approvalStatus: "approved",
        approvedBy: ksscAdmin.id,
        sportsInterests: sportsCategories.slice(0, 15)
      });
    }

    let uniOrgs = await storage.getUserOrganizations(uniAdmin.id);
    let uniSportsCouncil = uniOrgs.find(org => org.name === university.name);
    
    if (!uniSportsCouncil) {
      uniSportsCouncil = await storage.createUserOrganization({
        name: university.name,
        description: `University sports council promoting collegiate sports`,
        ownerId: uniAdmin.id,
        organizationType: "university_council",
        state: "Kerala",
        district: university.location,
        address: `University Campus, ${university.location}`,
        pincode: "600001",
        phone: "+91-9876543210",
        email: `sports@${university.name.toLowerCase().replace(/\s+/g, '')}.ac.in`,
        verificationStatus: "verified",
        verifiedBy: ksscAdmin.id,
        verificationDate: new Date(),
        sportsInterests: sportsCategories.slice(0, 12),
        facilityAvailability: [
          { sport: "Athletics", hasVenue: true, venueType: "owned", capacity: 2000 },
          { sport: "Football", hasVenue: true, venueType: "owned", capacity: 3000 },
          { sport: "Basketball", hasVenue: true, venueType: "owned", capacity: 1000 }
        ],
        completedQuestionnaire: true
      });

      // Create hierarchy with KSSC
      await storage.createOrganizationHierarchy({
        parentOrganizationId: kssc.id,
        childOrganizationId: uniSportsCouncil.id,
        hierarchyType: "association_branch",
        level: 1
      });
    }
  }

  // 6. Create Private Sports Organizations
  const privateOrgs = [
    { name: "Sports Kerala Foundation", type: "foundation", location: "Thiruvananthapuram" },
    { name: "Kerala Cricket Association", type: "private_association", location: "Kochi" },
    { name: "Kerala Blasters FC Academy", type: "academy", location: "Kochi" },
    { name: "Gokulam Kerala FC Academy", type: "academy", location: "Kozhikode" },
    { name: "Lakshya Sports Academy", type: "academy", location: "Thiruvananthapuram" },
    { name: "Kerala Adventure Sports Society", type: "society", location: "Munnar" }
  ];

  for (const org of privateOrgs) {
    let orgAdmin = await storage.getUserByEmail(`admin_${org.name.toLowerCase().replace(/\s+/g, '_')}@sportfolio.com`);
    if (!orgAdmin) {
      orgAdmin = await storage.createUser({
        username: `admin_${org.name.replace(/\s+/g, '_')}`,
        email: `admin_${org.name.toLowerCase().replace(/\s+/g, '_')}@sportfolio.com`,
        password: await bcrypt.hash(`${org.name.replace(/\s+/g, '')}@2024`, 10),
        firstName: "Admin",
        lastName: org.name.split(' ')[0],
        userType: "organization",
        phone: "+91-9876543210",
        city: org.location,
        district: org.location,
        approvalStatus: "approved",
        approvedBy: ksscAdmin.id,
        sportsInterests: sportsCategories.slice(0, 8)
      });
    }

    let orgList = await storage.getUserOrganizations(orgAdmin.id);
    let privateOrg = orgList.find(o => o.name === org.name);
    
    if (!privateOrg) {
      privateOrg = await storage.createUserOrganization({
        name: org.name,
        description: `Private sports organization promoting sports development`,
        ownerId: orgAdmin.id,
        organizationType: org.type,
        state: "Kerala",
        district: org.location,
        address: `Sports Complex, ${org.location}`,
        pincode: "600001",
        phone: "+91-9876543210",
        email: `info@${org.name.toLowerCase().replace(/\s+/g, '')}.com`,
        verificationStatus: "verified",
        verifiedBy: ksscAdmin.id,
        verificationDate: new Date(),
        sportsInterests: sportsCategories.slice(0, 6),
        facilityAvailability: [
          { sport: "Football", hasVenue: true, venueType: "owned", capacity: 1000 }
        ],
        completedQuestionnaire: true
      });
    }
  }

  console.log("✅ Kerala Sports Organizations seeding completed!");
  console.log(`Created comprehensive organizational structure with:`);
  console.log(`- 1 State Sports Council (KSSC)`);
  console.log(`- ${keralaDistricts.length} District Sports Councils`);
  console.log(`- ${stateSportsAssociations.length} State Sports Associations`);
  console.log(`- ${stateSportsAssociations.length * keralaDistricts.length} District Sport Associations`);
  console.log(`- ${universities.length} University Sports Councils`);
  console.log(`- ${privateOrgs.length} Private Sports Organizations`);
  console.log(`Total: ${1 + keralaDistricts.length + stateSportsAssociations.length + (stateSportsAssociations.length * keralaDistricts.length) + universities.length + privateOrgs.length} organizations`);
}