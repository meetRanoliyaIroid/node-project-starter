const fs = require("fs");
const path = require("path");
const net = require("net");


function runChecklist() {
    console.log("🔍 Running Server Deployment Checklist...\n");

    const checklist = [];

    // Check .env file
    const envPath = path.join(__dirname, ".env");
    if (!fs.existsSync(envPath)) {
        checklist.push("❌ Missing .env file.");
    }

    const requiredEnvKeys = [
        "APP_NAME",
        "ENV",
        "BASE_URL",
        "HOST",
        "PORT",
        "IS_SECURE",
        "SSL_CERT_BASE_PATH",
        "IS_PROXY",
        "STATIC_OTP_ENV",
        "DB_CONNECTION",
        "DB_HOST",
        "DB_USERNAME",
        "DB_PASSWORD",
        "DB_NAME",
        "DB_PORT",
        "MAIL_HOST",
        "MAIL_PORT",
        "MAIL_USERNAME",
        "MAIL_PASSWORD",
        "MAIL_ENCRYPTION"
    ];
    
    const envContent = fs.existsSync(envPath)
        ? fs.readFileSync(envPath, "utf8").split("\n")
        : [];
    // Only consider lines with '=' and ignore comments and empty lines
    const presentKeys = envContent
        .map(line => line.trim())
        .filter(line => line && !line.startsWith("#") && line.includes("="))
        .map(line => line.split("=")[0].trim());

    // Check for missing keys
    requiredEnvKeys.forEach((key) => {
        if (!presentKeys.includes(key)) {
            checklist.push(`❌ ENV key missing: ${key}`);
        }
    });

    // Check for extra keys
    presentKeys.forEach((key) => {
        if (!requiredEnvKeys.includes(key)) {
            checklist.push(`❌ Extra ENV key found: ${key}`);
        }
    });

    // Folder permissions
    const foldersToCheck = [
        "public/admin/repositoryImage",
        "public/admin/repositoryPersonaImage",
        "public/accountImage"
    ];
    const baseFolder = 'public';
    const baseFolderPath = path.join(__dirname, baseFolder);

    let baseFolderHasWrite = false;
    if (!fs.existsSync(baseFolderPath)) {
        checklist.push(`❌ Base folder missing: ${baseFolder}`);
    } else {
        try {
            fs.accessSync(baseFolderPath, fs.constants.W_OK | fs.constants.R_OK | fs.constants.X_OK);
            baseFolderHasWrite = true;
        } catch {
            checklist.push(`❌ No full access (read/write/execute) for base folder: ${baseFolder}`);
        }
    }

    if (baseFolderHasWrite) {
        // Try to create subfolders if missing
        foldersToCheck.forEach((folder) => {
            const folderPath = path.join(__dirname, folder);
            if (!fs.existsSync(folderPath)) {
                try {
                    fs.mkdirSync(folderPath, { recursive: true });
                    // Optionally, you can log that it was created
                    // checklist.push(`ℹ️ Created missing folder: ${folder}`);
                } catch (err) {
                    checklist.push(`❌ Failed to create folder: ${folder} (${err.message})`);
                }
            }
        });
    } else {
        // If base folder is not accessible, check all subfolders individually
        foldersToCheck.forEach((folder) => {
            const folderPath = path.join(__dirname, folder);
            if (!fs.existsSync(folderPath)) {
                checklist.push(`❌ Folder missing: ${folder}`);
            } else {
                try {
                    fs.accessSync(folderPath, fs.constants.W_OK);
                } catch {
                    checklist.push(`❌ No write permission for folder: ${folder}`);
                }
            }
        });
    }

    // Node modules
    if (!fs.existsSync(path.join(__dirname, "node_modules"))) {
        checklist.push("❌ node_modules not found. Run `npm install`.");
    }

    // Node.js version
    // const expectedNodeMajor = 18;
    // const nodeMajor = parseInt(process.versions.node.split(".")[0]);
    // if (nodeMajor !== expectedNodeMajor) {
    //     checklist.push(`❌ Node.js version is ${process.version}. Expected v${expectedNodeMajor}.x`);
    // }


    // Package.json start script
    const pkgPath = path.join(__dirname, "package.json");
    if (fs.existsSync(pkgPath)) {
        const pkg = require(pkgPath);
        if (!pkg.scripts) {
            checklist.push("❌ Missing  scripts in package.json.");
        }
    } else {
        checklist.push("❌ package.json not found.");
    }

    // Wait for all async port checks before final result
    Promise.all(checklist).then(() => {
        // Final result
        if (checklist.length > 0) {
            console.log("\n🚨 Checklist failed with following issues:\n");
            checklist.forEach((msg) => console.log(msg));
            console.log("\n❌ Server startup aborted. Fix the above issues.\n");
            process.exit(1);
        } else {
            console.log("✅ All pre-checks passed. Starting the server...\n");
        }
    });
}

module.exports = runChecklist;