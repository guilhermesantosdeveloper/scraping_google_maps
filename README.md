#Comando para gerar executavel windows
npx electron-packager . --overwrite --asar.unpack=\"{*.json}\" --platform=win32 --prune=true --out=release-builds --icon=./static/icons/icon.ico
