/**
 * Driver for downloading from www.dropbox.com
 */
(function() {

// We can only guess which path we would need to go down so hardcode the URLs instead.
if(temp.url === "https://www.dropbox.com/sh/tvn0t4zofx5vqf5/AAC2dcW--1NoDrBUXCxXEsJGa?dl=0") {
	if(temp.name === "StarMiner") {
		temp.url = "https://www.dropbox.com/sh/tvn0t4zofx5vqf5/AACfH-hd9YV2CIi-LWrqYh4aa/Starminer?dl=0";
		updateFile(i, current, temp, callback);
		return;
	}
	else if(temp.name === "JointBlock") {
		temp.url = "https://www.dropbox.com/sh/tvn0t4zofx5vqf5/AADjpCA4lStE8dIYUXoXBlUSa/JointBlock?dl=0";
		updateFile(i, current, temp, callback);
		return;
	}
}
else if(temp.url === "https://www.dropbox.com/sh/tvn0t4zofx5vqf5/AACfH-hd9YV2CIi-LWrqYh4aa/Starminer?dl=0") {
	temp.url = "https://www.dropbox.com/sh/tvn0t4zofx5vqf5/AAAznke8T5I5GlNiiazR5-cpa/Starminer/Starminer1710-0.9.9_please_extract_.zip?dl=1";
	temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
	updateFile(i, current, temp, callback);
	return;
}
else if(temp.url === "https://www.dropbox.com/sh/tvn0t4zofx5vqf5/AADjpCA4lStE8dIYUXoXBlUSa/JointBlock?dl=0") {
	temp.url = "https://www.dropbox.com/sh/tvn0t4zofx5vqf5/AAAMYsA3GCwHvoUR3zsRkQ5Ga/JointBlock/JointBlock1710-0_6_2_please_extract_.zip?dl=1";
	temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
	updateFile(i, current, temp, callback);
	return;
}
throw new Error("Unreachable");

}());
