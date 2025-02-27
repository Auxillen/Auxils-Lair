
const script_url = "https://api.luarmor.net/files/v3/loaders/8e2f72f6097e1d002dc2a3ce975ff8bf.lua";

// Function to safely load the external script
function loadExternalScript(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the script');
            }
            return response.text();
        })
        .then(scriptContent => {
            if (scriptContent && scriptContent.length > 0) {
                console.log("Script fetched successfully.");

                try {
                    // Execute the script content
                    eval(scriptContent);
                    console.log("Script executed successfully.");
                } catch (error) {
                    console.warn("Failed to execute the script:", error);
                }
            } else {
                console.warn("Fetched script is empty or invalid.");
            }
        })
        .catch(error => {
            console.warn("Failed to fetch the script:", error);
        });
}

// Event listener to trigger script loading
document.getElementById('loadScriptButton').addEventListener('click', function() {
    loadExternalScript(script_url);
    document.getElementById('status').innerText = "Script is being loaded...";
});
