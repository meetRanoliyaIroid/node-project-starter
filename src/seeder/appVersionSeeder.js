import AppVersion from "../../model/appVersion";

export default class AppVersionSeeder {
    static async seed() {
        const appVersions = [
            {
                min_version: '1.0.0',
                version: '1.0.0',
                app_link: '',
                platform: 1, // 1: ios
            },
            {
                min_version: '1.0.0',
                version: '1.0.0',
                app_link: '',
                platform: 2, // 2: android
            },
        ];

        const isExist = await AppVersion.findOne();

        if (!isExist) {
            await AppVersion.bulkCreate(appVersions);
        }
    }
}