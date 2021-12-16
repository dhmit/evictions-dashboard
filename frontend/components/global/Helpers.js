export function fixNameCapitalization(name) {
    let parts = name.split("-").join(" ").split(" ");
    let fixedName = "";
    for (let i = 0; i < parts.length; i++) {
        fixedName += (parts[i].charAt(0).toUpperCase() + parts[i].slice(1).toLowerCase()) + " ";
    }
    return fixedName;
}

