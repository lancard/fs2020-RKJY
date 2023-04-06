const fs = require("fs");
const path = require('path');
const fragmenter = require("@flybywiresim/fragmenter");

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}

const followDirectory = (dir, obj) => {
    try {
        const list = fs.readdirSync(dir);

        list.forEach(filename => {
            followDirectory(dir + "/" + filename, obj);
        });
    }
    catch (e) {
        if (path.basename(dir) == "manifest.json")
            return;
        obj.push({ path: dir, size: getFilesizeInBytes(dir), date: 132424775057196676 });
        return;
    }
}

const generateFS2020LayoutJson = () => {
    try {
        const layout = { content: [] };
        process.chdir('./scenery');
        followDirectory(".", layout.content);
        process.chdir('..');
        fs.writeFileSync("./scenery/layout.json", JSON.stringify(layout, null, '\t'));
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

const generateFlyByWireModulesJson = async () => {
    try {
        const result = await fragmenter.pack({
            baseDir: "./scenery",
            outDir: "./build-modules",
            modules: [
            ],
        });
        console.log(result);
        console.log(fs.readFileSync("./build-modules/modules.json").toString());
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

generateFS2020LayoutJson();
generateFlyByWireModulesJson();
