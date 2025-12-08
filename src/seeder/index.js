import AppVersionSeeder from "./appVersionSeeder";

export default async function seed() {
    // Seed app versions
    await AppVersionSeeder.seed();
}