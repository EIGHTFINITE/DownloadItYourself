/**
 * Driver for downloading from libraries.minecraft.net
 */
temp.href = current.url;
temp.file = temp.href.substring(temp.href.lastIndexOf("/") + 1);
downloadFile(i, current, temp);
if (!current.name) {
    if(temp.file.includes("commons-lang3")) current.name = "Apache Commons Lang";
    else if(temp.file.includes("asm-all")) current.name = "ASM";
    else if(temp.file.includes("guava")) current.name = "Guava";
    else if(temp.file.includes("jopt-simple")) current.name = "JOpt Simple";
    else if(temp.file.includes("lzma")) current.name = "LZMA";
    else if(temp.file.includes("launchwrapper")) current.name = "Minecraft LaunchWrapper";
};
if (!("disabled" in current)) current.disabled = false;
