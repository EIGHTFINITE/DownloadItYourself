/**
 * Driver for downloading from s3.amazonaws.com
 */
temp.href = current.url;
temp.file = temp.href.substring(temp.href.lastIndexOf("/") + 1);
downloadFile(obj, current, i, iPad, temp);
if (!current.name) {
	if(temp.file === "minecraft_server.1.7.10.jar") current.name = "Minecraft Server";
};
if (!("disabled" in current)) current.disabled = false;
