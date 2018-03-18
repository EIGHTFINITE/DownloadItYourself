/**
 * Driver for downloading from libraries.minecraft.net
 */
temp.href = current.url;
temp.file = temp.href.substring(temp.href.lastIndexOf("/") + 1);
downloadFile(obj, current, i, iPad, temp);
if (!current.name) {
    if(temp.file === "asm-all-5.0.3.jar") current.name = "ASM";
    else if(temp.file === "guava-17.0.jar") current.name = "Guava";
    else if(temp.file === "launchwrapper-1.12.jar") current.name = "LaunchWrapper";
    else if(temp.file === "lzma-0.0.1.jar") current.name = "LZMA";
};
if (!("disabled" in current)) current.disabled = false;
