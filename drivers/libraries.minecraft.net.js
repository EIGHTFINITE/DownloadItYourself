/**
 * Driver for downloading from libraries.minecraft.net
 */
temp.href = current.url;
temp.file = temp.href.substring(temp.href.lastIndexOf("/") + 1);
downloadFile(obj, current, i, iPad, temp);
if (!current.name) {
	if(temp.file === "launchwrapper-1.12.jar") current.name = "LaunchWrapper";
};
if (!("disabled" in current)) current.disabled = false;
