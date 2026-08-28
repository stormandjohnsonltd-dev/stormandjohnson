import { connectDB } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";
import { Admin } from "../src/models/Admin";
import { Brand } from "../src/models/Brand";
import { Category } from "../src/models/Category";
import { Product } from "../src/models/Product";
import { Company } from "../src/models/Company";
import { createSlug } from "../src/lib/utils";

async function seed() {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@stormandjohnson.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

  const brandNames = ["POLOLUX", "QIMING", "LITON"];
  const categoryNames = [
    "Solar Street Lights",
    "LED Bulbs",
    "Bulkhead Lamps",
    "Panel Lights",
  ];

  for (const name of brandNames) {
    await Brand.updateOne(
      { slug: createSlug(name) },
      {
        $set: {
          name,
          slug: createSlug(name),
          isActive: true,
        },
      },
      { upsert: true }
    );
  }

  for (const name of categoryNames) {
    await Category.updateOne(
      { slug: createSlug(name) },
      {
        $set: {
          name,
          slug: createSlug(name),
          isActive: true,
        },
      },
      { upsert: true }
    );
  }

  const brands = await Brand.find({});
  const categories = await Category.find({});
  const brandMap = Object.fromEntries(brands.map((b) => [b.name, b._id]));
  const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c._id]));

  const products = [
    {
      name: "Pololux 100W Panel Light",
      price: 45000,
      compareAtPrice: 52000,
      brand: brandMap.POLOLUX,
      category: categoryMap["Panel Lights"],
      shortDescription: "Bright, efficient panel light for offices and commercial spaces.",
      description:
        "A premium panel light built for strong, even illumination with low energy consumption and long service life.",
      images: ["/images/products/panel-light.jpg"],
      features: ["Low energy use", "Clean premium finish", "Long lifespan"],
      specs: [
        { label: "Wattage", value: "100W" },
        { label: "Use Case", value: "Office / Commercial" },
      ],
      stock: 35,
      isFeatured: true,
    },
    {
      name: "Qiming 8-Eye Solar Street Light",
      price: 185000,
      compareAtPrice: 210000,
      brand: brandMap.QIMING,
      category: categoryMap["Solar Street Lights"],
      shortDescription: "High-output solar street light for estates and roadways.",
      description:
        "Designed for outdoor reliability, this 8-Eye solar street light offers strong illumination and dependable performance.",
      images: ["/images/products/solar-street-light.jpg"],
      features: ["Solar powered", "Outdoor durability", "Wide coverage"],
      specs: [
        { label: "Model", value: "8-Eye" },
        { label: "Power Source", value: "Solar" },
      ],
      stock: 14,
      isFeatured: true,
    },
    {
      name: "Liton LED Bulb Type A",
      price: 6500,
      compareAtPrice: 8000,
      brand: brandMap.LITON,
      category: categoryMap["LED Bulbs"],
      shortDescription: "Energy-saving LED bulb ideal for homes and retail spaces.",
      description:
        "A durable LED bulb that delivers consistent brightness while helping customers reduce power bills.",
      images: ["/images/products/led-bulb.jpg"],
      features: ["Affordable efficiency", "Strong brightness", "Long-lasting"],
      specs: [
        { label: "Type", value: "Type A" },
        { label: "Application", value: "Home / Retail" },
      ],
      stock: 120,
      isFeatured: false,
    },
  ];

  for (const product of products) {
    await Product.updateOne(
      { slug: createSlug(product.name) },
      {
        $set: {
          ...product,
          slug: createSlug(product.name),
          isActive: true,
        },
      },
      { upsert: true }
    );
  }

  const existingAdmin = await Admin.findOne({ email: adminEmail.toLowerCase() });
  if (!existingAdmin) {
    await Admin.create({
      name: "Storm & Johnson Admin",
      email: adminEmail.toLowerCase(),
      password: await hashPassword(adminPassword),
    });
  }

  await Company.updateOne(
    {},
    {
      $set: {
        name: "Storm & Johnson Limited",
        tagline: "Premium energy-efficient lighting products in Nigeria",
        about:
          "Storm and Johnson Limited is a premium energy solutions company based in Lagos, Nigeria, specializing in the marketing and distribution of high-quality, energy-efficient lighting products.",
        mission: "To deliver reliable, energy-saving lighting solutions for homes and businesses across Nigeria.",
        vision: "To become a trusted national lighting brand powering brighter communities.",
        officeLine: "09066034767",
        whatsappNumbers: ["+234 9041140745", "+234 7047906791"],
        email: "stormandjohnsonltd@gmail.com",
        address: "Lagos, Nigeria",
      },
    },
    { upsert: true }
  );

  console.log("Seed complete");
  console.log(`Admin email: ${adminEmail}`);
  console.log(`Admin password: ${adminPassword}`);

  try {
    const { warmCatalogCache } = await import("../src/lib/queries");
    await warmCatalogCache();
    console.log("Catalog cache warmed");
  } catch (err) {
    console.warn("Could not warm catalog cache:", err);
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

